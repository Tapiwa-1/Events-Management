import { defineStore } from 'pinia';
import api from '../api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === 'admin',
    isStaff: (state) => ['admin', 'staff'].includes(state.user?.role),
  },
  actions: {
    async login(credentials) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.post('/auth/login', credentials);
        this.user = res.data.user;
        return true;
      } catch (err) {
        this.error = err.response?.data?.error || 'Login failed';
        return false;
      } finally {
        this.loading = false;
      }
    },
    async register(data) {
        this.loading = true;
        this.error = null;
        try {
            await api.post('/auth/register', data);
            return true;
        } catch (err) {
            this.error = err.response?.data?.error || 'Registration failed';
            return false;
        } finally {
            this.loading = false;
        }
    },
    async logout() {
      try {
        await api.post('/auth/logout');
      } catch (e) {
        console.error(e);
      } finally {
        this.user = null;
        // Router redirect handled in component or router
      }
    },
    async checkAuth() {
        if (this.user) return;
        try {
            const res = await api.get('/auth/me');
            this.user = res.data;
        } catch (err) {
            this.user = null;
        }
    }
  },
});
