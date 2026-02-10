<template>
  <div class="antialiased bg-gray-50 dark:bg-gray-900 min-h-screen">
    <!-- Mobile Top Bar -->
    <div class="sm:hidden bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center fixed top-0 left-0 right-0 z-30">
        <span class="text-xl font-semibold dark:text-white">EventMgr</span>
        <button
            @click="isSidebarOpen = !isSidebarOpen"
            type="button"
            class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-label="Open sidebar"
        >
            <span class="sr-only">Open sidebar</span>
            <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
               <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 5A.75.75 0 012.75 9h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 9.75zm0 5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"></path>
            </svg>
        </button>
    </div>

    <Sidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />

    <!-- Overlay for mobile sidebar -->
    <div
        v-if="isSidebarOpen"
        @click="isSidebarOpen = false"
        class="bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-30 sm:hidden"
    ></div>

    <main class="p-4 sm:ml-64 pt-20 sm:pt-6 h-auto">
      <router-view v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from '../components/Sidebar.vue';

const isSidebarOpen = ref(false);
const route = useRoute();

// Close sidebar on route change
watch(route, () => {
    isSidebarOpen.value = false;
});
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
