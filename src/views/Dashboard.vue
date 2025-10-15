// src/views/Dashboard.vue
<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user";
import WorkOrderTable from "@/components/WorkOrderTable.vue";
import ProjectChart from "@/components/ProjectChart.vue";
import { mockOrders, type WorkOrder } from "../assets/mockData";

const router = useRouter();
const store = useUserStore();

// 初始化数据
const orders = ref<WorkOrder[]>([...mockOrders]);

// 是否管理员
const isAdmin = computed(() => store.role === "admin");

// 删除逻辑
function handleDelete(id: string) {
  orders.value = orders.value.filter((o) => o.id !== id);
}

// 退出登录
function onLogout() {
  store.logout();
  router.push("/login");
}
</script>

<template>
  <a-layout class="app-layout">
    <!-- Header -->
    <a-layout-header class="header">
      <div class="header-left">工单管理面板</div>
      <div class="header-right">
        <span style="margin-right: 15px;">
          当前角色: 
          <a-tag color="processing">{{ store.role === 'admin'? '管理员' : '普通用户' }}</a-tag>
        </span>
        <a-button type="link" danger @click="onLogout">退出</a-button>
      </div>
    </a-layout-header>

    <!-- Main Content -->
    <a-layout-content class="container">
      <a-row :gutter="16">
        <!-- 表格区域 -->
        <a-col :xs="24" :md="14">
          <WorkOrderTable
            :data="orders"
            :is-admin="isAdmin"
            @delete-order="handleDelete"
          />
        </a-col>

        <!-- 图表区域 -->
        <a-col :xs="24" :md="10">
          <ProjectChart :data="orders" />
        </a-col>
      </a-row>
    </a-layout-content>
  </a-layout>
</template>

<style scoped lang="less">
.app-layout {
  min-height: 100vh;
  background: #f0f2f5;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1677ff;
  color: #fff;
  font-size: 16px;
  padding: 0 24px;
  line-height: 64px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.container {
  padding: 24px;
}

.user {
  opacity: 0.9;
}
</style>
