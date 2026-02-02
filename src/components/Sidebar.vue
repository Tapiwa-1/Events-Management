<template>
  <div class="h-screen w-64 bg-gray-800 text-white flex flex-col">
    <div class="p-4 text-2xl font-bold">EventMgr</div>
    <div class="p-4 border-b border-gray-700">
        <p class="text-sm">Welcome, {{ authStore.user?.name }}</p>
        <p class="text-xs text-gray-400 capitalize">{{ authStore.user?.role }}</p>
    </div>
    <nav class="flex-1 p-4 space-y-2">
      <router-link to="/" class="block py-2 px-4 rounded hover:bg-gray-700">Dashboard</router-link>
      <router-link to="/events" class="block py-2 px-4 rounded hover:bg-gray-700">Events</router-link>
      <router-link to="/inventory" class="block py-2 px-4 rounded hover:bg-gray-700">Inventory</router-link>
      <router-link v-if="authStore.isStaff" to="/logistics" class="block py-2 px-4 rounded hover:bg-gray-700">Logistics</router-link>
      <router-link v-if="authStore.isAdmin" to="/admin/logs" class="block py-2 px-4 rounded hover:bg-gray-700">Audit Logs</router-link>
    </nav>
    <div class="p-4 border-t border-gray-700">
        <router-link to="/profile" class="block py-2 px-4 rounded hover:bg-gray-700 mb-2">Profile</router-link>
      <button @click="handleLogout" class="w-full text-left py-2 px-4 rounded hover:bg-red-700">Logout</button>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
    await authStore.logout();
    router.push('/login');
};
</script>
