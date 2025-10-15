<script setup lang="ts">
import { watch, onMounted, ref, onUnmounted, computed } from "vue";
import * as echarts from "echarts";
import { type WorkOrder } from "../assets/mockData";

const props = defineProps<{
  data: WorkOrder[];
}>();

const chartRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

const chartData = computed(() => {
  const projectHours: { [key: string]: number } = {};

  props.data.forEach((order) => {
    projectHours[order.project] =
      (projectHours[order.project] || 0) + order.hours;
  });

  const projects = Object.keys(projectHours);
  const hours = Object.values(projectHours);

  return {
    projects,
    hours,
  };
});

const updateChart = () => {
  if (!chartInstance) return;

  const data = chartData.value;

  const option: echarts.EChartsOption = {
    title: {
      text: "项目工时分布",
      left: "center",
      textStyle: {
        fontSize: 16,
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: (params: any) => {
        const data = params[0];
        return `${data.name}<br/>累计工时: ${data.value} 小时`;
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: data.projects,
      axisLabel: {
        interval: 0,
        rotate: 30, // 标签旋转，防止项目名称过长重叠
        margin: 10,
      },
    },
    yAxis: {
      type: "value",
      name: "累计工时 (小时)",
    },
    series: [
      {
        name: "工时",
        type: "bar",
        data: data.hours,
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#1677FF" }, // Ant Design Blue
            { offset: 1, color: "#69c0ff" },
          ]),
        },
        emphasis: {
          itemStyle: {
            color: "#1890ff",
          },
        },
      },
    ],
  };

  chartInstance.setOption(option, true);
};

// ECharts 初始化函数
const initChart = () => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value);
    updateChart();
    // 监听窗口大小变化以重绘图表
    window.addEventListener("resize", resizeChart);
  }
};

const resizeChart = () => {
  chartInstance?.resize();
};

// 生命周期钩子
onMounted(() => {
  initChart();
});

// 深度监听数据变化，实时更新图表
watch(
  () => props.data,
  () => {
    updateChart();
  },
  { deep: true }
);

// 组件卸载时销毁 ECharts 实例和事件监听
onUnmounted(() => {
  window.removeEventListener("resize", resizeChart);
  if (chartInstance) {
    chartInstance.dispose();
  }
});
</script>

<template>
  <a-card title="项目工时分布图表" class="chart-card">
    <div ref="chartRef" class="chart-container"></div>
  </a-card>
</template>

<style scoped>
.chart-card {
  height: 100%;
}
.chart-container {
  width: 100%;
  /* 确保图表有足够的高度 */
  height: 400px;
}
</style>
