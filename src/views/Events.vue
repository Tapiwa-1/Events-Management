<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Events Management</h1>
      <button @click="openModal()" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
        Create New Event
      </button>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-x-hidden overflow-y-auto">
      <div class="relative w-full max-w-2xl max-h-full">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <!-- Modal header -->
          <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ isEditing ? 'Edit Event' : 'Create New Event' }}
            </h3>
            <button @click="showModal = false" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
              <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <!-- Modal body -->
          <div class="p-6">
            <form @submit.prevent="handleSubmit" class="grid grid-cols-1 gap-6">
                <div>
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Event Name</label>
                    <input v-model="form.name" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Wedding" required>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Start Time</label>
                        <input v-model="form.start_time" type="datetime-local" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required>
                    </div>
                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">End Time</label>
                        <input v-model="form.end_time" type="datetime-local" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required>
                    </div>
                </div>
                <div>
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date (Primary)</label>
                    <input v-model="form.date" type="date" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required>
                </div>
                <div>
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Location</label>
                    <input v-model="form.location" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Hotel Grand">
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Type</label>
                        <select v-model="form.type" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
                            <option value="wedding">Wedding</option>
                            <option value="corporate">Corporate</option>
                            <option value="birthday">Birthday</option>
                        </select>
                    </div>
                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount Paid</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <span class="text-gray-500 dark:text-gray-400">$</span>
                            </div>
                            <input v-model="form.amount_paid" type="number" step="0.01" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-8 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="0.00">
                        </div>
                    </div>
                </div>

                <div v-if="isEditing">
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status</label>
                    <select v-model="form.status" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
                        <option value="planned">Planned</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>

                <div v-if="isEditing && form.status === 'failed'">
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Failure Reason</label>
                    <textarea v-model="form.failure_reason" rows="3" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Why did it fail?"></textarea>
                </div>

                <div class="flex items-center space-x-2 border-t pt-4 border-gray-200 dark:border-gray-600">
                    <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        {{ isEditing ? 'Save Changes' : 'Create Event' }}
                    </button>
                    <button @click="showModal = false" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Cancel</button>
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- List Events Table -->
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">Name</th>
            <th scope="col" class="px-6 py-3">Date</th>
            <th scope="col" class="px-6 py-3">Location</th>
            <th scope="col" class="px-6 py-3">Type</th>
            <th scope="col" class="px-6 py-3">Status</th>
            <th scope="col" class="px-6 py-3">Amount</th>
            <th scope="col" class="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in events" :key="event.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {{ event.name }}
            </th>
            <td class="px-6 py-4">
              {{ event.date }}
            </td>
            <td class="px-6 py-4">
              {{ event.location }}
            </td>
            <td class="px-6 py-4 capitalize">
              {{ event.type }}
            </td>
            <td class="px-6 py-4">
               <span :class="statusBadgeClass(event.status)">
                  {{ event.status }}
               </span>
               <div v-if="event.status === 'failed' && event.failure_reason" class="text-xs text-red-500 mt-1">
                   Reason: {{ event.failure_reason }}
               </div>
            </td>
            <td class="px-6 py-4 font-mono">
                ${{ (event.amount_paid || 0).toFixed(2) }}
            </td>
            <td class="px-6 py-4">
                <button @click="openModal(event)" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
            </td>
          </tr>
          <tr v-if="events.length === 0">
              <td colspan="7" class="px-6 py-4 text-center">No events found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import api from '../api';
import { useAuthStore } from '../stores/auth';

const events = ref([]);
const authStore = useAuthStore();
const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref(null);

const form = reactive({
  name: '',
  date: '',
  start_time: '',
  end_time: '',
  location: '',
  type: 'wedding',
  status: 'planned',
  failure_reason: '',
  amount_paid: 0,
  client_id: 1
});

const loadEvents = async () => {
  try {
    const res = await api.get('/events');
    events.value = res.data;
  } catch (err) {
    console.error(err);
  }
};

const openModal = (event = null) => {
    if (event) {
        isEditing.value = true;
        editingId.value = event.id;
        // Populate form
        form.name = event.name;
        form.date = event.date;
        form.start_time = event.start_time;
        form.end_time = event.end_time;
        form.location = event.location;
        form.type = event.type;
        form.status = event.status || 'planned';
        form.failure_reason = event.failure_reason || '';
        form.amount_paid = event.amount_paid || 0;
    } else {
        isEditing.value = false;
        editingId.value = null;
        // Reset form
        form.name = '';
        form.date = '';
        form.start_time = '';
        form.end_time = '';
        form.location = '';
        form.type = 'wedding';
        form.status = 'planned';
        form.failure_reason = '';
        form.amount_paid = 0;
    }
    showModal.value = true;
};

const handleSubmit = async () => {
  try {
    if (isEditing.value) {
        await api.put(`/events/${editingId.value}`, form);
    } else {
        await api.post('/events', { ...form, client_id: authStore.user.id || 1 });
    }
    loadEvents();
    showModal.value = false;
  } catch (err) {
    alert('Operation failed');
  }
};

const statusBadgeClass = (status) => {
    const base = "px-2 py-1 rounded-full text-xs font-medium";
    switch(status) {
        case 'planned': return `${base} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`;
        case 'in_progress': return `${base} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`;
        case 'completed': return `${base} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`;
        case 'failed': return `${base} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`;
        default: return `${base} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`;
    }
}

onMounted(() => {
  loadEvents();
});
</script>
