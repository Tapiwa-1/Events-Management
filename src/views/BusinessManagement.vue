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

    <!-- Toolbar: Search & Page Size (Visible for all active books) -->
    <div v-if="selectedBook !== 'maintenance_log'" class="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
        <!-- Search -->
        <div class="relative w-full md:w-64">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
            </div>
            <input type="text" v-model="searchQuery" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search...">
        </div>

        <!-- Right Side: Items Per Page & Action Button -->
        <div class="flex items-center space-x-4 w-full md:w-auto">
             <select v-model="itemsPerPage" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option :value="5">5 per page</option>
                <option :value="10">10 per page</option>
                <option :value="20">20 per page</option>
                <option :value="50">50 per page</option>
            </select>

            <button v-if="selectedBook === 'cash_book'" @click="showExpenseModal = true" class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800 whitespace-nowrap">
                Add Expense
            </button>
             <button v-if="selectedBook === 'loan_advances'" @click="showLoanModal = true" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 whitespace-nowrap">
                Add Loan
            </button>
        </div>
    </div>

    <!-- Cash Book Section -->
    <div v-if="selectedBook === 'cash_book'">
      <div class="mb-2">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">CASH BOOK</h2>
      </div>
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('date')">Date <span v-if="sortKey==='date'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
              <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('description')">Description <span v-if="sortKey==='description'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
              <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('moneyIn')">Money In (USD) <span v-if="sortKey==='moneyIn'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
              <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('moneyOut')">Money Out (USD) <span v-if="sortKey==='moneyOut'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
              <th scope="col" class="px-6 py-3">Balance (USD)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entry, index) in paginatedData" :key="index" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td class="px-6 py-4">{{ formatDate(entry.date) }}</td>
              <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ entry.description }}</td>
              <td class="px-6 py-4">{{ entry.moneyIn ? formatCurrency(entry.moneyIn) : '–' }}</td>
              <td class="px-6 py-4">{{ entry.moneyOut ? formatCurrency(entry.moneyOut) : '–' }}</td>
              <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">{{ formatCurrency(entry.balance) }}</td>
            </tr>
            <tr v-if="paginatedData.length === 0">
               <td colspan="5" class="px-6 py-4 text-center">No entries found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Sales / Income Book Section -->
    <div v-else-if="selectedBook === 'sales_book'">
      <div class="mb-2">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">SALES / INCOME BOOK</h2>
      </div>
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('date')">Date <span v-if="sortKey==='date'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
              <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('client')">Client Name <span v-if="sortKey==='client'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
              <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('eventType')">Event Type <span v-if="sortKey==='eventType'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
              <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('eventDate')">Event Date <span v-if="sortKey==='eventDate'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
              <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('total')">Total (USD) <span v-if="sortKey==='total'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
              <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('deposit')">Deposit <span v-if="sortKey==='deposit'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
              <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('balance')">Balance <span v-if="sortKey==='balance'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
              <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('status')">Status <span v-if="sortKey==='status'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entry, index) in paginatedData" :key="index" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
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
             <tr v-if="paginatedData.length === 0">
               <td colspan="8" class="px-6 py-4 text-center">No sales found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Debtors Book Section -->
    <div v-else-if="selectedBook === 'debtors_book'">
      <div class="mb-2">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">DEBTORS BOOK</h2>
      </div>
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('client')">Client Name <span v-if="sortKey==='client'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
              <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('eventType')">Event Type <span v-if="sortKey==='eventType'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
              <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('eventDate')">Event Date <span v-if="sortKey==='eventDate'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
              <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('total')">Total (USD) <span v-if="sortKey==='total'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
              <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('paid')">Paid <span v-if="sortKey==='paid'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
              <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('balance')">Balance Owing <span v-if="sortKey==='balance'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
              <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('dueDate')">Due Date <span v-if="sortKey==='dueDate'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
              <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('status')">Status <span v-if="sortKey==='status'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entry, index) in paginatedData" :key="index" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
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
            <tr v-if="paginatedData.length === 0">
               <td colspan="8" class="px-6 py-4 text-center">No debtors found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Owner's Drawings Book Section -->
    <div v-else-if="selectedBook === 'owners_drawings'">
      <div class="mb-2">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">OWNER’S DRAWINGS BOOK</h2>
      </div>
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('date')">Date <span v-if="sortKey==='date'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
              <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('amount')">Amount (USD) <span v-if="sortKey==='amount'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
              <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('method')">Method <span v-if="sortKey==='method'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
              <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('description')">Reason <span v-if="sortKey==='description'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
              <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('notes')">Notes <span v-if="sortKey==='notes'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entry, index) in paginatedData" :key="index" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td class="px-6 py-4">{{ formatDate(entry.date) }}</td>
              <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">{{ formatCurrency(entry.amount) }}</td>
              <td class="px-6 py-4">{{ entry.method }}</td>
              <td class="px-6 py-4">{{ entry.description }}</td>
              <td class="px-6 py-4">{{ entry.notes }}</td>
            </tr>
             <tr v-if="paginatedData.length === 0">
               <td colspan="5" class="px-6 py-4 text-center">No drawings found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Loan / Advances Book Section -->
    <div v-else-if="selectedBook === 'loan_advances'">
      <div class="mb-2">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">LOANS BOOK</h2>
      </div>
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('borrower')">Borrower <span v-if="sortKey==='borrower'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
              <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('type')">Type <span v-if="sortKey==='type'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
              <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('date_given')">Date Given <span v-if="sortKey==='date_given'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
              <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('amount')">Amount (USD) <span v-if="sortKey==='amount'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
              <th scope="col" class="px-6 py-3">Paid (USD)</th>
              <th scope="col" class="px-6 py-3">Balance (USD)</th>
              <th scope="col" class="px-6 py-3">Interest</th>
              <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('due_date')">Due Date <span v-if="sortKey==='due_date'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
              <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('status')">Status <span v-if="sortKey==='status'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
              <th scope="col" class="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entry, index) in paginatedData" :key="index" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ entry.borrower }}</td>
              <td class="px-6 py-4">{{ entry.type }}</td>
              <td class="px-6 py-4">{{ formatDate(entry.date_given) }}</td>
              <td class="px-6 py-4">{{ formatCurrency(entry.amount) }}</td>
              <td class="px-6 py-4">{{ formatCurrency(entry.amount_paid) }}</td>
              <td class="px-6 py-4 font-semibold">{{ formatCurrency(entry.amount - entry.amount_paid) }}</td>
              <td class="px-6 py-4">{{ entry.interest }}</td>
              <td class="px-6 py-4">{{ formatDate(entry.due_date) }}</td>
              <td class="px-6 py-4">
                 <span :class="statusClass(entry.status)" class="text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                  {{ entry.status }}
                 </span>
              </td>
              <td class="px-6 py-4">
                  <button v-if="entry.status === 'Active'" @click="openRepaymentModal(entry)" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Repay</button>
              </td>
            </tr>
             <tr v-if="paginatedData.length === 0">
               <td colspan="10" class="px-6 py-4 text-center">No loans found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination Controls (Visible if supported book and more than 0 items) -->
    <div v-if="selectedBook !== 'maintenance_log' && filteredData.length > 0" class="flex flex-col items-center mt-4">
        <span class="text-sm text-gray-700 dark:text-gray-400">
            Showing <span class="font-semibold text-gray-900 dark:text-white">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to <span class="font-semibold text-gray-900 dark:text-white">{{ Math.min(currentPage * itemsPerPage, filteredData.length) }}</span> of <span class="font-semibold text-gray-900 dark:text-white">{{ filteredData.length }}</span> Entries
        </span>
        <div class="inline-flex mt-2 xs:mt-0">
            <button @click="prevPage" :disabled="currentPage === 1" class="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-blue-800 rounded-l hover:bg-blue-900 dark:bg-blue-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50">
                Prev
            </button>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-blue-800 border-0 border-l border-blue-700 rounded-r hover:bg-blue-900 dark:bg-blue-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50">
                Next
            </button>
        </div>
    </div>

    <!-- Other Sections -->
    <div v-if="selectedBook === 'maintenance_log'" class="flex flex-col items-center justify-center p-12 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
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

    <!-- Add Loan Modal -->
    <div v-if="showLoanModal" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div class="relative w-full max-w-md max-h-full">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button type="button" @click="showLoanModal = false" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white">
                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                <span class="sr-only">Close modal</span>
            </button>
            <div class="px-6 py-6 lg:px-8">
                <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add New Loan</h3>
                <form class="space-y-6" @submit.prevent="submitLoan">
                    <div>
                        <label for="borrower" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Borrower Name</label>
                        <input type="text" v-model="loanForm.borrower" id="borrower" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required>
                    </div>

                    <div>
                        <label for="loanType" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Type</label>
                        <select id="loanType" v-model="loanForm.type" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required>
                            <option value="Staff Loan">Staff Loan</option>
                            <option value="Personal Loan">Personal Loan (from business)</option>
                        </select>
                    </div>

                    <div>
                        <label for="dateGiven" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date Given</label>
                        <input type="date" v-model="loanForm.date_given" id="dateGiven" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required>
                    </div>

                    <div>
                        <label for="loanAmount" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount ($)</label>
                        <input type="number" step="0.01" v-model.number="loanForm.amount" id="loanAmount" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required>
                    </div>

                    <div>
                        <label for="interest" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Interest</label>
                        <input type="text" v-model="loanForm.interest" id="interest" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="e.g. 0% or 5%">
                    </div>

                    <div>
                        <label for="dueDate" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Due Date</label>
                        <input type="date" v-model="loanForm.due_date" id="dueDate" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required>
                    </div>

                    <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add Loan</button>
                </form>
            </div>
        </div>
      </div>
    </div>

    <!-- Loan Repayment Modal -->
    <div v-if="showRepaymentModal" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div class="relative w-full max-w-md max-h-full">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button type="button" @click="showRepaymentModal = false" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white">
                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                <span class="sr-only">Close modal</span>
            </button>
            <div class="px-6 py-6 lg:px-8">
                <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Record Loan Repayment</h3>
                <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">Repayment for: {{ selectedLoan?.borrower }} (Balance: {{ formatCurrency((selectedLoan?.amount || 0) - (selectedLoan?.amount_paid || 0)) }})</p>
                <form class="space-y-6" @submit.prevent="submitRepayment">
                    <div>
                        <label for="repayDate" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date</label>
                        <input type="date" v-model="repaymentForm.date" id="repayDate" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required>
                    </div>

                    <div>
                        <label for="repayAmount" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount ($)</label>
                        <input type="number" step="0.01" v-model.number="repaymentForm.amount" id="repayAmount" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required>
                    </div>

                    <div>
                        <label for="repayMethod" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Method</label>
                        <select id="repayMethod" v-model="repaymentForm.method" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required>
                            <option value="Cash">Cash</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Deduction">Deduction</option>
                        </select>
                    </div>

                    <div>
                        <label for="repayNotes" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Notes</label>
                        <textarea v-model="repaymentForm.notes" id="repayNotes" rows="2" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"></textarea>
                    </div>

                    <button type="submit" class="w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Record Repayment</button>
                </form>
            </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive, watch } from 'vue';
import api from '../api';

const selectedBook = ref('cash_book');
const events = ref([]);
const transactions = ref([]);
const loans = ref([]);
const loanRepayments = ref([]);
const showExpenseModal = ref(false);
const showLoanModal = ref(false);
const showRepaymentModal = ref(false);
const selectedLoan = ref(null);

// Table Controls State
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const sortKey = ref(null);
const sortOrder = ref('asc');

// Reset state when changing books
watch(selectedBook, () => {
    searchQuery.value = '';
    currentPage.value = 1;
    sortKey.value = null;
    sortOrder.value = 'asc';
});

const expenseForm = reactive({
    date: new Date().toISOString().split('T')[0],
    category: 'Spotify',
    assistant: '',
    description: '',
    amount: 0,
    notes: ''
});

const loanForm = reactive({
    borrower: '',
    type: 'Staff Loan',
    date_given: new Date().toISOString().split('T')[0],
    amount: 0,
    interest: '0%',
    due_date: '',
    status: 'Active'
});

const repaymentForm = reactive({
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    method: 'Cash',
    notes: ''
});

const loadData = async () => {
  try {
    const [eventsRes, transactionsRes, loansRes, repaymentsRes] = await Promise.all([
      api.get('/events'),
      api.get('/business/transactions'),
      api.get('/business/loans'),
      api.get('/business/loans/repayments')
    ]);
    events.value = eventsRes.data;
    transactions.value = transactionsRes.data;
    loans.value = loansRes.data;
    loanRepayments.value = repaymentsRes.data;
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

const submitLoan = async () => {
    try {
        await api.post('/business/loans', loanForm);

        // Reset form and reload
        showLoanModal.value = false;
        loanForm.borrower = '';
        loanForm.amount = 0;
        loanForm.interest = '0%';
        loanForm.due_date = '';

        await loadData();
    } catch (err) {
        console.error('Failed to add loan', err);
        alert('Failed to add loan');
    }
};

const openRepaymentModal = (loan) => {
    selectedLoan.value = loan;
    repaymentForm.amount = (loan.amount - loan.amount_paid).toFixed(2);
    repaymentForm.date = new Date().toISOString().split('T')[0];
    repaymentForm.notes = '';
    showRepaymentModal.value = true;
};

const submitRepayment = async () => {
    if (!selectedLoan.value) return;
    try {
        await api.post(`/business/loans/${selectedLoan.value.id}/repay`, repaymentForm);
        showRepaymentModal.value = false;
        await loadData();
    } catch (err) {
        console.error('Failed to record repayment', err);
        alert('Failed to record repayment');
    }
};

const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString();
};

const formatCurrency = (val) => {
    return (parseFloat(val) || 0).toFixed(2);
};

// --- Data Preparation for Computed Properties ---

const salesBookEntries = computed(() => {
    return events.value.map(e => ({
        date: e.date,
        client: e.client_name || 'Unknown',
        eventType: e.type || e.name,
        eventDate: e.date,
        total: e.total_cost,
        deposit: e.amount_paid,
        balance: e.total_cost - e.amount_paid,
        status: (e.total_cost - e.amount_paid) <= 0 ? 'Fully Paid' : 'Owing'
    }));
});

const debtorsBookEntries = computed(() => {
    return salesBookEntries.value.filter(e => e.balance > 0).map(e => ({
        ...e,
        paid: e.deposit,
        dueDate: e.eventDate,
        status: new Date(e.eventDate) < new Date() ? 'Overdue' : 'Owing'
    }));
});

const ownersDrawingsEntries = computed(() => {
    return transactions.value.filter(t => t.category === 'drawing');
});

const cashBookEntries = computed(() => {
    const entries = [];
    let runningBalance = 0;

    events.value.forEach(e => {
        if (e.amount_paid > 0) {
            entries.push({
                date: e.date,
                description: `Payment: ${e.name}`,
                moneyIn: e.amount_paid,
                moneyOut: null,
                timestamp: new Date(e.date).getTime()
            });
        }
    });

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

    transactions.value.forEach(t => {
        entries.push({
            date: t.date,
            description: t.description,
            moneyIn: t.type === 'in' ? t.amount : null,
            moneyOut: t.type === 'out' ? t.amount : null,
            timestamp: new Date(t.date).getTime()
        });
    });

    loans.value.forEach(l => {
        entries.push({
            date: l.date_given,
            description: `Loan to ${l.borrower}`,
            moneyIn: null,
            moneyOut: l.amount,
            timestamp: new Date(l.date_given).getTime()
        });
    });

    loanRepayments.value.forEach(r => {
        entries.push({
            date: r.date,
            description: `Loan Repayment: ${r.borrower}`,
            moneyIn: r.amount,
            moneyOut: null,
            timestamp: new Date(r.date).getTime()
        });
    });

    entries.sort((a, b) => a.timestamp - b.timestamp);

    return entries.map(e => {
        const income = e.moneyIn || 0;
        const expense = e.moneyOut || 0;
        runningBalance += (income - expense);
        return { ...e, balance: runningBalance };
    });
});

// --- Generic Table Logic (Search, Sort, Paginate) ---

const getSearchableFields = (book) => {
    switch(book) {
        case 'cash_book': return ['date', 'description', 'balance'];
        case 'sales_book': return ['date', 'client', 'eventType', 'status'];
        case 'debtors_book': return ['client', 'eventType', 'status'];
        case 'owners_drawings': return ['date', 'description', 'notes', 'method'];
        case 'loan_advances': return ['borrower', 'type', 'status'];
        default: return [];
    }
};

const currentBookSource = computed(() => {
     switch(selectedBook.value) {
        case 'cash_book': return cashBookEntries.value;
        case 'sales_book': return salesBookEntries.value;
        case 'debtors_book': return debtorsBookEntries.value;
        case 'owners_drawings': return ownersDrawingsEntries.value;
        case 'loan_advances': return loans.value;
        default: return [];
    }
});

const filteredData = computed(() => {
    let data = currentBookSource.value;
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        const fields = getSearchableFields(selectedBook.value);
        data = data.filter(item => {
            return fields.some(field => {
                const val = item[field];
                return String(val || '').toLowerCase().includes(query);
            });
        });
    }
    return data;
});

const sortedData = computed(() => {
    let data = [...filteredData.value];
    if (sortKey.value) {
        data.sort((a, b) => {
            let aVal = a[sortKey.value];
            let bVal = b[sortKey.value];

            // Simple type check for strings vs numbers
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                 aVal = aVal.toLowerCase();
                 bVal = bVal.toLowerCase();
            }

            if (aVal === bVal) return 0;
            let result = (aVal > bVal) ? 1 : -1;
            return sortOrder.value === 'asc' ? result : -result;
        });
    }
    return data;
});

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return sortedData.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage.value));

const sortBy = (key) => {
    if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortKey.value = key;
        sortOrder.value = 'asc';
    }
};

const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };
const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };

const statusClass = (status) => {
    switch(status) {
        case 'Fully Paid':
        case 'Balance Paid':
        case 'Active':
        case 'Repaid':
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'Owing':
        case 'Overdue':
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        default:
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
};
</script>
