<template>
  <div>
    <h1 class="text-3xl font-bold mb-6 dark:text-white">Inventory & Booking</h1>

    <div id="accordion-inventory" data-accordion="collapse">
      <!-- PA System -->
      <h2 id="accordion-inventory-heading-1">
        <button type="button" @click="toggle(1)" class="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3" :class="{'bg-gray-100 dark:bg-gray-800': active === 1}">
          <span>PA System</span>
          <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6" :class="{'rotate-0': active === 1}">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
          </svg>
        </button>
      </h2>
      <div id="accordion-inventory-body-1" :class="{'hidden': active !== 1}">
        <div class="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
          <p class="mb-2 text-gray-500 dark:text-gray-400">Coming Soon</p>
        </div>
      </div>

      <!-- Photography -->
      <h2 id="accordion-inventory-heading-2">
        <button type="button" @click="toggle(2)" class="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3" :class="{'bg-gray-100 dark:bg-gray-800': active === 2}">
          <span>Photography</span>
          <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6" :class="{'rotate-0': active === 2}">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
          </svg>
        </button>
      </h2>
      <div id="accordion-inventory-body-2" :class="{'hidden': active !== 2}">
        <div class="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
          <p class="mb-2 text-gray-500 dark:text-gray-400">Coming Soon</p>
        </div>
      </div>

      <!-- Decor -->
      <h2 id="accordion-inventory-heading-3">
        <button type="button" @click="toggle(3)" class="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-gray-200 rounded-b-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3" :class="{'rounded-b-none border-b-0 bg-gray-100 dark:bg-gray-800': active === 3}">
          <span>Decor</span>
          <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6" :class="{'rotate-0': active === 3}">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
          </svg>
        </button>
      </h2>
      <div id="accordion-inventory-body-3" :class="{'hidden': active !== 3}">
        <div class="p-5 border border-t-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900 rounded-b-xl">
          <p class="mb-2 text-gray-500 dark:text-gray-400">Coming Soon</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const active = ref(null);

const toggle = (id) => {
  active.value = active.value === id ? null : id;
};
</script>
