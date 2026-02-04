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
      <div class="mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">CASH BOOK – PA SYSTEM BUSINESS (Example)</h2>
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
              <td class="px-6 py-4">{{ entry.date }}</td>
              <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ entry.description }}</td>
              <td class="px-6 py-4">{{ entry.moneyIn ? entry.moneyIn : '–' }}</td>
              <td class="px-6 py-4">{{ entry.moneyOut ? entry.moneyOut : '–' }}</td>
              <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">{{ entry.balance }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Sales / Income Book Section -->
    <div v-else-if="selectedBook === 'sales_book'">
      <div class="mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">SALES / INCOME BOOK – PA SYSTEM BUSINESS (Example)</h2>
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
              <td class="px-6 py-4">{{ entry.date }}</td>
              <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ entry.client }}</td>
              <td class="px-6 py-4">{{ entry.eventType }}</td>
              <td class="px-6 py-4">{{ entry.eventDate }}</td>
              <td class="px-6 py-4">{{ entry.total }}</td>
              <td class="px-6 py-4">{{ entry.deposit }}</td>
              <td class="px-6 py-4">{{ entry.balance }}</td>
              <td class="px-6 py-4">
                 <span :class="statusClass(entry.status)" class="text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                  {{ entry.status }}
                 </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Debtors Book Section -->
    <div v-else-if="selectedBook === 'debtors_book'">
      <div class="mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">DEBTORS BOOK – PA SYSTEM BUSINESS (Example)</h2>
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
              <td class="px-6 py-4">{{ entry.eventDate }}</td>
              <td class="px-6 py-4">{{ entry.total }}</td>
              <td class="px-6 py-4">{{ entry.paid }}</td>
              <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">{{ entry.balance }}</td>
              <td class="px-6 py-4">{{ entry.dueDate }}</td>
              <td class="px-6 py-4">
                 <span :class="statusClass(entry.status)" class="text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                  {{ entry.status }}
                 </span>
              </td>
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

  </div>
</template>

<script setup>
import { ref } from 'vue';

const selectedBook = ref('cash_book');

const cashBookEntries = ref([
    { date: '01 Feb', description: 'Opening Balance', moneyIn: 300, moneyOut: null, balance: 300 },
    { date: '02 Feb', description: 'PA Hire – Wedding (Deposit)', moneyIn: 100, moneyOut: null, balance: 400 },
    { date: '03 Feb', description: 'Fuel (Event Transport)', moneyIn: null, moneyOut: 30, balance: 370 },
    { date: '03 Feb', description: 'PA Hire – Wedding (Balance)', moneyIn: 200, moneyOut: null, balance: 570 },
    { date: '04 Feb', description: 'Speaker Repair', moneyIn: null, moneyOut: 50, balance: 520 },
    { date: '05 Feb', description: 'PA Hire – Birthday Party', moneyIn: 150, moneyOut: null, balance: 670 },
    { date: '06 Feb', description: 'Facebook Ads', moneyIn: null, moneyOut: 40, balance: 630 },
    { date: '07 Feb', description: 'Owner Withdrawal', moneyIn: null, moneyOut: 100, balance: 530 },
    { date: '08 Feb', description: 'PA Hire – Church Event', moneyIn: 120, moneyOut: null, balance: 650 },
]);

const salesBookEntries = ref([
    { date: '01 Feb', client: 'Tendai M', eventType: 'Wedding', eventDate: '03 Feb', total: 300, deposit: 100, balance: 200, status: 'Balance Paid' },
    { date: '04 Feb', client: 'Rudo K', eventType: 'Birthday Party', eventDate: '05 Feb', total: 150, deposit: 50, balance: 100, status: 'Balance Paid' },
    { date: '06 Feb', client: 'Church of Hope', eventType: 'Church Service', eventDate: '08 Feb', total: 120, deposit: 120, balance: 0, status: 'Fully Paid' },
    { date: '08 Feb', client: 'Blessing T', eventType: 'Graduation', eventDate: '10 Feb', total: 200, deposit: 100, balance: 100, status: 'Owing' },
    { date: '10 Feb', client: 'Farai N', eventType: 'Corporate Event', eventDate: '15 Feb', total: 400, deposit: 150, balance: 250, status: 'Owing' },
]);

const debtorsBookEntries = ref([
    { client: 'Blessing T', eventType: 'Graduation', eventDate: '10 Feb', total: 200, paid: 100, balance: 100, dueDate: '10 Feb', status: 'Owing' },
    { client: 'Farai N', eventType: 'Corporate Event', eventDate: '15 Feb', total: 400, paid: 150, balance: 250, dueDate: '14 Feb', status: 'Overdue' },
    { client: 'Memory D', eventType: 'Wedding', eventDate: '20 Feb', total: 350, paid: 200, balance: 150, dueDate: '19 Feb', status: 'Owing' },
    { client: 'Church of Hope', eventType: 'Church Service', eventDate: '08 Feb', total: 120, paid: 0, balance: 120, dueDate: '08 Feb', status: 'Overdue' },
]);

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
