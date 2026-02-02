<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Events Management</h1>

    <!-- Create Event -->
    <div class="bg-white p-6 rounded shadow mb-8">
      <h2 class="text-xl font-bold mb-4">Create New Event</h2>
      <form @submit.prevent="createEvent" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input v-model="newEvent.name" placeholder="Event Name" class="border p-2 rounded" required />
        <input v-model="newEvent.date" type="date" class="border p-2 rounded" required />
        <input v-model="newEvent.start_time" type="datetime-local" class="border p-2 rounded" required />
        <input v-model="newEvent.end_time" type="datetime-local" class="border p-2 rounded" required />
        <input v-model="newEvent.location" placeholder="Location" class="border p-2 rounded" />
        <select v-model="newEvent.type" class="border p-2 rounded">
          <option value="wedding">Wedding</option>
          <option value="corporate">Corporate</option>
          <option value="birthday">Birthday</option>
        </select>
        <button type="submit" class="bg-blue-600 text-white p-2 rounded md:col-span-2 hover:bg-blue-700">
          Create Event
        </button>
      </form>
    </div>

    <!-- List Events -->
    <div class="bg-white rounded shadow overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-gray-100 border-b">
          <tr>
            <th class="p-4">Name</th>
            <th class="p-4">Date</th>
            <th class="p-4">Location</th>
            <th class="p-4">Type</th>
            <th class="p-4">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in events" :key="event.id" class="border-b hover:bg-gray-50">
            <td class="p-4">{{ event.name }}</td>
            <td class="p-4">{{ event.date }}</td>
            <td class="p-4">{{ event.location }}</td>
            <td class="p-4 capitalize">{{ event.type }}</td>
            <td class="p-4 capitalize">
              <span :class="statusClass(event.status)">{{ event.status }}</span>
            </td>
          </tr>
          <tr v-if="events.length === 0">
              <td colspan="5" class="p-4 text-center text-gray-500">No events found.</td>
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

const newEvent = reactive({
  name: '',
  date: '',
  start_time: '',
  end_time: '',
  location: '',
  type: 'wedding',
  client_id: 1 // Hardcoded for now as we don't have client selection
});

const loadEvents = async () => {
  try {
    const res = await api.get('/events');
    events.value = res.data;
  } catch (err) {
    console.error(err);
  }
};

const createEvent = async () => {
  try {
    // Ensure start_time/end_time format matches what backend expects or is ISO
    await api.post('/events', { ...newEvent, client_id: authStore.user.id || 1 });
    loadEvents();
    // Reset form
    newEvent.name = '';
    newEvent.location = '';
  } catch (err) {
    alert('Failed to create event');
  }
};

const statusClass = (status) => {
    switch(status) {
        case 'planned': return 'text-blue-600';
        case 'completed': return 'text-green-600';
        default: return 'text-gray-600';
    }
}

onMounted(() => {
  loadEvents();
});
</script>
