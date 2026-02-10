import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

import DashboardLayout from '../layouts/DashboardLayout.vue';

const routes = [
  { path: '/login', component: () => import('../views/auth/Login.vue'), meta: { guest: true } },
  { path: '/register', component: () => import('../views/auth/Register.vue'), meta: { guest: true } },
  {
    path: '/',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
        { path: '', component: () => import('../views/Dashboard.vue') },
        { path: 'events', component: () => import('../views/Events.vue') },
        { path: 'inventory', component: () => import('../views/Inventory.vue') },
        { path: 'business', component: () => import('../views/BusinessManagement.vue') },
        { path: 'marketing', component: () => import('../views/Marketing.vue') },
        { path: 'logistics', component: () => import('../views/Logistics.vue'), meta: { role: 'staff' } },
        { path: 'profile', component: () => import('../views/Profile.vue') },
        { path: 'admin/logs', component: () => import('../views/admin/AuditLogs.vue'), meta: { role: 'admin' } },
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Try to restore session if not loaded
  if (!authStore.user && !authStore.loading) {
      await authStore.checkAuth();
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/login');
  }

  if (to.meta.guest && authStore.isAuthenticated) {
    return next('/');
  }

  if (to.meta.role) {
      const role = to.meta.role;
      // Simple role check
      if (role === 'admin' && !authStore.isAdmin) return next('/');
      if (role === 'staff' && !authStore.isStaff) return next('/');
  }

  next();
});

export default router;
