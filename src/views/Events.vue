<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold dark:text-white">Events Management</h1>
      <button @click="openModal()" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
        Create New Event
      </button>
    </div>

    <!-- Events Table -->
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">Name</th>
            <th scope="col" class="px-6 py-3">Date</th>
            <th scope="col" class="px-6 py-3">Status</th>
            <th scope="col" class="px-6 py-3">Total</th>
            <th scope="col" class="px-6 py-3">Paid</th>
            <th scope="col" class="px-6 py-3">Remaining</th>
            <th scope="col" class="px-6 py-3">Transport</th>
            <th scope="col" class="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in events" :key="event.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ event.name }}</td>
            <td class="px-6 py-4">{{ formatDate(event.date) }}</td>
            <td class="px-6 py-4">
              <span :class="statusClass(event.status)" class="text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                {{ event.status }}
              </span>
            </td>
            <td class="px-6 py-4">${{ formatCurrency(event.total_cost) }}</td>
            <td class="px-6 py-4">${{ formatCurrency(event.amount_paid) }}</td>
            <td class="px-6 py-4 font-semibold" :class="(event.total_cost - event.amount_paid) > 0 ? 'text-red-600 dark:text-red-500' : 'text-green-600 dark:text-green-500'">
                ${{ formatCurrency(event.total_cost - event.amount_paid) }}
            </td>
             <td class="px-6 py-4 text-gray-500 dark:text-gray-400">${{ formatCurrency(event.transport_cost) }}</td>
            <td class="px-6 py-4">
              <button @click="editEvent(event)" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
            </td>
          </tr>
          <tr v-if="events.length === 0">
            <td colspan="8" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No events found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div class="relative w-full max-w-2xl max-h-full">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                    {{ isEditing ? 'Edit Event' : 'Create New Event' }}
                </h3>
                <button @click="closeModal" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                    <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>

            <!-- Modal body -->
            <div class="p-6 space-y-6">
                <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="col-span-2 md:col-span-1">
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Event Name</label>
                        <input v-model="form.name" type="text" placeholder="Wedding" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                    </div>

                    <div class="col-span-2 md:col-span-1">
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date</label>
                        <input v-model="form.date" type="date" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                    </div>

                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Start Time</label>
                        <input v-model="form.start_time" type="datetime-local" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
                    </div>

                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">End Time</label>
                        <input v-model="form.end_time" type="datetime-local" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
                    </div>

                    <div class="col-span-2">
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Location</label>
                        <input v-model="form.location" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
                    </div>

                    <!-- Financials -->
                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="total_cost">Total Cost ($)</label>
                        <input id="total_cost" v-model.number="form.total_cost" type="number" step="0.01" min="0" placeholder="0.00" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
                    </div>

                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="amount_paid">Amount Paid / Deposit ($)</label>
                        <input id="amount_paid" v-model.number="form.amount_paid" type="number" step="0.01" min="0" placeholder="0.00" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
                    </div>

                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="transport_cost">Transport Cost ($)</label>
                        <input id="transport_cost" v-model.number="form.transport_cost" type="number" step="0.01" min="0" placeholder="0.00" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
                    </div>

                    <div class="flex items-center pt-6">
                        <div class="text-lg font-bold text-gray-700 dark:text-gray-300">
                        Remaining: <span :class="remaining < 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-500'">${{ formatCurrency(remaining) }}</span>
                        </div>
                    </div>

                    <!-- Status (Edit only) -->
                    <div v-if="isEditing" class="col-span-2 border-t dark:border-gray-600 pt-4 mt-2">
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status</label>
                        <select v-model="form.status" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
                        <option value="planned">Planned</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <!-- Failure Reason (Edit only) -->
                    <div v-if="isEditing && (form.status === 'cancelled' || form.status === 'failed')" class="col-span-2">
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Reason for Failure/Cancel</label>
                        <textarea v-model="form.failure_reason" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"></textarea>
                    </div>
                </form>
            </div>

            <!-- Modal footer -->
            <div class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600 justify-end">
                <button type="button" @click="closeModal" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Cancel</button>
                <button @click="handleSubmit" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    {{ isEditing ? 'Save Changes' : 'Create Event' }}
                </button>
            </div>
        </div>
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
        case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
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
