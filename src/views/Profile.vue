<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Profile Management</h1>

    <div class="bg-white p-6 rounded shadow max-w-lg">
      <form @submit.prevent="updateProfile">
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2">Full Name</label>
          <input v-model="form.full_name" type="text" class="border p-2 rounded w-full" required>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2">Email</label>
          <input v-model="form.email" type="email" class="border p-2 rounded w-full" required>
        </div>
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Update Profile
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import api from '../api';

const authStore = useAuthStore();
const form = reactive({
    full_name: '',
    email: ''
});

onMounted(() => {
    if (authStore.user) {
        form.full_name = authStore.user.name;
        form.email = authStore.user.email;
    }
});

const updateProfile = async () => {
    try {
        await api.put('/auth/profile', form);
        alert('Profile updated');
        authStore.checkAuth(); // Refresh user data
    } catch (err) {
        alert('Update failed');
    }
};
</script>
