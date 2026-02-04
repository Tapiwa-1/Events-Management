<template>
  <div>
    <h1 class="text-4xl font-bold mb-8 dark:text-white">Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <router-link to="/events" class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-500">Events</h5>
            <p class="font-normal text-gray-700 dark:text-gray-400">Manage client events and bookings.</p>
        </router-link>

        <router-link to="/inventory" class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-green-600 dark:text-green-500">Inventory</h5>
            <p class="font-normal text-gray-700 dark:text-gray-400">Check stock availability and make reservations.</p>
        </router-link>

        <router-link v-if="authStore.isStaff" to="/logistics" class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-orange-600 dark:text-orange-500">Logistics</h5>
            <p class="font-normal text-gray-700 dark:text-gray-400">View daily dispatch and pickup lists.</p>
        </router-link>

        <div class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-purple-600 dark:text-purple-500">My Profile</h5>
            <p class="font-normal text-gray-700 dark:text-gray-400">{{ authStore.user?.name }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ authStore.user?.email }}</p>
        </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth';
const authStore = useAuthStore();
</script>
