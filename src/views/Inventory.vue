<template>
  <div class="p-4">
    <div class="flex flex-col md:flex-row justify-between items-center mb-6">
      <h1 class="text-3xl font-bold dark:text-white mb-4 md:mb-0">Manage Inventory</h1>

      <!-- Dropdown for selecting the inventory type -->
      <div class="w-full md:w-64">
        <label for="inventory-select" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Inventory</label>
        <select
          id="inventory-select"
          v-model="selectedCategory"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="pa">PA System</option>
          <option value="photography">Photography</option>
          <option value="decor">Decor</option>
        </select>
      </div>
    </div>

    <!-- PA System Interface -->
    <div v-if="selectedCategory === 'pa'">

        <!-- Tabs -->
        <div class="mb-4 border-b border-gray-200 dark:border-gray-700">
            <ul class="flex flex-wrap -mb-px text-sm font-medium text-center" id="pa-tab" role="tablist">
                <li class="mr-2" role="presentation">
                    <button class="inline-block p-4 border-b-2 rounded-t-lg" :class="activeTab === 'register' ? 'border-blue-600 text-blue-600 dark:text-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'" @click="activeTab = 'register'">Inventory Register</button>
                </li>
                <li class="mr-2" role="presentation">
                    <button class="inline-block p-4 border-b-2 rounded-t-lg" :class="activeTab === 'movement' ? 'border-blue-600 text-blue-600 dark:text-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'" @click="activeTab = 'movement'">Movement Log</button>
                </li>
                <li class="mr-2" role="presentation">
                    <button class="inline-block p-4 border-b-2 rounded-t-lg" :class="activeTab === 'maintenance' ? 'border-blue-600 text-blue-600 dark:text-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'" @click="activeTab = 'maintenance'">Maintenance</button>
                </li>
                <li role="presentation">
                    <button class="inline-block p-4 border-b-2 rounded-t-lg" :class="activeTab === 'consumables' ? 'border-blue-600 text-blue-600 dark:text-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'" @click="activeTab = 'consumables'">Consumables</button>
                </li>
            </ul>
        </div>

        <!-- Toolbar: Search, Filter, Page Size -->
        <div class="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
            <div class="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <!-- Search -->
                <div class="relative w-full md:w-64">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
                    </div>
                    <input type="text" v-model="searchQuery" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search...">
                </div>

                <!-- Filters -->
                <select v-if="activeTab === 'register'" v-model="filterCategory" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="">All Categories</option>
                    <option value="Fixed Asset">Fixed Asset</option>
                    <option value="Operational">Operational</option>
                    <option value="Consumable">Consumable</option>
                </select>

                <select v-if="activeTab === 'movement'" v-model="selectedEventId" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="">All Events</option>
                    <option v-for="evt in events" :key="evt.id" :value="evt.id">{{ evt.name }} ({{ formatDate(evt.date) }})</option>
                </select>

                <select v-if="activeTab === 'maintenance'" v-model="filterStatus" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Fixed">Fixed</option>
                    <option value="Faulty">Faulty</option>
                </select>
            </div>

            <!-- Items Per Page -->
            <div class="flex items-center space-x-4 w-full md:w-auto justify-end">
                 <select v-model="itemsPerPage" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option :value="5">5 per page</option>
                    <option :value="10">10 per page</option>
                    <option :value="20">20 per page</option>
                    <option :value="50">50 per page</option>
                </select>
            </div>
        </div>

        <!-- Tab Content: Inventory Register -->
        <div v-if="activeTab === 'register'">
             <div class="mb-4 text-right">
                <button @click="openAddInventoryModal()" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Add Item</button>
            </div>
             <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('name')">Item Name <span v-if="sortKey==='name'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
                            <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('category')">Category <span v-if="sortKey==='category'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
                            <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('total_quantity')">Qty <span v-if="sortKey==='total_quantity'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
                            <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('condition')">Condition <span v-if="sortKey==='condition'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
                            <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('location')">Location <span v-if="sortKey==='location'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
                            <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('last_checked')">Last Checked <span v-if="sortKey==='last_checked'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
                            <th scope="col" class="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in paginatedData" :key="item.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ item.name }}</td>
                            <td class="px-6 py-4">{{ item.category }}</td>
                            <td class="px-6 py-4">{{ item.total_quantity }}</td>
                            <td class="px-6 py-4">{{ item.condition }}</td>
                            <td class="px-6 py-4">{{ item.location }}</td>
                            <td class="px-6 py-4">{{ formatDate(item.last_checked) }}</td>
                            <td class="px-6 py-4">
                                <button @click="openEditInventoryModal(item)" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                            </td>
                        </tr>
                        <tr v-if="paginatedData.length === 0">
                            <td colspan="7" class="px-6 py-4 text-center">No inventory items found.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Tab Content: Movement Log -->
        <div v-if="activeTab === 'movement'">
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('event_date')">Date <span v-if="sortKey==='event_date'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
                            <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('event_name')">Event <span v-if="sortKey==='event_name'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
                            <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('item_name')">Item <span v-if="sortKey==='item_name'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
                            <th scope="col" class="px-6 py-3">Qty Out</th>
                            <th scope="col" class="px-6 py-3">Qty Back</th>
                            <th scope="col" class="px-6 py-3">Missing</th>
                            <th scope="col" class="px-6 py-3">Condition</th>
                            <th scope="col" class="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="log in paginatedData" :key="log.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td class="px-6 py-4">{{ formatDate(log.event_date) }}</td>
                            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ log.event_name }}</td>
                            <td class="px-6 py-4">{{ log.item_name }}</td>
                            <td class="px-6 py-4">{{ log.qty_out || log.quantity }}</td> <!-- Fallback to booked qty if not specified yet -->
                            <td class="px-6 py-4">{{ log.qty_back }}</td>
                            <td class="px-6 py-4 text-red-600 font-bold">{{ log.missing > 0 ? log.missing : '-' }}</td>
                            <td class="px-6 py-4">{{ log.condition_return || '-' }}</td>
                            <td class="px-6 py-4">
                                <button @click="openMovementModal(log)" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Update</button>
                            </td>
                        </tr>
                        <tr v-if="paginatedData.length === 0">
                            <td colspan="8" class="px-6 py-4 text-center">No movement logs found.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Tab Content: Maintenance -->
        <div v-if="activeTab === 'maintenance'">
             <div class="mb-4 text-right">
                <button @click="openMaintenanceModal()" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Log Issue</button>
            </div>
             <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('date')">Date <span v-if="sortKey==='date'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
                            <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('item_name')">Item <span v-if="sortKey==='item_name'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
                            <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('issue')">Issue <span v-if="sortKey==='issue'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
                            <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('action')">Action <span v-if="sortKey==='action'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
                            <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('cost')">Cost ($) <span v-if="sortKey==='cost'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
                            <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('status')">Status <span v-if="sortKey==='status'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
                            <th scope="col" class="px-6 py-3">Update</th>
                        </tr>
                    </thead>
                    <tbody>
                         <tr v-for="log in paginatedData" :key="log.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td class="px-6 py-4">{{ formatDate(log.date) }}</td>
                            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ log.item_name }}</td>
                            <td class="px-6 py-4">{{ log.issue }}</td>
                            <td class="px-6 py-4">{{ log.action }}</td>
                            <td class="px-6 py-4">{{ log.cost }}</td>
                            <td class="px-6 py-4">
                                <span :class="{'bg-green-100 text-green-800': log.status === 'Fixed', 'bg-yellow-100 text-yellow-800': log.status !== 'Fixed'}" class="text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                    {{ log.status }}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <button v-if="log.status !== 'Fixed'" @click="openMaintenanceModal(log)" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Resolve</button>
                            </td>
                        </tr>
                        <tr v-if="paginatedData.length === 0">
                            <td colspan="7" class="px-6 py-4 text-center">No maintenance logs found.</td>
                        </tr>
                    </tbody>
                </table>
             </div>
        </div>

        <!-- Tab Content: Consumables -->
        <div v-if="activeTab === 'consumables'">
             <div class="mb-4 text-right">
                <button @click="openConsumableModal()" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Log Usage</button>
            </div>
             <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('date')">Date <span v-if="sortKey==='date'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
                            <th scope="col" class="px-6 py-3 cursor-pointer hover:text-blue-600" @click="sortBy('item_name')">Item <span v-if="sortKey==='item_name'">{{ sortOrder==='asc'?'↑':'↓'}}</span></th>
                            <th scope="col" class="px-6 py-3">Qty Used</th>
                            <th scope="col" class="px-6 py-3">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                         <tr v-for="log in paginatedData" :key="log.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td class="px-6 py-4">{{ formatDate(log.date) }}</td>
                            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ log.item_name }}</td>
                            <td class="px-6 py-4">{{ log.qty_used }}</td>
                            <td class="px-6 py-4">{{ log.balance }}</td>
                        </tr>
                        <tr v-if="paginatedData.length === 0">
                            <td colspan="4" class="px-6 py-4 text-center">No consumable logs found.</td>
                        </tr>
                    </tbody>
                </table>
             </div>
        </div>

        <!-- Pagination Controls -->
        <div v-if="filteredData.length > 0" class="flex flex-col items-center mt-4">
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

    </div>

    <!-- Coming Soon for Other Categories -->
    <div v-else class="flex flex-col items-center justify-center p-12 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Coming Soon</h2>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
          Inventory management for <span class="font-semibold">{{ categoryLabel }}</span> is currently under development.
        </p>
    </div>

    <!-- Modals -->

    <!-- Inventory Add/Edit Modal -->
    <div v-if="showInventoryModal" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4">
        <div class="bg-white dark:bg-gray-700 rounded-lg shadow w-full max-w-md p-6">
            <h3 class="text-xl font-medium mb-4 dark:text-white">{{ isEditingInventory ? 'Edit Inventory Item' : 'Add New Item' }}</h3>
            <form @submit.prevent="submitInventoryItem" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium dark:text-white">Item Name</label>
                    <input type="text" v-model="inventoryForm.name" class="w-full p-2 border rounded dark:bg-gray-600 dark:text-white" required>
                </div>
                <div>
                    <label class="block text-sm font-medium dark:text-white">Category</label>
                    <select v-model="inventoryForm.category" class="w-full p-2 border rounded dark:bg-gray-600 dark:text-white" required>
                        <option value="Fixed Asset">Fixed Asset</option>
                        <option value="Operational">Operational</option>
                        <option value="Consumable">Consumable</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium dark:text-white">Total Quantity</label>
                    <input type="number" v-model.number="inventoryForm.total_quantity" class="w-full p-2 border rounded dark:bg-gray-600 dark:text-white" required>
                </div>
                <div>
                    <label class="block text-sm font-medium dark:text-white">Buffer Time (Hours)</label>
                    <input type="number" v-model.number="inventoryForm.buffer_time_hours" class="w-full p-2 border rounded dark:bg-gray-600 dark:text-white">
                </div>
                 <div>
                    <label class="block text-sm font-medium dark:text-white">Condition</label>
                    <select v-model="inventoryForm.condition" class="w-full p-2 border rounded dark:bg-gray-600 dark:text-white">
                        <option value="New">New</option>
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                        <option value="Poor">Poor</option>
                    </select>
                </div>
                 <div>
                    <label class="block text-sm font-medium dark:text-white">Location</label>
                    <input type="text" v-model="inventoryForm.location" class="w-full p-2 border rounded dark:bg-gray-600 dark:text-white" placeholder="e.g. Store, Gig Bag">
                </div>
                <div>
                    <label class="block text-sm font-medium dark:text-white">Last Checked</label>
                    <input type="date" v-model="inventoryForm.last_checked" class="w-full p-2 border rounded dark:bg-gray-600 dark:text-white">
                </div>

                <div class="flex justify-end gap-2">
                    <button type="button" @click="showInventoryModal = false" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                    <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Movement Update Modal -->
    <div v-if="showMovementModal" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4">
        <div class="bg-white dark:bg-gray-700 rounded-lg shadow w-full max-w-md p-6">
            <h3 class="text-xl font-medium mb-4 dark:text-white">Update Movement: {{ selectedLog?.item_name }}</h3>
            <form @submit.prevent="submitMovementUpdate" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium dark:text-white">Qty Out</label>
                    <input type="number" v-model.number="movementForm.qty_out" class="w-full p-2 border rounded dark:bg-gray-600 dark:text-white">
                </div>
                 <div>
                    <label class="block text-sm font-medium dark:text-white">Qty Back</label>
                    <input type="number" v-model.number="movementForm.qty_back" class="w-full p-2 border rounded dark:bg-gray-600 dark:text-white">
                </div>
                 <div>
                    <label class="block text-sm font-medium dark:text-white">Missing</label>
                    <input type="number" v-model.number="movementForm.missing" class="w-full p-2 border rounded dark:bg-gray-600 dark:text-white">
                </div>
                 <div>
                    <label class="block text-sm font-medium dark:text-white">Condition on Return</label>
                    <input type="text" v-model="movementForm.condition_return" class="w-full p-2 border rounded dark:bg-gray-600 dark:text-white">
                </div>
                <div class="flex justify-end gap-2">
                    <button type="button" @click="showMovementModal = false" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                    <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Maintenance Log Modal -->
    <div v-if="showMaintenanceModal" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4">
        <div class="bg-white dark:bg-gray-700 rounded-lg shadow w-full max-w-md p-6">
            <h3 class="text-xl font-medium mb-4 dark:text-white">{{ isEditingMaintenance ? 'Resolve Issue' : 'Log New Issue' }}</h3>
            <form @submit.prevent="submitMaintenance" class="space-y-4">
                 <div v-if="!isEditingMaintenance">
                    <label for="maint_item" class="block text-sm font-medium dark:text-white">Item</label>
                    <select id="maint_item" v-model="maintenanceForm.item_id" class="w-full p-2 border rounded dark:bg-gray-600 dark:text-white" required>
                        <option v-for="item in inventoryItems" :key="item.id" :value="item.id">{{ item.name }}</option>
                    </select>
                </div>
                <div v-if="!isEditingMaintenance">
                    <label for="maint_date" class="block text-sm font-medium dark:text-white">Date</label>
                    <input id="maint_date" type="date" v-model="maintenanceForm.date" class="w-full p-2 border rounded dark:bg-gray-600 dark:text-white" required>
                </div>
                <div v-if="!isEditingMaintenance">
                    <label for="maint_issue" class="block text-sm font-medium dark:text-white">Issue Description</label>
                    <input id="maint_issue" type="text" v-model="maintenanceForm.issue" class="w-full p-2 border rounded dark:bg-gray-600 dark:text-white" required>
                </div>
                 <div>
                    <label for="maint_action" class="block text-sm font-medium dark:text-white">Action Taken</label>
                    <input id="maint_action" type="text" v-model="maintenanceForm.action" class="w-full p-2 border rounded dark:bg-gray-600 dark:text-white">
                </div>
                 <div>
                    <label for="maint_cost" class="block text-sm font-medium dark:text-white">Cost ($)</label>
                    <input id="maint_cost" type="number" step="0.01" v-model.number="maintenanceForm.cost" class="w-full p-2 border rounded dark:bg-gray-600 dark:text-white">
                </div>
                 <div>
                    <label for="maint_status" class="block text-sm font-medium dark:text-white">Status</label>
                    <select id="maint_status" v-model="maintenanceForm.status" class="w-full p-2 border rounded dark:bg-gray-600 dark:text-white">
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Fixed">Fixed</option>
                        <option value="Faulty">Faulty / Needs Replacement</option>
                    </select>
                </div>
                <div class="flex justify-end gap-2">
                    <button type="button" @click="showMaintenanceModal = false" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                    <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Consumable Log Modal -->
    <div v-if="showConsumableModal" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4">
        <div class="bg-white dark:bg-gray-700 rounded-lg shadow w-full max-w-md p-6">
            <h3 class="text-xl font-medium mb-4 dark:text-white">Log Consumable Usage</h3>
            <form @submit.prevent="submitConsumable" class="space-y-4">
                 <div>
                    <label for="cons_item" class="block text-sm font-medium dark:text-white">Item</label>
                    <select id="cons_item" v-model="consumableForm.item_id" class="w-full p-2 border rounded dark:bg-gray-600 dark:text-white" required>
                         <!-- Filter only consumable items -->
                        <option v-for="item in inventoryItems.filter(i => i.category === 'Consumable')" :key="item.id" :value="item.id">{{ item.name }} (Current: {{ item.total_quantity }})</option>
                    </select>
                </div>
                <div>
                    <label for="cons_date" class="block text-sm font-medium dark:text-white">Date</label>
                    <input id="cons_date" type="date" v-model="consumableForm.date" class="w-full p-2 border rounded dark:bg-gray-600 dark:text-white" required>
                </div>
                <div>
                    <label for="cons_qty" class="block text-sm font-medium dark:text-white">Qty Used</label>
                    <input id="cons_qty" type="number" v-model.number="consumableForm.qty_used" class="w-full p-2 border rounded dark:bg-gray-600 dark:text-white" required min="1">
                </div>
                <div class="flex justify-end gap-2">
                    <button type="button" @click="showConsumableModal = false" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                    <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
                </div>
            </form>
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from 'vue';
import api from '../api';

const selectedCategory = ref('pa');
const activeTab = ref('register');

// Data
const inventoryItems = ref([]);
const movementLogs = ref([]);
const maintenanceLogs = ref([]);
const consumableLogs = ref([]);
const events = ref([]);

// Filters & Search
const selectedEventId = ref('');
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const sortKey = ref(null);
const sortOrder = ref('asc');

const filterCategory = ref('');
const filterStatus = ref('');

// Modals & Forms
const showInventoryModal = ref(false);
const isEditingInventory = ref(false);
const inventoryForm = reactive({
    id: null,
    name: '',
    category: 'Fixed Asset',
    total_quantity: 0,
    buffer_time_hours: 0,
    condition: 'Good',
    location: '',
    last_checked: ''
});

const showMovementModal = ref(false);
const selectedLog = ref(null);
const movementForm = reactive({
    qty_out: 0,
    qty_back: 0,
    missing: 0,
    condition_return: ''
});

const showMaintenanceModal = ref(false);
const isEditingMaintenance = ref(false);
const maintenanceForm = reactive({
    id: null,
    item_id: null,
    date: '',
    issue: '',
    action: '',
    cost: 0,
    status: 'Pending'
});

const showConsumableModal = ref(false);
const consumableForm = reactive({
    item_id: null,
    date: '',
    qty_used: 1
});

// Computed
const categoryLabel = computed(() => {
  switch (selectedCategory.value) {
    case 'pa': return 'PA System';
    case 'photography': return 'Photography';
    case 'decor': return 'Decor';
    default: return '';
  }
});

// Load Data
const loadInventory = async () => {
    try {
        const res = await api.get('/inventory', { params: { type: selectedCategory.value } });
        inventoryItems.value = res.data;
    } catch (err) { console.error(err); }
};

const loadMovementLog = async () => {
    try {
        // We load all logs and filter client side for better UX with search/pagination
        // OR we can keep backend filtering. For now, let's load all to support generic search easily.
        // If we strictly want to follow previous pattern:
        // const params = {};
        // if (selectedEventId.value) params.event_id = selectedEventId.value;
        // const res = await api.get('/inventory/movement', { params });

        // But to support search across all fields easily without backend changes, fetching all is easier for now.
        // Let's keep fetching all for now, or fetch by event if selected.
        // Actually, if I want to filter by event in the UI (as requested "add filters"), I should probably fetch all.
        const res = await api.get('/inventory/movement');
        movementLogs.value = res.data;
    } catch (err) { console.error(err); }
};

const loadMaintenance = async () => {
    try {
        const res = await api.get('/inventory/maintenance');
        maintenanceLogs.value = res.data;
    } catch (err) { console.error(err); }
};

const loadConsumables = async () => {
    try {
        const res = await api.get('/inventory/consumables');
        consumableLogs.value = res.data;
    } catch (err) { console.error(err); }
};

const loadEvents = async () => {
    try {
        const res = await api.get('/events');
        events.value = res.data;
    } catch (err) { console.error(err); }
};

// Computed Properties for Table Logic
const currentSource = computed(() => {
    switch (activeTab.value) {
        case 'register': return inventoryItems.value;
        case 'movement': return movementLogs.value;
        case 'maintenance': return maintenanceLogs.value;
        case 'consumables': return consumableLogs.value;
        default: return [];
    }
});

const getSearchableFields = (tab) => {
    switch (tab) {
        case 'register': return ['name', 'category', 'condition', 'location'];
        case 'movement': return ['event_name', 'item_name', 'condition_return'];
        case 'maintenance': return ['item_name', 'issue', 'action', 'status'];
        case 'consumables': return ['item_name'];
        default: return [];
    }
};

const filteredData = computed(() => {
    let data = currentSource.value;

    // Specific Filters
    if (activeTab.value === 'register' && filterCategory.value) {
        data = data.filter(item => item.category === filterCategory.value);
    }
    if (activeTab.value === 'movement' && selectedEventId.value) {
        // Filter by selectedEventId locally
        data = data.filter(log => log.event_id == selectedEventId.value);
    }
    if (activeTab.value === 'maintenance' && filterStatus.value) {
        data = data.filter(log => log.status === filterStatus.value);
    }

    // Search
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        const fields = getSearchableFields(activeTab.value);
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

// Initial Load & Watchers
onMounted(() => {
    loadInventory();
    loadMovementLog();
    loadMaintenance();
    loadConsumables();
    loadEvents();
});

watch(selectedCategory, () => {
    loadInventory();
});

watch(activeTab, () => {
    searchQuery.value = '';
    currentPage.value = 1;
    sortKey.value = null;
    sortOrder.value = 'asc';
    // Reset filters? Maybe keep them if switching back?
    // Let's reset for cleaner UX.
    filterCategory.value = '';
    filterStatus.value = '';
    selectedEventId.value = '';
});

// Actions
const openAddInventoryModal = () => {
    isEditingInventory.value = false;
    inventoryForm.id = null;
    inventoryForm.name = '';
    inventoryForm.category = 'Fixed Asset';
    inventoryForm.total_quantity = 0;
    inventoryForm.buffer_time_hours = 0;
    inventoryForm.condition = 'Good';
    inventoryForm.location = '';
    inventoryForm.last_checked = new Date().toISOString().split('T')[0];
    showInventoryModal.value = true;
};

const openEditInventoryModal = (item) => {
    isEditingInventory.value = true;
    inventoryForm.id = item.id;
    inventoryForm.name = item.name;
    inventoryForm.category = item.category;
    inventoryForm.total_quantity = item.total_quantity;
    inventoryForm.buffer_time_hours = item.buffer_time_hours;
    inventoryForm.condition = item.condition;
    inventoryForm.location = item.location;
    inventoryForm.last_checked = item.last_checked;
    showInventoryModal.value = true;
};

const submitInventoryItem = async () => {
    try {
        const payload = {
            ...inventoryForm,
            type: selectedCategory.value // Ensure correct type is sent
        };

        if (isEditingInventory.value) {
            await api.put(`/inventory/${inventoryForm.id}`, payload);
        } else {
            await api.post('/inventory', payload);
        }
        showInventoryModal.value = false;
        loadInventory();
    } catch (err) {
        console.error(err);
        alert('Failed to save item');
    }
};

const openMovementModal = (log) => {
    selectedLog.value = log;
    movementForm.qty_out = log.qty_out || log.quantity;
    movementForm.qty_back = log.qty_back || 0;
    movementForm.missing = log.missing || 0;
    movementForm.condition_return = log.condition_return || '';
    showMovementModal.value = true;
};

const submitMovementUpdate = async () => {
    if (!selectedLog.value) return;
    try {
        await api.put(`/inventory/booking/${selectedLog.value.id}`, movementForm);
        showMovementModal.value = false;
        loadMovementLog();
    } catch (err) { alert('Update failed'); }
};

const openMaintenanceModal = (log = null) => {
    if (log) {
        isEditingMaintenance.value = true;
        maintenanceForm.id = log.id;
        maintenanceForm.item_id = log.item_id;
        maintenanceForm.date = log.date;
        maintenanceForm.issue = log.issue;
        maintenanceForm.action = log.action || '';
        maintenanceForm.cost = log.cost || 0;
        maintenanceForm.status = log.status;
    } else {
        isEditingMaintenance.value = false;
        maintenanceForm.id = null;
        maintenanceForm.item_id = null;
        maintenanceForm.date = new Date().toISOString().split('T')[0];
        maintenanceForm.issue = '';
        maintenanceForm.action = '';
        maintenanceForm.cost = 0;
        maintenanceForm.status = 'Pending';
    }
    showMaintenanceModal.value = true;
};

const submitMaintenance = async () => {
    try {
        if (isEditingMaintenance.value) {
            await api.put(`/inventory/maintenance/${maintenanceForm.id}`, maintenanceForm);
        } else {
            await api.post('/inventory/maintenance', maintenanceForm);
        }
        showMaintenanceModal.value = false;
        loadMaintenance();
    } catch (err) { alert('Failed to save maintenance log'); }
};

const openConsumableModal = () => {
    consumableForm.item_id = null;
    consumableForm.date = new Date().toISOString().split('T')[0];
    consumableForm.qty_used = 1;
    showConsumableModal.value = true;
};

const submitConsumable = async () => {
    try {
        await api.post('/inventory/consumables', consumableForm);
        showConsumableModal.value = false;
        loadConsumables();
        loadInventory(); // Refresh stock
    } catch (err) { alert('Failed to log consumable'); }
};

const formatDate = (d) => {
    if (!d) return '-';
    return new Date(d).toLocaleDateString();
};
</script>
