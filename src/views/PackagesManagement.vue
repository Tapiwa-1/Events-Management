<template>
  <div class="p-4">
    <div class="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-bold dark:text-white">Packages Pricing</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">Set and update package pricing shown on the landing page.</p>
      </div>
      <button
        type="button"
        class="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="saving"
        @click="savePricing"
      >
        {{ saving ? 'Saving...' : 'Save Changes' }}
      </button>
    </div>

    <p v-if="message" class="mb-4 rounded border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">{{ message }}</p>
    <p v-if="error" class="mb-4 rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{{ error }}</p>

    <div class="grid gap-6 lg:grid-cols-2">
      <section class="rounded-lg border bg-white p-5 shadow dark:border-gray-700 dark:bg-gray-800">
        <h2 class="mb-4 text-xl font-semibold dark:text-white">PA System Pricing</h2>
        <div class="space-y-3">
          <label class="block text-sm font-medium dark:text-white">Less than 100 people</label>
          <input v-model.number="form.pa_under_100" type="number" min="0" step="0.01" class="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />

          <label class="block text-sm font-medium dark:text-white">Less than 200 people</label>
          <input v-model.number="form.pa_under_200" type="number" min="0" step="0.01" class="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />

          <label class="block text-sm font-medium dark:text-white">Less than 350 people</label>
          <input v-model.number="form.pa_under_350" type="number" min="0" step="0.01" class="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
        </div>
      </section>

      <section class="rounded-lg border bg-white p-5 shadow dark:border-gray-700 dark:bg-gray-800">
        <h2 class="mb-4 text-xl font-semibold dark:text-white">Décor Pricing</h2>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium dark:text-white">20 people</label>
            <input v-model.number="form.decor_20" type="number" min="0" step="0.01" class="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <label class="block text-sm font-medium dark:text-white">30 people</label>
            <input v-model.number="form.decor_30" type="number" min="0" step="0.01" class="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <label class="block text-sm font-medium dark:text-white">40 people</label>
            <input v-model.number="form.decor_40" type="number" min="0" step="0.01" class="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <label class="block text-sm font-medium dark:text-white">50 people</label>
            <input v-model.number="form.decor_50" type="number" min="0" step="0.01" class="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
        </div>
      </section>

      <section class="rounded-lg border bg-white p-5 shadow dark:border-gray-700 dark:bg-gray-800">
        <h2 class="mb-4 text-xl font-semibold dark:text-white">Media Pricing</h2>
        <p class="mb-2 text-sm text-gray-600 dark:text-gray-400">Roora options</p>
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium dark:text-white">Still Pictures</label>
            <input v-model.number="form.media_roora_still" type="number" min="0" step="0.01" class="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <label class="block text-sm font-medium dark:text-white">Picture + Reel Video</label>
            <input v-model.number="form.media_roora_reel" type="number" min="0" step="0.01" class="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <label class="block text-sm font-medium dark:text-white">Wedding note</label>
            <input v-model="form.media_wedding_note" type="text" class="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
        </div>
      </section>

      <section class="rounded-lg border bg-white p-5 shadow dark:border-gray-700 dark:bg-gray-800">
        <h2 class="mb-4 text-xl font-semibold dark:text-white">Catering</h2>
        <label class="block text-sm font-medium dark:text-white">Price per plate</label>
        <input v-model.number="form.catering_per_plate" type="number" min="0" step="0.01" class="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import api from '../api';

const saving = ref(false);
const message = ref('');
const error = ref('');

const form = ref({
  pa_under_100: 130,
  pa_under_200: 200,
  pa_under_350: 250,
  decor_20: 180,
  decor_30: 220,
  decor_40: 280,
  decor_50: 300,
  media_roora_still: 120,
  media_roora_reel: 180,
  media_wedding_note: 'Coming soon',
  catering_per_plate: 2.5,
});

const loadPricing = async () => {
  try {
    const { data } = await api.get('/packages');
    form.value = { ...form.value, ...data };
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to load package pricing.';
  }
};

const savePricing = async () => {
  saving.value = true;
  message.value = '';
  error.value = '';
  try {
    const { data } = await api.put('/packages', form.value);
    form.value = { ...form.value, ...data };
    message.value = 'Package pricing saved successfully.';
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to save package pricing.';
  } finally {
    saving.value = false;
  }
};

onMounted(loadPricing);
</script>
