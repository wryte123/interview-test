import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const role = ref<string | null>(null); // 'admin'|'user'|null
  const username = ref<string | null>(null);

  function loginAs(user: string) {
    username.value = user;
    role.value = user === "admin" ? "admin" : "user";
  }
  function logout() {
    username.value = null;
    role.value = null;
  }

  return { role, username, loginAs, logout };
});
