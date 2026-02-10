<template>
  <div>
    <h1 class="text-4xl font-bold mb-8 dark:text-white">Dashboard</h1>

    <!-- Navigation Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <router-link to="/events" class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-500">Events</h5>
            <p class="font-normal text-gray-700 dark:text-gray-400">Manage client events and bookings.</p>
        </router-link>

        <router-link to="/inventory" class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-green-600 dark:text-green-500">Inventory</h5>
            <p class="font-normal text-gray-700 dark:text-gray-400">Check stock availability and make reservations.</p>
        </router-link>

        <router-link v-if="authStore.isStaff" to="/logistics" class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-orange-600 dark:text-orange-500">Logistics</h5>
            <p class="font-normal text-gray-700 dark:text-gray-400">View daily dispatch and pickup lists.</p>
        </router-link>

        <div class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-purple-600 dark:text-purple-500">My Profile</h5>
            <p class="font-normal text-gray-700 dark:text-gray-400">{{ authStore.user?.name }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ authStore.user?.email }}</p>
        </div>
    </div>

    <!-- Analytics Section -->
    <div class="mb-8">
        <div class="flex flex-col md:flex-row justify-between items-center mb-6">
            <h2 class="text-2xl font-bold dark:text-white mb-4 md:mb-0">Analytics</h2>

            <!-- Filter Controls -->
            <div class="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                <div class="inline-flex rounded-md shadow-sm" role="group">
                    <button type="button" @click="setRange('week')" :class="['px-4 py-2 text-sm font-medium border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white', rangeMode === 'week' ? 'text-blue-700 bg-gray-100 dark:bg-gray-600' : 'bg-white text-gray-900']">
                        1 Week
                    </button>
                    <button type="button" @click="setRange('month')" :class="['px-4 py-2 text-sm font-medium border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white', rangeMode === 'month' ? 'text-blue-700 bg-gray-100 dark:bg-gray-600' : 'bg-white text-gray-900']">
                        1 Month
                    </button>
                    <button type="button" @click="setRange('custom')" :class="['px-4 py-2 text-sm font-medium border border-gray-200 rounded-r-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white', rangeMode === 'custom' ? 'text-blue-700 bg-gray-100 dark:bg-gray-600' : 'bg-white text-gray-900']">
                        Custom
                    </button>
                </div>

                <div v-if="rangeMode === 'custom'" class="flex items-center space-x-2">
                    <input type="date" v-model="customStart" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
                    <span class="text-gray-500 dark:text-gray-400">to</span>
                    <input type="date" v-model="customEnd" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
                </div>
            </div>
        </div>

        <div v-if="loading" class="text-center py-10">
            <div role="status">
                <svg aria-hidden="true" class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span class="sr-only">Loading...</span>
            </div>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Cash Flow Chart -->
            <div class="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <h3 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Cash Flow (Income vs Expense)</h3>
                <div class="h-64">
                     <Line :data="cashFlowData" :options="chartOptions" />
                </div>
            </div>

            <!-- Sales Chart -->
            <div class="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <h3 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Sales Revenue</h3>
                <div class="h-64">
                     <Bar :data="salesChartData" :options="chartOptions" />
                </div>
            </div>

            <!-- Bookings Chart -->
            <div class="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <h3 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Bookings / Events Count</h3>
                <div class="h-64">
                     <Bar :data="bookingsChartData" :options="chartOptions" />
                </div>
            </div>

            <!-- Events Status Breakdown -->
             <div class="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <h3 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Events Status Breakdown</h3>
                <div class="h-64 flex justify-center">
                     <Doughnut :data="statusChartData" :options="doughnutOptions" />
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import api from '../api';
import { getFinancialData } from '../utils/financials';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'vue-chartjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const authStore = useAuthStore();

// State
const loading = ref(true);
const rangeMode = ref('week'); // 'week', 'month', 'custom'
const customStart = ref('');
const customEnd = ref('');

// Data
const events = ref([]);
const transactions = ref([]);
const loans = ref([]);
const repayments = ref([]);
const maintenanceLogs = ref([]);

// Financial Data (Processed)
const processedData = ref({
    labels: [],
    income: [],
    expense: [],
    sales: [],
    bookings: [],
    statusCounts: {}
});

const loadData = async () => {
    loading.value = true;
    try {
        const [eventsRes, transactionsRes, loansRes, repaymentsRes, maintenanceRes] = await Promise.all([
          api.get('/events'),
          api.get('/business/transactions'),
          api.get('/business/loans'),
          api.get('/business/loans/repayments'),
          api.get('/inventory/maintenance')
        ]);
        events.value = eventsRes.data;
        transactions.value = transactionsRes.data;
        loans.value = loansRes.data;
        repayments.value = repaymentsRes.data;
        maintenanceLogs.value = maintenanceRes.data;

        processData();
    } catch (err) {
        console.error('Failed to load dashboard data', err);
    } finally {
        loading.value = false;
    }
};

const processData = () => {
    let start, end;
    const today = new Date();

    if (rangeMode.value === 'week') {
        // Last 7 days
        start = new Date(today);
        start.setDate(today.getDate() - 6);
        end = today;
    } else if (rangeMode.value === 'month') {
        // Last 30 days
        start = new Date(today);
        start.setDate(today.getDate() - 29);
        end = today;
    } else if (rangeMode.value === 'custom') {
        if (customStart.value && customEnd.value) {
            start = new Date(customStart.value);
            end = new Date(customEnd.value);
        } else {
            // Default to week if invalid
            start = new Date(today);
            start.setDate(today.getDate() - 6);
            end = today;
        }
    }

    if (start && end) {
        // Ensure format YYYY-MM-DD for getFinancialData
        const startDateStr = start.toISOString().split('T')[0];
        const endDateStr = end.toISOString().split('T')[0];

        processedData.value = getFinancialData(
            events.value,
            transactions.value,
            loans.value,
            repayments.value,
            maintenanceLogs.value,
            startDateStr,
            endDateStr
        );
    }
};

const setRange = (mode) => {
    rangeMode.value = mode;
    if (mode === 'custom') {
        const today = new Date();
        const start = new Date(today);
        start.setDate(today.getDate() - 6);
        customEnd.value = today.toISOString().split('T')[0];
        customStart.value = start.toISOString().split('T')[0];
    }
};

// Watchers to re-process data when filter changes
watch(rangeMode, () => processData());
watch([customStart, customEnd], () => {
    if (rangeMode.value === 'custom') processData();
});

onMounted(() => {
    loadData();
});

// Chart Configuration
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                 color: (context) => document.documentElement.classList.contains('dark') ? '#fff' : '#374151'
            }
        },
        tooltip: {
            mode: 'index',
            intersect: false,
        }
    },
    scales: {
        x: {
             ticks: { color: (context) => document.documentElement.classList.contains('dark') ? '#9ca3af' : '#374151' },
             grid: { color: (context) => document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb' }
        },
        y: {
             ticks: { color: (context) => document.documentElement.classList.contains('dark') ? '#9ca3af' : '#374151' },
             grid: { color: (context) => document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb' }
        }
    }
};

const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
             labels: {
                 color: (context) => document.documentElement.classList.contains('dark') ? '#fff' : '#374151'
            }
        }
    }
};

// Chart Data Computed Properties
const cashFlowData = computed(() => ({
    labels: processedData.value.labels,
    datasets: [
        {
            label: 'Income ($)',
            backgroundColor: '#10B981', // green-500
            borderColor: '#10B981',
            data: processedData.value.income,
            tension: 0.3
        },
        {
            label: 'Expense ($)',
            backgroundColor: '#EF4444', // red-500
            borderColor: '#EF4444',
            data: processedData.value.expense,
            tension: 0.3
        }
    ]
}));

const salesChartData = computed(() => ({
    labels: processedData.value.labels,
    datasets: [
        {
            label: 'Sales ($)',
            backgroundColor: '#3B82F6', // blue-500
            data: processedData.value.sales
        }
    ]
}));

const bookingsChartData = computed(() => ({
    labels: processedData.value.labels,
    datasets: [
        {
            label: 'Events Count',
            backgroundColor: '#8B5CF6', // purple-500
            data: processedData.value.bookings
        }
    ]
}));

const statusChartData = computed(() => {
    const statuses = Object.keys(processedData.value.statusCounts);
    const counts = Object.values(processedData.value.statusCounts);

    // Define some colors for common statuses
    const colors = {
        'planned': '#3B82F6', // blue
        'completed': '#10B981', // green
        'cancelled': '#EF4444', // red
        'pending': '#F59E0B', // yellow
    };
    const backgroundColors = statuses.map(s => colors[s.toLowerCase()] || '#6B7280'); // default gray

    return {
        labels: statuses,
        datasets: [
            {
                data: counts,
                backgroundColor: backgroundColors,
            }
        ]
    };
});
</script>
