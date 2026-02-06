<template>
  <router-link :to="to" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
    <slot name="icon"></slot>
    <span class="ml-3"><slot></slot></span>
  </router-link>
</template>

<script setup>
defineProps({
  to: {
      type: String,
      required: true
  }
});
</script>
