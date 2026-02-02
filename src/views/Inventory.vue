<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Inventory & Booking</h1>

    <!-- Check Availability -->
    <div class="bg-white p-6 rounded shadow mb-8">
      <div class="flex gap-4 items-end">
        <div class="flex-1">
            <label class="block text-sm font-bold mb-1">Start Time</label>
            <input v-model="filter.start_time" type="datetime-local" class="border p-2 rounded w-full" />
        </div>
        <div class="flex-1">
            <label class="block text-sm font-bold mb-1">End Time</label>
            <input v-model="filter.end_time" type="datetime-local" class="border p-2 rounded w-full" />
        </div>
        <button @click="loadInventory" class="bg-blue-600 text-white p-2 px-6 rounded hover:bg-blue-700 h-10">
          Check Availability
        </button>
      </div>
    </div>

    <!-- Inventory List -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="item in items" :key="item.id" class="bg-white p-6 rounded shadow">
        <div class="flex justify-between items-start mb-4">
            <div>
                <h3 class="text-lg font-bold">{{ item.name }}</h3>
                <span class="text-xs bg-gray-200 px-2 py-1 rounded capitalize">{{ item.type }}</span>
            </div>
            <div class="text-right">
                <div class="text-2xl font-bold" :class="item.available_quantity > 0 ? 'text-green-600' : 'text-red-600'">
                    {{ item.available_quantity }}
                </div>
                <div class="text-xs text-gray-500">Available</div>
            </div>
        </div>
        <div class="text-sm text-gray-600 mb-4">
            Total Stock: {{ item.total_quantity }} <br>
            Buffer: {{ item.buffer_time_hours }}h
        </div>

        <div v-if="filter.start_time && filter.end_time" class="border-t pt-4">
            <div class="flex gap-2">
                <input v-model.number="bookingQty[item.id]" type="number" min="1" :max="item.available_quantity" class="border p-1 rounded w-20" placeholder="Qty">
                <select v-model="selectedEventId" class="border p-1 rounded flex-1">
                    <option value="" disabled>Select Event</option>
                    <option v-for="evt in events" :key="evt.id" :value="evt.id">{{ evt.name }}</option>
                </select>
            </div>
            <button
                @click="bookItem(item)"
                :disabled="!bookingQty[item.id] || !selectedEventId || item.available_quantity < 1"
                class="mt-2 w-full bg-green-600 text-white py-1 rounded hover:bg-green-700 disabled:opacity-50"
            >
                Book Now
            </button>
        </div>
        <div v-else class="text-sm text-orange-500 italic">
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
