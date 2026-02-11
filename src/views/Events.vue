<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold dark:text-white">Events Management</h1>
      <BaseButton @click="openModal">Create New Event</BaseButton>
    </div>

    <!-- Events Table -->
    <BaseTable>
      <template #head>
          <th scope="col" class="px-6 py-3">Name</th>
          <th scope="col" class="px-6 py-3">Date</th>
          <th scope="col" class="px-6 py-3">Status</th>
          <th scope="col" class="px-6 py-3">Total</th>
          <th scope="col" class="px-6 py-3">Paid</th>
          <th scope="col" class="px-6 py-3">Remaining</th>
          <th scope="col" class="px-6 py-3">Transport</th>
          <th scope="col" class="px-6 py-3">Actions</th>
      </template>
      <template #body>
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
      </template>
    </BaseTable>

    <!-- Modal -->
    <BaseModal :show="showModal" :title="isEditing ? 'Edit Event' : 'Create New Event'" @close="closeModal">
      <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="col-span-2 md:col-span-1">
              <BaseInput v-model="form.name" label="Event Name" placeholder="Wedding" required />
          </div>

          <div class="col-span-2 md:col-span-1">
              <BaseInput v-model="form.client_phone" label="Client Phone" placeholder="+263..." />
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

          <!-- Google Sheet Integration -->
          <div class="col-span-2 border-t dark:border-gray-600 pt-4 mt-2">
              <h4 class="font-medium text-gray-900 dark:text-white mb-2">Google Sheet Integration</h4>
              <div class="flex flex-col md:flex-row gap-2 items-end">
                  <div class="flex-grow w-full">
                      <BaseInput v-model="form.google_sheet_url" label="Google Sheet URL" placeholder="https://docs.google.com/spreadsheets/..." />
                  </div>
                  <div class="w-full md:w-auto" v-if="isEditing">
                      <BaseButton type="button" @click="syncSheet" :disabled="isSyncing" customClass="w-full md:w-auto">
                          {{ isSyncing ? 'Syncing...' : 'Sync from Sheet' }}
                      </BaseButton>
                  </div>
              </div>
          </div>

          <!-- Services -->
          <div class="col-span-2 border-t dark:border-gray-600 pt-4">
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Services</label>
              <div class="flex gap-4">
                  <label class="flex items-center space-x-2">
                      <input type="checkbox" v-model="selectedServices.pa" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                      <span class="text-sm text-gray-900 dark:text-white">PA System</span>
                  </label>
                  <label class="flex items-center space-x-2">
                      <input type="checkbox" v-model="selectedServices.photography" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                      <span class="text-sm text-gray-900 dark:text-white">Photography</span>
                  </label>
                  <label class="flex items-center space-x-2">
                      <input type="checkbox" v-model="selectedServices.decor" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                      <span class="text-sm text-gray-900 dark:text-white">Decor</span>
                  </label>
              </div>
          </div>

          <!-- Photography/Decor Messages -->
          <div v-if="selectedServices.photography || selectedServices.decor" class="col-span-2">
              <p v-if="selectedServices.photography" class="text-sm text-yellow-600 dark:text-yellow-400">Photography inventory management coming soon.</p>
              <p v-if="selectedServices.decor" class="text-sm text-yellow-600 dark:text-yellow-400">Decor inventory management coming soon.</p>
          </div>

          <!-- PA System Inventory Selection -->
          <div v-if="selectedServices.pa && !isEditing" class="col-span-2 border rounded-lg p-4 dark:border-gray-600">
              <h4 class="font-medium text-gray-900 dark:text-white mb-2">Select PA System Inventory</h4>
              <div v-if="!form.start_time || !form.end_time" class="text-sm text-red-500">
                  Please select Start and End times to check availability.
              </div>
              <div v-else>
                  <button type="button" @click="checkAvailability" class="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-xs px-3 py-2 mb-3">Check Availability</button>

                  <div v-if="availableInventory.length > 0" class="overflow-x-auto">
                      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                              <tr>
                                  <th class="px-4 py-2">Item</th>
                                  <th class="px-4 py-2">Available</th>
                                  <th class="px-4 py-2">Book Qty</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr v-for="item in availableInventory" :key="item.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                  <td class="px-4 py-2 font-medium text-gray-900 dark:text-white">{{ item.name }}</td>
                                  <td class="px-4 py-2">{{ item.available_quantity }}</td>
                                  <td class="px-4 py-2">
                                      <input type="number" v-model.number="item.selected_qty" min="0" :max="item.available_quantity" class="w-20 p-1 border rounded text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
                  <p v-if="availableInventory.length === 0 && availabilityChecked" class="text-sm text-gray-500">No inventory available for this time slot.</p>
              </div>
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

          <!-- Return Inventory (Edit only, when completed) -->
          <div v-if="isEditing && form.status === 'completed'" class="col-span-2 border-t dark:border-gray-600 pt-4 mt-2">
              <h4 class="font-medium text-gray-900 dark:text-white mb-2">Return Inventory</h4>
              <div v-if="bookedItems.length === 0" class="text-sm text-gray-500">No inventory booked for this event.</div>
              <div v-else class="overflow-x-auto">
                  <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                              <th class="px-4 py-2">Item</th>
                              <th class="px-4 py-2">Qty Out</th>
                              <th class="px-4 py-2">Qty Back</th>
                              <th class="px-4 py-2">Missing</th>
                              <th class="px-4 py-2">Condition</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr v-for="item in bookedItems" :key="item.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                              <td class="px-4 py-2 font-medium text-gray-900 dark:text-white">{{ item.item_name }}</td>
                              <td class="px-4 py-2">{{ item.quantity }}</td>
                              <td class="px-4 py-2">
                                  <input type="number" v-model.number="item.qty_back" @input="calculateMissing(item)" min="0" :max="item.quantity" class="w-20 p-1 border rounded text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                              </td>
                              <td class="px-4 py-2 text-red-600 font-bold">{{ item.missing }}</td>
                              <td class="px-4 py-2">
                                  <input type="text" v-model="item.condition_return" placeholder="Good" class="w-full p-1 border rounded text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                              </td>
                          </tr>
                      </tbody>
                  </table>
              </div>
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
import BaseTable from '../components/common/BaseTable.vue';

const authStore = useAuthStore();
const events = ref([]);
const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref(null);
const availabilityChecked = ref(false);
const isSyncing = ref(false);

const form = ref({
  name: '',
  client_phone: '',
  date: '',
  start_time: '',
  end_time: '',
  location: '',
  status: 'planned',
  total_cost: 0,
  amount_paid: 0,
  transport_cost: 0,
  failure_reason: '',
  google_sheet_url: '',
  inventory: []
});

const selectedServices = ref({
    pa: false,
    photography: false,
    decor: false
});

const availableInventory = ref([]);
const bookedItems = ref([]); // For return flow

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
      client_phone: '',
      date: new Date().toISOString().split('T')[0],
      start_time: '',
      end_time: '',
      location: '',
      status: 'planned',
      total_cost: 0,
      amount_paid: 0,
      transport_cost: 0,
      failure_reason: '',
      google_sheet_url: '',
      inventory: []
  };
  selectedServices.value = { pa: false, photography: false, decor: false };
  availableInventory.value = [];
  availabilityChecked.value = false;
  showModal.value = true;
};

const editEvent = async (event) => {
  isEditing.value = true;
  editingId.value = event.id;
  form.value = { ...event };
  selectedServices.value = { pa: false, photography: false, decor: false }; // Reset services

  // Load booked items if any
  try {
      const res = await api.get('/inventory/movement', { params: { event_id: event.id } });
      bookedItems.value = res.data.map(item => ({
          ...item,
          qty_back: item.qty_back !== null ? item.qty_back : item.quantity, // Default to full return if not set
          missing: item.missing || 0,
          condition_return: item.condition_return || ''
      }));
      // If items exist, assume PA was selected (simple logic for now)
      if (bookedItems.value.length > 0) {
          selectedServices.value.pa = true;
      }
  } catch (err) {
      console.error(err);
  }

  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const syncSheet = async () => {
    if (!form.value.google_sheet_url) return alert('Please enter a Google Sheet URL');
    if (!editingId.value) return;

    isSyncing.value = true;
    try {
        // First save the URL
        await api.put(`/events/${editingId.value}`, { google_sheet_url: form.value.google_sheet_url });

        // Then sync
        const res = await api.post(`/events/${editingId.value}/sync-sheet`);
        const updated = res.data;

        // Update form
        form.value.total_cost = updated.total_cost;
        form.value.amount_paid = updated.amount_paid;
        form.value.transport_cost = updated.transport_cost;

        alert('Synced successfully!');
    } catch (err) {
        console.error(err);
        alert('Sync failed: ' + (err.response?.data?.error || err.message));
    } finally {
        isSyncing.value = false;
    }
};

const checkAvailability = async () => {
    if (!form.value.start_time || !form.value.end_time) return;
    try {
        const res = await api.get('/inventory', {
            params: {
                start_time: form.value.start_time,
                end_time: form.value.end_time,
                type: 'pa'
            }
        });
        availableInventory.value = res.data.map(item => ({...item, selected_qty: 0}));
        availabilityChecked.value = true;
    } catch (err) {
        console.error(err);
    }
};

const calculateMissing = (item) => {
    item.missing = Math.max(0, item.quantity - (item.qty_back || 0));
};

const handleSubmit = async () => {
  try {
    // Prepare inventory payload
    const inventoryPayload = availableInventory.value
        .filter(item => item.selected_qty > 0)
        .map(item => ({ item_id: item.id, quantity: item.selected_qty }));

    const payload = {
        ...form.value,
        amount_paid: Number(form.value.amount_paid) || 0,
        total_cost: Number(form.value.total_cost) || 0,
        transport_cost: Number(form.value.transport_cost) || 0,
        inventory: inventoryPayload
    };

    if (isEditing.value) {
        await api.put(`/events/${editingId.value}`, payload);

        // Save Return Info
        if (form.value.status === 'completed' && bookedItems.value.length > 0) {
            for (const item of bookedItems.value) {
                await api.put(`/inventory/booking/${item.id}`, {
                    qty_back: item.qty_back,
                    missing: item.missing,
                    condition_return: item.condition_return,
                    status: 'returned' // Mark as returned
                });
            }
        }
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
