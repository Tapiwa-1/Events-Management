<template>
  <div class="antialiased bg-gray-50 dark:bg-gray-900 min-h-screen">
    <Sidebar />
    <main class="p-4 sm:ml-64 pt-6 h-auto">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue';
</script>
