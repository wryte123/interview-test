<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { useUserStore } from "../store/user";

const router = useRouter();
const store = useUserStore();

const form = reactive({
  username: "",
  password: "",
});

function onFinish() {
  if (!form.username || !form.password) {
    message.error("用户名或密码不能为空");
    return;
  }
  store.loginAs(form.username);
  message.success(`欢迎，${form.username}`);
  router.push("/dashboard");
}
</script>

<template>
  <div class="login-page">
    <a-card class="login-card" title="登录系统">
      <a-form :model="form" @finish="onFinish" layout="vertical">
        <a-form-item
          label="用户名"
          name="username"
          :rules="[{ required: true, message: '请输入用户名' }]"
        >
          <a-input v-model:value="form.username" placeholder="请输入用户名" />
        </a-form-item>

        <a-form-item
          label="密码"
          name="password"
          :rules="[{ required: true, message: '请输入密码' }]"
        >
          <a-input-password
            v-model:value="form.password"
            placeholder="请输入密码"
          />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" block>登录</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f2f5;
}
.login-card {
  width: 360px;
}
</style>
