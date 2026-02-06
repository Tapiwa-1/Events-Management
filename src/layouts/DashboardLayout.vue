<template>
  <div class="antialiased bg-gray-50 dark:bg-gray-900 min-h-screen">
    <Sidebar />
    <main class="p-4 sm:ml-64 pt-6 h-auto">
      <router-view v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue';
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
