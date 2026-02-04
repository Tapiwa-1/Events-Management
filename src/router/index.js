import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

import Login from '../views/auth/Login.vue';
import Register from '../views/auth/Register.vue';
import DashboardLayout from '../layouts/DashboardLayout.vue';
import Dashboard from '../views/Dashboard.vue';
import Events from '../views/Events.vue';
import Inventory from '../views/Inventory.vue';
import Logistics from '../views/Logistics.vue';
import Profile from '../views/Profile.vue';
import BusinessManagement from '../views/BusinessManagement.vue';
import AuditLogs from '../views/admin/AuditLogs.vue';

const routes = [
  { path: '/login', component: Login, meta: { guest: true } },
  { path: '/register', component: Register, meta: { guest: true } },
  {
    path: '/',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
        { path: '', component: Dashboard },
        { path: 'events', component: Events },
        { path: 'inventory', component: Inventory },
        { path: 'business', component: BusinessManagement },
        { path: 'logistics', component: Logistics, meta: { role: 'staff' } },
        { path: 'profile', component: Profile },
        { path: 'admin/logs', component: AuditLogs, meta: { role: 'admin' } },
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
