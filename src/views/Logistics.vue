<template>
  <div>
    <h1 class="text-3xl font-bold mb-6 dark:text-white">Daily Logistics</h1>

    <div class="mb-6 flex gap-4 items-center">
        <label class="font-bold text-gray-900 dark:text-white">Date:</label>
        <input v-model="date" type="date" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" @change="loadLogistics" />
    </div>

    <div v-if="loading" class="text-center py-8 text-gray-500 dark:text-gray-400">Loading...</div>

    <div v-else class="space-y-6">
        <div v-for="(entry, index) in dispatchList" :key="index" class="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 border-l-4 !border-l-blue-500">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ entry.event.name }}</h2>
                    <p class="text-gray-600 dark:text-gray-400">{{ entry.event.location }} | {{ entry.event.start_time }}</p>
                </div>
                <div class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                    {{ entry.event.type }}
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Items -->
                <div>
                    <h3 class="font-bold border-b mb-2 pb-1 text-gray-900 dark:text-white dark:border-gray-600">Equipment</h3>
                    <ul class="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                        <li v-for="item in entry.items" :key="item.id">
                            <span class="font-semibold">{{ item.quantity }}x</span> {{ item.name }}
                            <span class="text-xs text-gray-500 dark:text-gray-400">({{ item.type }})</span>
                        </li>
                        <li v-if="entry.items.length === 0" class="text-gray-400 italic">No equipment booked</li>
                    </ul>
                </div>

                <!-- Cakes -->
                <div>
                    <h3 class="font-bold border-b mb-2 pb-1 text-gray-900 dark:text-white dark:border-gray-600">Cakes & Consumables</h3>
                    <ul class="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                        <li v-for="cake in entry.cakes" :key="cake.id">
                            <span class="font-semibold">{{ cake.flavor }}</span>
                            <div class="text-sm text-gray-600 dark:text-gray-400">Note: {{ cake.design_notes }}</div>
                            <div v-if="cake.dietary_restrictions !== 'None'" class="text-xs text-red-500 dark:text-red-400 font-bold">
                                ⚠️ {{ cake.dietary_restrictions }}
                            </div>
                        </li>
                         <li v-if="entry.cakes.length === 0" class="text-gray-400 italic">No cakes ordered</li>
                    </ul>
                </div>
            </div>
        </div>

        <div v-if="dispatchList.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-8">
            No events found for this date.
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';

const date = ref(new Date().toISOString().split('T')[0]);
const dispatchList = ref([]);
const loading = ref(false);

const loadLogistics = async () => {
    loading.value = true;
    try {
        const res = await api.get('/logistics/dispatch', { params: { date: date.value } });
        dispatchList.value = res.data;
    } catch (err) {
        console.error(err);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loadLogistics();
});
</script>
