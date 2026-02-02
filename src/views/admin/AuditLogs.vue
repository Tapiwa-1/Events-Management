<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Audit Logs</h1>
    <div class="bg-white rounded shadow overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-gray-100 border-b">
          <tr>
            <th class="p-4">Timestamp</th>
            <th class="p-4">User</th>
            <th class="p-4">Action</th>
            <th class="p-4">Details</th>
            <th class="p-4">IP</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.id" class="border-b hover:bg-gray-50">
            <td class="p-4 text-sm">{{ new Date(log.timestamp).toLocaleString() }}</td>
            <td class="p-4">{{ log.email }}</td>
            <td class="p-4 font-bold">{{ log.action }}</td>
            <td class="p-4 text-sm text-gray-600">{{ log.details }}</td>
            <td class="p-4 text-mono text-xs">{{ log.ip_address }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../api';

const logs = ref([]);

onMounted(async () => {
    try {
        const res = await api.get('/auth/logs');
        logs.value = res.data;
    } catch (err) {
        console.error(err);
    }
});
</script>
