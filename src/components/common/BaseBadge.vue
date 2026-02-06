<template>
  <span :class="['text-xs font-medium mr-2 px-2.5 py-0.5 rounded', colorClasses]">
    <slot></slot>
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'primary' // primary (blue), success (green), danger (red), warning (yellow)
  }
});

const colorClasses = computed(() => {
    switch (props.variant) {
        case 'success':
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'danger':
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        case 'warning':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case 'primary':
        default:
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
});
</script>
