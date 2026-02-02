<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Daily Logistics</h1>

    <div class="mb-6 flex gap-4 items-center">
        <label class="font-bold">Date:</label>
        <input v-model="date" type="date" class="border p-2 rounded" @change="loadLogistics" />
    </div>

    <div v-if="loading" class="text-center py-8">Loading...</div>

    <div v-else class="space-y-6">
        <div v-for="(entry, index) in dispatchList" :key="index" class="bg-white p-6 rounded shadow border-l-4 border-blue-500">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h2 class="text-xl font-bold">{{ entry.event.name }}</h2>
                    <p class="text-gray-600">{{ entry.event.location }} | {{ entry.event.start_time }}</p>
                </div>
                <div class="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    {{ entry.event.type }}
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Items -->
                <div>
                    <h3 class="font-bold border-b mb-2 pb-1">Equipment</h3>
                    <ul class="list-disc pl-5">
                        <li v-for="item in entry.items" :key="item.id">
                            <span class="font-semibold">{{ item.quantity }}x</span> {{ item.name }}
                            <span class="text-xs text-gray-500">({{ item.type }})</span>
                        </li>
                        <li v-if="entry.items.length === 0" class="text-gray-400 italic">No equipment booked</li>
                    </ul>
                </div>

                <!-- Cakes -->
                <div>
                    <h3 class="font-bold border-b mb-2 pb-1">Cakes & Consumables</h3>
                    <ul class="list-disc pl-5">
                        <li v-for="cake in entry.cakes" :key="cake.id">
                            <span class="font-semibold">{{ cake.flavor }}</span>
                            <div class="text-sm text-gray-600">Note: {{ cake.design_notes }}</div>
                            <div v-if="cake.dietary_restrictions !== 'None'" class="text-xs text-red-500 font-bold">
                                ⚠️ {{ cake.dietary_restrictions }}
                            </div>
                        </li>
                         <li v-if="entry.cakes.length === 0" class="text-gray-400 italic">No cakes ordered</li>
                    </ul>
                </div>
            </div>
        </div>

        <div v-if="dispatchList.length === 0" class="text-center text-gray-500 py-8">
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
