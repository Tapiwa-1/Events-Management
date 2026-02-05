<template>
  <div class="p-4">
    <div class="flex flex-col md:flex-row justify-between items-center mb-6">
      <h1 class="text-3xl font-bold dark:text-white mb-4 md:mb-0">Manage Inventory</h1>

      <!-- Dropdown for selecting the inventory type -->
      <div class="w-full md:w-64">
        <label for="inventory-select" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Inventory</label>
        <select
          id="inventory-select"
          v-model="selectedCategory"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="pa">PA System</option>
          <option value="photography">Photography</option>
          <option value="decor">Decor</option>
        </select>
      </div>
    </div>

    <!-- Coming Soon Section -->
    <div class="flex flex-col items-center justify-center p-12 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Coming Soon</h2>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
          Inventory management for <span class="font-semibold">{{ categoryLabel }}</span> is currently under development.
        </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const selectedCategory = ref('pa');

const categoryLabel = computed(() => {
  switch (selectedCategory.value) {
    case 'pa': return 'PA System';
    case 'photography': return 'Photography';
    case 'decor': return 'Decor';
    default: return '';
  }
});
</script>
