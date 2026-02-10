<template>
  <div class="flex flex-col items-center mt-4">
    <span class="text-sm text-gray-700 dark:text-gray-400">
        Showing <span class="font-semibold text-gray-900 dark:text-white">{{ start }}</span> to <span class="font-semibold text-gray-900 dark:text-white">{{ end }}</span> of <span class="font-semibold text-gray-900 dark:text-white">{{ total }}</span> Entries
    </span>
    <div class="inline-flex mt-2 xs:mt-0">
        <button @click="$emit('prev')" :disabled="currentPage === 1" class="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-blue-800 rounded-l hover:bg-blue-900 dark:bg-blue-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50">
            Prev
        </button>
        <button @click="$emit('next')" :disabled="currentPage === totalPages" class="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-blue-800 border-0 border-l border-blue-700 rounded-r hover:bg-blue-900 dark:bg-blue-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50">
            Next
        </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    currentPage: Number,
    totalPages: Number,
    itemsPerPage: Number,
    totalEntries: Number
});

defineEmits(['prev', 'next']);

const start = computed(() => (props.currentPage - 1) * props.itemsPerPage + 1);
const end = computed(() => Math.min(props.currentPage * props.itemsPerPage, props.totalEntries));
const total = computed(() => props.totalEntries);
</script>
