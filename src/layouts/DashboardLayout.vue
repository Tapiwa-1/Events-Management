<template>
  <div class="flex">
    <Sidebar />
    <main class="flex-1 p-8 bg-gray-50 h-screen overflow-y-auto">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue';
</script>
