<template>
  <div class="p-4">
    <div class="flex flex-col md:flex-row justify-between items-center mb-6">
      <h1 class="text-3xl font-bold dark:text-white mb-4 md:mb-0">Business Management</h1>

      <!-- Dropdown for selecting the book -->
      <div class="w-full md:w-64">
        <label for="book-select" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Book</label>
        <select
          id="book-select"
          v-model="selectedBook"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="cash_book">CASH BOOK</option>
          <option value="sales_book">Sales / Income Book</option>
          <option value="debtors_book">Debtors (Customers Owing You)</option>
          <option value="owners_drawings">Owner’s Drawings Book</option>
          <option value="loan_advances">Loan / Advances Book</option>
          <option value="maintenance_log">Maintenance Log</option>
        </select>
      </div>
    </div>

    <!-- Cash Book Section -->
    <div v-if="selectedBook === 'cash_book'">
      <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">CASH BOOK</h2>
          <button @click="showExpenseModal = true" class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">
            Add Expense
          </button>
      </div>
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">Date</th>
              <th scope="col" class="px-6 py-3">Description</th>
              <th scope="col" class="px-6 py-3">Money In (USD)</th>
              <th scope="col" class="px-6 py-3">Money Out (USD)</th>
              <th scope="col" class="px-6 py-3">Balance (USD)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entry, index) in cashBookEntries" :key="index" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td class="px-6 py-4">{{ formatDate(entry.date) }}</td>
              <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ entry.description }}</td>
              <td class="px-6 py-4">{{ entry.moneyIn ? formatCurrency(entry.moneyIn) : '–' }}</td>
              <td class="px-6 py-4">{{ entry.moneyOut ? formatCurrency(entry.moneyOut) : '–' }}</td>
              <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">{{ formatCurrency(entry.balance) }}</td>
            </tr>
            <tr v-if="cashBookEntries.length === 0">
               <td colspan="5" class="px-6 py-4 text-center">No entries found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Sales / Income Book Section -->
    <div v-else-if="selectedBook === 'sales_book'">
      <div class="mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">SALES / INCOME BOOK</h2>
      </div>
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">Date</th>
              <th scope="col" class="px-6 py-3">Client Name</th>
              <th scope="col" class="px-6 py-3">Event Type</th>
              <th scope="col" class="px-6 py-3">Event Date</th>
              <th scope="col" class="px-6 py-3">Total Charge (USD)</th>
              <th scope="col" class="px-6 py-3">Deposit</th>
              <th scope="col" class="px-6 py-3">Balance Due</th>
              <th scope="col" class="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entry, index) in salesBookEntries" :key="index" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td class="px-6 py-4">{{ formatDate(entry.date) }}</td>
              <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ entry.client }}</td>
              <td class="px-6 py-4">{{ entry.eventType }}</td>
              <td class="px-6 py-4">{{ formatDate(entry.eventDate) }}</td>
              <td class="px-6 py-4">{{ formatCurrency(entry.total) }}</td>
              <td class="px-6 py-4">{{ formatCurrency(entry.deposit) }}</td>
              <td class="px-6 py-4">{{ formatCurrency(entry.balance) }}</td>
              <td class="px-6 py-4">
                 <span :class="statusClass(entry.status)" class="text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                  {{ entry.status }}
                 </span>
              </td>
            </tr>
             <tr v-if="salesBookEntries.length === 0">
               <td colspan="8" class="px-6 py-4 text-center">No sales found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Debtors Book Section -->
    <div v-else-if="selectedBook === 'debtors_book'">
      <div class="mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">DEBTORS BOOK</h2>
      </div>
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">Client Name</th>
              <th scope="col" class="px-6 py-3">Event Type</th>
              <th scope="col" class="px-6 py-3">Event Date</th>
              <th scope="col" class="px-6 py-3">Total Charge (USD)</th>
              <th scope="col" class="px-6 py-3">Paid</th>
              <th scope="col" class="px-6 py-3">Balance Owing</th>
              <th scope="col" class="px-6 py-3">Due Date</th>
              <th scope="col" class="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entry, index) in debtorsBookEntries" :key="index" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ entry.client }}</td>
              <td class="px-6 py-4">{{ entry.eventType }}</td>
              <td class="px-6 py-4">{{ formatDate(entry.eventDate) }}</td>
              <td class="px-6 py-4">{{ formatCurrency(entry.total) }}</td>
              <td class="px-6 py-4">{{ formatCurrency(entry.paid) }}</td>
              <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">{{ formatCurrency(entry.balance) }}</td>
              <td class="px-6 py-4">{{ formatDate(entry.dueDate) }}</td>
              <td class="px-6 py-4">
                 <span :class="statusClass(entry.status)" class="text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                  {{ entry.status }}
                 </span>
              </td>
            </tr>
            <tr v-if="debtorsBookEntries.length === 0">
               <td colspan="8" class="px-6 py-4 text-center">No debtors found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Owner's Drawings Book Section -->
    <div v-else-if="selectedBook === 'owners_drawings'">
      <div class="mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">OWNER’S DRAWINGS BOOK</h2>
      </div>
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">Date</th>
              <th scope="col" class="px-6 py-3">Amount (USD)</th>
              <th scope="col" class="px-6 py-3">Method</th>
              <th scope="col" class="px-6 py-3">Reason</th>
              <th scope="col" class="px-6 py-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entry, index) in ownersDrawingsEntries" :key="index" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td class="px-6 py-4">{{ formatDate(entry.date) }}</td>
              <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">{{ formatCurrency(entry.amount) }}</td>
              <td class="px-6 py-4">{{ entry.method }}</td>
              <td class="px-6 py-4">{{ entry.description }}</td>
              <td class="px-6 py-4">{{ entry.notes }}</td>
            </tr>
             <tr v-if="ownersDrawingsEntries.length === 0">
               <td colspan="5" class="px-6 py-4 text-center">No drawings found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Other Sections -->
    <div v-else class="flex flex-col items-center justify-center p-12 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Coming Soon</h2>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">This section is currently under development.</p>
    </div>

    <!-- Add Expense Modal -->
    <div v-if="showExpenseModal" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div class="relative w-full max-w-md max-h-full">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button type="button" @click="showExpenseModal = false" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white">
                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                <span class="sr-only">Close modal</span>
            </button>
            <div class="px-6 py-6 lg:px-8">
                <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add New Expense</h3>
                <form class="space-y-6" @submit.prevent="submitExpense">
                    <div>
                        <label for="date" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date</label>
                        <input type="date" v-model="expenseForm.date" id="date" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required>
                    </div>

                    <div>
                        <label for="category" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                        <select id="category" v-model="expenseForm.category" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required>
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

                    <div v-if="expenseForm.category === 'Assistant Salary'">
                        <label for="assistant" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Assistant</label>
                        <select id="assistant" v-model="expenseForm.assistant" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required>
                            <option value="Takudzwa">Takudzwa</option>
                            <option value="Innocent">Innocent</option>
                        </select>
                    </div>

                    <div>
                        <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                        <input type="text" v-model="expenseForm.description" id="description" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="e.g. Monthly subscription" required>
                    </div>

                    <div>
                        <label for="amount" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount ($)</label>
                        <input type="number" step="0.01" v-model.number="expenseForm.amount" id="amount" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required>
                    </div>

                     <div>
                        <label for="notes" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Notes (Optional)</label>
                        <textarea v-model="expenseForm.notes" id="notes" rows="3" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"></textarea>
                    </div>

                    <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add Expense</button>
                </form>
            </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import api from '../api';

const selectedBook = ref('cash_book');
const events = ref([]);
const transactions = ref([]);
const showExpenseModal = ref(false);

const expenseForm = reactive({
    date: new Date().toISOString().split('T')[0],
    category: 'Spotify',
    assistant: '',
    description: '',
    amount: 0,
    notes: ''
});

const loadData = async () => {
  try {
    const [eventsRes, transactionsRes] = await Promise.all([
      api.get('/events'),
      api.get('/business/transactions')
    ]);
    events.value = eventsRes.data;
    transactions.value = transactionsRes.data;
  } catch (err) {
    console.error('Failed to load business data', err);
  }
};

onMounted(() => {
  loadData();
});

const submitExpense = async () => {
    try {
        let fullDescription = expenseForm.category;
        if (expenseForm.category === 'Assistant Salary' && expenseForm.assistant) {
            fullDescription += ` - ${expenseForm.assistant}`;
        }
        fullDescription += `: ${expenseForm.description}`;

        const payload = {
            date: expenseForm.date,
            description: fullDescription,
            amount: expenseForm.amount,
            type: 'out',
            category: 'expense',
            method: 'Cash', // Defaulting to Cash for now
            notes: expenseForm.notes
        };

        // If it's owner's pay, maybe categorize as drawing? The prompt says "expense like... Owners Pay".
        // But owner's pay is typically a drawing.
        // If I categorize as 'expense', it goes to cash book. If 'drawing', it goes to drawing book.
        // Prompt says "In the same cash book I want to be able to add expenses... Owners Pay".
        // So it should appear in Cash Book.
        // My Cash Book logic includes ALL transactions. So 'drawing' or 'expense' category works.
        // Let's stick to 'expense' category for these specific ones unless it's strictly a drawing.
        // Actually, for Owner's Drawings Book to work, I need category='drawing'.
        // If the user selects "Owner's Pay", I should probably save it as category='drawing' so it appears in BOTH Cash Book and Drawings Book.

        if (expenseForm.category === 'Owners Pay') {
            payload.category = 'drawing';
        }

        await api.post('/business/transactions', payload);

        // Reset form and reload
        showExpenseModal.value = false;
        expenseForm.description = '';
        expenseForm.amount = 0;
        expenseForm.notes = '';
        expenseForm.category = 'Spotify';
        expenseForm.assistant = '';

        await loadData();
    } catch (err) {
        console.error('Failed to add expense', err);
        alert('Failed to add expense');
    }
};

const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    // Handle both ISO strings and simple dates like '01 Feb' if manual (though backend should standardize)
    // For now assuming backend sends ISO or parseable dates
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString();
};

const formatCurrency = (val) => {
    return (parseFloat(val) || 0).toFixed(2);
};

// --- Computed Properties for Books ---

const salesBookEntries = computed(() => {
    return events.value.map(e => ({
        date: e.date, // Booking date? Or event date. Using event date.
        client: e.client_name || 'Unknown',
        eventType: e.type || e.name,
        eventDate: e.date,
        total: e.total_cost,
        deposit: e.amount_paid,
        balance: e.total_cost - e.amount_paid,
        status: (e.total_cost - e.amount_paid) <= 0 ? 'Fully Paid' : 'Owing' // Simplified
    }));
});

const debtorsBookEntries = computed(() => {
    return salesBookEntries.value.filter(e => e.balance > 0).map(e => ({
        ...e,
        paid: e.deposit,
        dueDate: e.eventDate, // Assuming due date is event date
        status: new Date(e.eventDate) < new Date() ? 'Overdue' : 'Owing'
    }));
});

const ownersDrawingsEntries = computed(() => {
    return transactions.value.filter(t => t.category === 'drawing');
});

const cashBookEntries = computed(() => {
    const entries = [];
    let runningBalance = 0;

    // 1. Event Incomes (Money In)
    events.value.forEach(e => {
        if (e.amount_paid > 0) {
            entries.push({
                date: e.date, // Ideally this should be the payment date, but we only have event date
                description: `Payment: ${e.name}`,
                moneyIn: e.amount_paid,
                moneyOut: null,
                timestamp: new Date(e.date).getTime()
            });
        }
    });

    // 2. Event Expenses (Money Out - Transport)
    events.value.forEach(e => {
        if (e.transport_cost > 0) {
            entries.push({
                date: e.date,
                description: `Transport: ${e.name}`,
                moneyIn: null,
                moneyOut: e.transport_cost,
                timestamp: new Date(e.date).getTime()
            });
        }
    });

    // 3. Manual Transactions
    transactions.value.forEach(t => {
        entries.push({
            date: t.date,
            description: t.description,
            moneyIn: t.type === 'in' ? t.amount : null,
            moneyOut: t.type === 'out' ? t.amount : null,
            timestamp: new Date(t.date).getTime()
        });
    });

    // Sort by date
    entries.sort((a, b) => a.timestamp - b.timestamp);

    // Calculate running balance
    return entries.map(e => {
        const income = e.moneyIn || 0;
        const expense = e.moneyOut || 0;
        runningBalance += (income - expense);
        return { ...e, balance: runningBalance };
    });
});


const statusClass = (status) => {
    switch(status) {
        case 'Fully Paid':
        case 'Balance Paid':
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'Owing':
        case 'Overdue':
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        default:
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
};
</script>
