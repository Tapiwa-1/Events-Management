<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-5xl mx-auto px-6 py-20">
      <p class="text-sm uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold">Event Management Platform</p>
      <h1 class="mt-4 text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
        Organize events, inventory, and business operations in one place.
      </h1>
      <p class="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
        Plan events, track inventory, manage logistics, and monitor business performance from your admin workspace.
      </p>

      <div class="mt-10 flex flex-wrap gap-4">
        <router-link
          to="/admin"
          class="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Go to Dashboard
        </router-link>
        <router-link
          to="/login"
          class="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          Sign In
        </router-link>
      </div>
    </div>
  </div>
</template>
