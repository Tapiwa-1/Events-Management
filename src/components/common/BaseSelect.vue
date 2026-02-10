<template>
  <div>
    <label v-if="label" :for="selectId" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      {{ label }}
    </label>
    <select
      :id="selectId"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      :required="required"
    >
      <slot></slot>
    </select>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  label: String,
  modelValue: [String, Number],
  id: String,
  required: Boolean
});

defineEmits(['update:modelValue']);

const selectId = computed(() => props.id || `select-${Math.random().toString(36).substr(2, 9)}`);
</script>
