<template>
  <button
    :type="type"
    :class="[
      'focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none',
      variantClasses,
      customClass
    ]"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  customClass: {
    type: String,
    default: ''
  }
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800';
    case 'secondary':
      return 'text-gray-500 bg-white hover:bg-gray-100 focus:ring-blue-300 border border-gray-200 hover:text-gray-900 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600';
    case 'danger':
      return 'text-white bg-red-700 hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800';
    case 'success':
      return 'text-white bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800';
    default:
      return 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800';
  }
});
</script>
