import { useUserStore } from "@/store/user";
import Dashboard from "@/views/Dashboard.vue";
import Login from "@/views/Login.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { path: "/dashboard", component: Dashboard },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const store = useUserStore();
  if (to.path !== "/login" && !store.role) {
    next("/login");
  } else {
    next();
  }
});

export default router;
