<template>
  <div>
    <label v-if="label" :for="inputId" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      {{ label }}
    </label>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      @input="handleInput"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      :placeholder="placeholder"
      :required="required"
      :step="step"
      :min="min"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  label: String,
  modelValue: [String, Number],
  modelModifiers: {
    default: () => ({})
  },
  type: {
    type: String,
    default: 'text'
  },
  id: String,
  placeholder: String,
  required: Boolean,
  step: String,
  min: [String, Number]
});

const emit = defineEmits(['update:modelValue']);

const inputId = computed(() => props.id || `input-${Math.random().toString(36).substr(2, 9)}`);

const handleInput = (event) => {
  let value = event.target.value;
  // If the .number modifier is used or input type is number, try to cast to number
  if (props.modelModifiers.number || props.type === 'number') {
      if (value === '') {
          // Keep empty string if empty
      } else {
          const num = parseFloat(value);
          if (!isNaN(num)) {
              value = num;
          }
      }
  }
  emit('update:modelValue', value);
};
</script>
