<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold dark:text-white">Events Management</h1>
      <BaseButton @click="openModal">Create New Event</BaseButton>
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
              <BaseBadge :variant="getBadgeVariant(event.status)">
                {{ event.status }}
              </BaseBadge>
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
    <BaseModal :show="showModal" :title="isEditing ? 'Edit Event' : 'Create New Event'" @close="closeModal">
      <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="col-span-2 md:col-span-1">
              <BaseInput v-model="form.name" label="Event Name" placeholder="Wedding" required />
          </div>

          <div class="col-span-2 md:col-span-1">
              <BaseInput v-model="form.date" label="Date" type="date" required />
          </div>

          <div>
              <BaseInput v-model="form.start_time" label="Start Time" type="datetime-local" />
          </div>

          <div>
              <BaseInput v-model="form.end_time" label="End Time" type="datetime-local" />
          </div>

          <div class="col-span-2">
              <BaseInput v-model="form.location" label="Location" />
          </div>

          <!-- Financials -->
          <div>
              <BaseInput v-model.number="form.total_cost" label="Total Cost ($)" type="number" step="0.01" min="0" placeholder="0.00" />
          </div>

          <div>
              <BaseInput v-model.number="form.amount_paid" label="Amount Paid / Deposit ($)" type="number" step="0.01" min="0" placeholder="0.00" />
          </div>

          <div>
              <BaseInput v-model.number="form.transport_cost" label="Transport Cost ($)" type="number" step="0.01" min="0" placeholder="0.00" />
          </div>

          <div class="flex items-center pt-6">
              <div class="text-lg font-bold text-gray-700 dark:text-gray-300">
              Remaining: <span :class="remaining < 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-500'">${{ formatCurrency(remaining) }}</span>
              </div>
          </div>

          <!-- Status (Edit only) -->
          <div v-if="isEditing" class="col-span-2 border-t dark:border-gray-600 pt-4 mt-2">
              <BaseSelect v-model="form.status" label="Status">
                  <option value="planned">Planned</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
              </BaseSelect>
          </div>

          <!-- Failure Reason (Edit only) -->
          <div v-if="isEditing && (form.status === 'cancelled' || form.status === 'failed')" class="col-span-2">
              <BaseTextarea v-model="form.failure_reason" label="Reason for Failure/Cancel" />
          </div>
      </form>

      <template #footer>
          <BaseButton variant="secondary" @click="closeModal">Cancel</BaseButton>
          <BaseButton @click="handleSubmit">
              {{ isEditing ? 'Save Changes' : 'Create Event' }}
          </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../api';
import { useAuthStore } from '../stores/auth';
import BaseButton from '../components/common/BaseButton.vue';
import BaseInput from '../components/common/BaseInput.vue';
import BaseSelect from '../components/common/BaseSelect.vue';
import BaseTextarea from '../components/common/BaseTextarea.vue';
import BaseModal from '../components/common/BaseModal.vue';
import BaseBadge from '../components/common/BaseBadge.vue';

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

const getBadgeVariant = (status) => {
    switch(status) {
        case 'completed': return 'success';
        case 'cancelled': return 'danger';
        default: return 'primary';
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
