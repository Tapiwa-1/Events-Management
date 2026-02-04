<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Events Management</h1>
      <button @click="openModal()" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Create New Event
      </button>
    </div>

    <!-- Events Table -->
    <div class="bg-white rounded shadow overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-100 border-b">
            <th class="p-4 font-semibold">Name</th>
            <th class="p-4 font-semibold">Date</th>
            <th class="p-4 font-semibold">Status</th>
            <th class="p-4 font-semibold">Total</th>
            <th class="p-4 font-semibold">Paid</th>
            <th class="p-4 font-semibold">Remaining</th>
            <th class="p-4 font-semibold">Transport</th>
            <th class="p-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in events" :key="event.id" class="border-b hover:bg-gray-50">
            <td class="p-4">{{ event.name }}</td>
            <td class="p-4">{{ formatDate(event.date) }}</td>
            <td class="p-4">
              <span :class="statusClass(event.status)" class="px-2 py-1 rounded text-xs font-bold uppercase">
                {{ event.status }}
              </span>
            </td>
            <td class="p-4">${{ formatCurrency(event.total_cost) }}</td>
            <td class="p-4">${{ formatCurrency(event.amount_paid) }}</td>
            <td class="p-4 text-red-600 font-semibold">${{ formatCurrency(event.total_cost - event.amount_paid) }}</td>
             <td class="p-4 text-gray-600">${{ formatCurrency(event.transport_cost) }}</td>
            <td class="p-4">
              <button @click="editEvent(event)" class="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
            </td>
          </tr>
          <tr v-if="events.length === 0">
            <td colspan="8" class="p-4 text-center text-gray-500">No events found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white p-6 rounded shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 class="text-2xl font-bold mb-4">{{ isEditing ? 'Edit Event' : 'Create New Event' }}</h2>

        <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="col-span-2 md:col-span-1">
            <label class="block text-sm font-bold mb-1">Event Name</label>
            <input v-model="form.name" type="text" placeholder="Wedding" class="w-full border p-2 rounded" required />
          </div>

          <div class="col-span-2 md:col-span-1">
            <label class="block text-sm font-bold mb-1">Date</label>
            <input v-model="form.date" type="date" class="w-full border p-2 rounded" required />
          </div>

          <div>
            <label class="block text-sm font-bold mb-1">Start Time</label>
            <input v-model="form.start_time" type="datetime-local" class="w-full border p-2 rounded" />
          </div>

          <div>
            <label class="block text-sm font-bold mb-1">End Time</label>
            <input v-model="form.end_time" type="datetime-local" class="w-full border p-2 rounded" />
          </div>

          <div class="col-span-2">
            <label class="block text-sm font-bold mb-1">Location</label>
            <input v-model="form.location" type="text" class="w-full border p-2 rounded" />
          </div>

           <!-- Financials -->
          <div>
            <label class="block text-sm font-bold mb-1" for="total_cost">Total Cost ($)</label>
            <input id="total_cost" v-model.number="form.total_cost" type="number" step="0.01" min="0" placeholder="0.00" class="w-full border p-2 rounded" />
          </div>

          <div>
             <label class="block text-sm font-bold mb-1" for="amount_paid">Amount Paid / Deposit ($)</label>
             <input id="amount_paid" v-model.number="form.amount_paid" type="number" step="0.01" min="0" placeholder="0.00" class="w-full border p-2 rounded" />
          </div>

          <div>
             <label class="block text-sm font-bold mb-1" for="transport_cost">Transport Cost ($)</label>
             <input id="transport_cost" v-model.number="form.transport_cost" type="number" step="0.01" min="0" placeholder="0.00" class="w-full border p-2 rounded" />
          </div>

          <div class="flex items-center pt-6">
             <div class="text-lg font-bold text-gray-700">
               Remaining: <span :class="remaining < 0 ? 'text-green-600' : 'text-red-600'">${{ formatCurrency(remaining) }}</span>
             </div>
          </div>

          <!-- Status (Edit only) -->
          <div v-if="isEditing" class="col-span-2 border-t pt-4 mt-2">
             <label class="block text-sm font-bold mb-1">Status</label>
             <select v-model="form.status" class="w-full border p-2 rounded">
               <option value="planned">Planned</option>
               <option value="completed">Completed</option>
               <option value="cancelled">Cancelled</option>
             </select>
          </div>

           <!-- Failure Reason (Edit only) -->
          <div v-if="isEditing && (form.status === 'cancelled' || form.status === 'failed')" class="col-span-2">
             <label class="block text-sm font-bold mb-1">Reason for Failure/Cancel</label>
             <textarea v-model="form.failure_reason" class="w-full border p-2 rounded"></textarea>
          </div>

          <div class="col-span-2 flex justify-end space-x-2 mt-4 border-t pt-4">
            <button type="button" @click="closeModal" class="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                {{ isEditing ? 'Save Changes' : 'Create Event' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../api';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const events = ref([]);
const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref(null);

const form = ref({
  name: '',
  date: '',
  start_time: '',
  end_time: '',
  location: '',
  status: 'planned',
  total_cost: 0,
  amount_paid: 0,
  transport_cost: 0,
  failure_reason: ''
});

const remaining = computed(() => {
    return (parseFloat(form.value.total_cost) || 0) - (parseFloat(form.value.amount_paid) || 0);
});

const loadEvents = async () => {
  try {
    const res = await api.get('/events');
    events.value = res.data;
  } catch (err) {
    console.error('Failed to load events', err);
  }
};

const formatDate = (d) => {
    if (!d) return '-';
    return new Date(d).toLocaleDateString();
};

const formatCurrency = (val) => {
    return (parseFloat(val) || 0).toFixed(2);
};

const statusClass = (status) => {
    switch(status) {
        case 'completed': return 'bg-green-100 text-green-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-blue-100 text-blue-800';
    }
};

const openModal = () => {
  isEditing.value = false;
  editingId.value = null;
  form.value = {
      name: '',
      date: new Date().toISOString().split('T')[0],
      start_time: '',
      end_time: '',
      location: '',
      status: 'planned',
      total_cost: 0,
      amount_paid: 0,
      transport_cost: 0,
      failure_reason: ''
  };
  showModal.value = true;
};

const editEvent = (event) => {
  isEditing.value = true;
  editingId.value = event.id;
  form.value = { ...event };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const handleSubmit = async () => {
  try {
    const payload = {
        ...form.value,
        amount_paid: Number(form.value.amount_paid) || 0,
        total_cost: Number(form.value.total_cost) || 0,
        transport_cost: Number(form.value.transport_cost) || 0
    };

    if (isEditing.value) {
        await api.put(`/events/${editingId.value}`, payload);
    } else {
        await api.post('/events', { ...payload, client_id: authStore.user?.id || 1 });
    }
    await loadEvents();
    showModal.value = false;
  } catch (err) {
    console.error(err);
    alert('Operation failed');
  }
};

onMounted(() => {
  loadEvents();
});
</script>
