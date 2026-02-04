<template>
  <aside id="default-sidebar" class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
    <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div class="mb-5 px-2">
            <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">EventMgr</span>
            <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ authStore.user?.name }} ({{ authStore.user?.role }})
            </div>
        </div>

        <ul class="space-y-2 font-medium">
            <li>
                <router-link to="/" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    <span class="ml-3">Dashboard</span>
                </router-link>
            </li>
            <li>
                <router-link to="/events" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    <span class="ml-3">Events</span>
                </router-link>
            </li>
            <li>
                <router-link to="/inventory" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    <span class="ml-3">Inventory</span>
                </router-link>
            </li>
            <li>
                <router-link to="/business" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    <span class="ml-3">Business Management</span>
                </router-link>
            </li>
            <li v-if="authStore.isStaff">
                <router-link to="/logistics" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    <span class="ml-3">Logistics</span>
                </router-link>
            </li>
            <li v-if="authStore.isAdmin">
                 <router-link to="/admin/logs" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    <span class="ml-3">Audit Logs</span>
                </router-link>
            </li>
        </ul>

        <ul class="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
            <li>
                <router-link to="/profile" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    <span class="ml-3">Profile</span>
                </router-link>
            </li>
            <li>
                <button @click="handleLogout" class="flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-red-100 dark:hover:bg-red-900 group">
                    <span class="ml-3 text-red-600 dark:text-red-400">Logout</span>
                </button>
            </li>
        </ul>
    </div>
  </aside>
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
