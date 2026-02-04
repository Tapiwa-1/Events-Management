<template>
  <div>
    <h1 class="text-3xl font-bold mb-6 dark:text-white">Inventory & Booking</h1>

    <!-- Check Availability -->
    <div class="block p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-8">
      <div class="flex gap-4 items-end flex-wrap">
        <div class="flex-1 min-w-[200px]">
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Start Time</label>
            <input v-model="filter.start_time" type="datetime-local" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>
        <div class="flex-1 min-w-[200px]">
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">End Time</label>
            <input v-model="filter.end_time" type="datetime-local" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>
        <button @click="loadInventory" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 h-[42px]">
          Check Availability
        </button>
      </div>
    </div>

    <!-- Inventory List -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="item in items" :key="item.id" class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <div class="flex justify-between items-start mb-4">
            <div>
                <h3 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{ item.name }}</h3>
                <span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 capitalize">{{ item.type }}</span>
            </div>
            <div class="text-right">
                <div class="text-2xl font-bold" :class="item.available_quantity > 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'">
                    {{ item.available_quantity }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">Available</div>
            </div>
        </div>
        <div class="font-normal text-gray-700 dark:text-gray-400 mb-4 text-sm">
            Total Stock: {{ item.total_quantity }} <br>
            Buffer: {{ item.buffer_time_hours }}h
        </div>

        <div v-if="filter.start_time && filter.end_time" class="border-t pt-4 dark:border-gray-600">
            <div class="flex gap-2">
                <input v-model.number="bookingQty[item.id]" type="number" min="1" :max="item.available_quantity" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-20 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Qty">
                <select v-model="selectedEventId" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white flex-1">
                    <option value="" disabled>Select Event</option>
                    <option v-for="evt in events" :key="evt.id" :value="evt.id">{{ evt.name }}</option>
                </select>
            </div>
            <button
                @click="bookItem(item)"
                :disabled="!bookingQty[item.id] || !selectedEventId || item.available_quantity < 1"
                class="mt-3 w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 disabled:opacity-50"
            >
                Book Now
            </button>
        </div>
        <div v-else class="text-sm text-orange-500 dark:text-orange-400 italic">
            Select dates to book
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import api from '../api';

const items = ref([]);
const events = ref([]);
const filter = reactive({
  start_time: '',
  end_time: ''
});
const bookingQty = ref({});
const selectedEventId = ref('');

const loadInventory = async () => {
  try {
    const params = {};
    if (filter.start_time) params.start_time = filter.start_time;
    if (filter.end_time) params.end_time = filter.end_time;

    const res = await api.get('/inventory', { params });
    items.value = res.data;
  } catch (err) {
    console.error(err);
  }
};

const loadEvents = async () => {
    const res = await api.get('/events');
    events.value = res.data;
};

const bookItem = async (item) => {
    const qty = bookingQty.value[item.id];
    if (!qty) return;

    try {
        await api.post('/inventory/book', {
            event_id: selectedEventId.value,
            item_id: item.id,
            quantity: qty,
            start_time: filter.start_time,
            end_time: filter.end_time
        });
        alert('Booking successful!');
        loadInventory(); // Refresh availability
    } catch (err) {
        alert(err.response?.data?.error || 'Booking failed');
    }
};

onMounted(() => {
  loadInventory();
  loadEvents();
});
</script>
