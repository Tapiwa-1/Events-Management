<template>
  <div>
    <h1 class="text-3xl font-bold mb-6 dark:text-white">Cash Book</h1>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="block p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Total Revenue</h5>
            <p class="font-normal text-green-600 dark:text-green-500 text-3xl">${{ formatCurrency(totalRevenue) }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">From completed/paid events</p>
        </div>
        <div class="block p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Total Expenses</h5>
            <p class="font-normal text-red-600 dark:text-red-500 text-3xl">${{ formatCurrency(totalExpenses) }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Operational costs</p>
        </div>
        <div class="block p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Net Balance</h5>
            <p class="font-normal text-3xl" :class="netBalance >= 0 ? 'text-blue-600 dark:text-blue-500' : 'text-red-600 dark:text-red-500'">
                ${{ formatCurrency(netBalance) }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Cash on hand</p>
        </div>
    </div>

    <!-- Actions -->
    <div class="mb-6 flex justify-end">
        <button @click="openModal" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
            Add Expense
        </button>
    </div>

    <!-- Expenses Table -->
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" class="px-6 py-3">Date</th>
                    <th scope="col" class="px-6 py-3">Category</th>
                    <th scope="col" class="px-6 py-3">Description</th>
                    <th scope="col" class="px-6 py-3">Assistant / Event</th>
                    <th scope="col" class="px-6 py-3">Amount</th>
                    <th scope="col" class="px-6 py-3">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="expense in expenses" :key="expense.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td class="px-6 py-4">{{ formatDate(expense.date) }}</td>
                    <td class="px-6 py-4">
                        <span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">{{ expense.category }}</span>
                    </td>
                    <td class="px-6 py-4">{{ expense.description || '-' }}</td>
                    <td class="px-6 py-4">
                        <div v-if="expense.assistant_name" class="font-semibold">{{ expense.assistant_name }}</div>
                        <div v-if="expense.event_name" class="text-xs text-blue-600 dark:text-blue-400">{{ expense.event_name }}</div>
                        <span v-if="!expense.assistant_name && !expense.event_name">-</span>
                    </td>
                    <td class="px-6 py-4 font-bold text-red-600 dark:text-red-500">-${{ formatCurrency(expense.amount) }}</td>
                    <td class="px-6 py-4">
                        <button @click="deleteExpense(expense.id)" class="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
                    </td>
                </tr>
                <tr v-if="expenses.length === 0">
                    <td colspan="6" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No expenses recorded.</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
        <div class="relative w-full max-w-md max-h-full">
            <!-- Modal content -->
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                        Add Expense
                    </h3>
                    <button @click="showModal = false" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>
                <!-- Modal body -->
                <div class="p-6">
                    <form @submit.prevent="submitExpense" class="space-y-4">
                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date</label>
                            <input v-model="form.date" type="date" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                        </div>

                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                            <select v-model="form.category" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
                                <option value="Spotify">Spotify</option>
                                <option value="Data">Data</option>
                                <option value="PA Maintenance">PA Maintenance</option>
                                <option value="Car Maintenance">Car Maintenance</option>
                                <option value="Ads">Ads</option>
                                <option value="Assistant Salary">Assistant Salary</option>
                                <option value="Owners Pay">Owners Pay</option>
                                <option value="Fuel">Fuel</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <!-- Conditional Assistant Fields -->
                        <div v-if="form.category === 'Assistant Salary'" class="space-y-4 border-l-2 border-blue-500 pl-4">
                            <div>
                                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Assistant Name</label>
                                <select v-model="form.assistant_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
                                    <option value="Takudzwa">Takudzwa</option>
                                    <option value="Innocent">Innocent</option>
                                </select>
                            </div>

                            <div>
                                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Link to Event (Optional)</label>
                                <select v-model="form.event_id" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
                                    <option :value="null">-- No Event --</option>
                                    <option v-for="evt in events" :key="evt.id" :value="evt.id">{{ evt.name }} ({{ formatDate(evt.date) }})</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount ($)</label>
                            <input v-model.number="form.amount" type="number" step="0.01" min="0" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                        </div>

                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                            <input v-model="form.description" type="text" placeholder="e.g., Spotify Subscription" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
                        </div>

                        <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Save Expense
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../api';

const expenses = ref([]);
const events = ref([]);
const showModal = ref(false);

// Financial Summary State
const totalRevenue = ref(0);

const form = ref({
    date: new Date().toISOString().split('T')[0],
    category: 'Spotify',
    amount: 0,
    description: '',
    assistant_name: '',
    event_id: null
});

const totalExpenses = computed(() => {
    return expenses.value.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
});

const netBalance = computed(() => {
    return totalRevenue.value - totalExpenses.value;
});

const loadData = async () => {
    try {
        const [expRes, evRes] = await Promise.all([
            api.get('/expenses'),
            api.get('/events')
        ]);
        expenses.value = expRes.data;
        events.value = evRes.data;

        // Calculate Total Revenue from Events (Sum of amount_paid)
        totalRevenue.value = evRes.data.reduce((sum, evt) => sum + (parseFloat(evt.amount_paid) || 0), 0);
    } catch (err) {
        console.error('Failed to load data', err);
    }
};

const openModal = () => {
    form.value = {
        date: new Date().toISOString().split('T')[0],
        category: 'Spotify',
        amount: 0,
        description: '',
        assistant_name: '',
        event_id: null
    };
    showModal.value = true;
};

const submitExpense = async () => {
    try {
        await api.post('/expenses', form.value);
        await loadData();
        showModal.value = false;
    } catch (err) {
        alert('Failed to save expense');
    }
};

const deleteExpense = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
        await api.delete(`/expenses/${id}`);
        await loadData();
    } catch (err) {
        alert('Failed to delete expense');
    }
};

const formatDate = (d) => {
    if (!d) return '-';
    return new Date(d).toLocaleDateString();
};

const formatCurrency = (val) => {
    return (parseFloat(val) || 0).toFixed(2);
};

onMounted(() => {
    loadData();
});
</script>
