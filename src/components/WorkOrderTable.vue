<script setup lang="ts">
import { computed } from "vue";
import { type WorkOrder } from "../assets/mockData";
import {
  message,
  Modal
} from "ant-design-vue";

// Props: 接收数据和是否为管理员的标志
const props = defineProps<{
  data: WorkOrder[];
  isAdmin: boolean;
}>();

// Events: 定义删除事件
const emit = defineEmits<{
  (e: "delete-order", id: string): void;
}>();

// 表格列定义，根据 isAdmin 动态添加操作列
const columns = computed(() => {
  const baseColumns: any[] = [
    { title: "ID", dataIndex: "id", key: "id", width: 100, fixed: 'left' },
    { title: "项目 (Project)", dataIndex: "project", key: "project" },
    { title: "是否加班 (Overtime)", dataIndex: "overtime", key: "overtime", width: 120 },
    { title: "工时 (Hours)", dataIndex: "hours", key: "hours", sorter: (a: WorkOrder, b: WorkOrder) => a.hours - b.hours, width: 100 },
    { title: "创建时间 (Created At)", dataIndex: "created_at", key: "created_at", width: 140 },
  ];

  if (props.isAdmin) {
    baseColumns.push({
      title: "操作",
      key: "action",
      width: 100,
      fixed: 'right',
    });
  }

  return baseColumns;
});

// 删除确认模态框
function confirmDelete(id: string) {
  Modal.confirm({
    title: '确认删除',
    content: `您确定要删除 ID 为 ${id} 的工单记录吗？删除后图表将同步更新。`,
    okText: '确认删除',
    okType: 'danger',
    cancelText: '取消',
    onOk() {
      emit('delete-order', id);
      message.success(`工单 ${id} 删除成功`);
    },
  });
}
</script>

<template>
  <a-card title="工单列表" class="table-card">
    <template #extra>
      <a-tag :color="isAdmin ? 'red' : 'green'">
        {{ isAdmin ? '管理员模式 (可删除)' : '普通用户模式 (仅查看)' }}
      </a-tag>
    </template>
    
    <a-table 
      :columns="columns" 
      :data-source="data" 
      :pagination="{ pageSize: 10 }" 
      :scroll="{ x: 700 }"
      row-key="id"
      size="middle"
    >
      <!-- 自定义 Overtime 列的渲染 -->
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.key === 'overtime'">
          <a-tag :color="text === '是' ? 'volcano' : 'blue'">
            {{ text }}
          </a-tag>
        </template>
        <!-- 自定义 Action 列的渲染 (仅管理员可见) -->
        <template v-else-if="column.key === 'action' && isAdmin">
            <a-button type="link" danger @click="confirmDelete(record.id)">删除</a-button>
        </template>
      </template>
    </a-table>
  </a-card>
</template>

<style scoped>
.table-card {
  height: 100%;
}
</style>
