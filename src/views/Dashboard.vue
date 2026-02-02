<template>
  <div>
    <h1 class="text-4xl font-bold mb-8">Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <router-link to="/events" class="bg-white p-6 rounded shadow hover:shadow-lg transition">
            <h2 class="text-xl font-bold text-blue-600 mb-2">Events</h2>
            <p class="text-gray-600">Manage client events and bookings.</p>
        </router-link>

        <router-link to="/inventory" class="bg-white p-6 rounded shadow hover:shadow-lg transition">
            <h2 class="text-xl font-bold text-green-600 mb-2">Inventory</h2>
            <p class="text-gray-600">Check stock availability and make reservations.</p>
        </router-link>

        <router-link v-if="authStore.isStaff" to="/logistics" class="bg-white p-6 rounded shadow hover:shadow-lg transition">
            <h2 class="text-xl font-bold text-orange-600 mb-2">Logistics</h2>
            <p class="text-gray-600">View daily dispatch and pickup lists.</p>
        </router-link>

        <div class="bg-white p-6 rounded shadow">
            <h2 class="text-xl font-bold text-purple-600 mb-2">My Profile</h2>
            <p class="text-gray-600 mb-2">{{ authStore.user?.name }}</p>
            <p class="text-sm text-gray-400">{{ authStore.user?.email }}</p>
        </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth';
const authStore = useAuthStore();
</script>
