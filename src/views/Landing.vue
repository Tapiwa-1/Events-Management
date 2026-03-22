<template>
  <div class="font-sans text-gray-900">
    <!-- Navbar -->
    <nav class="bg-gray-900 text-white shadow-md">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div class="text-2xl font-bold">RS Events</div>

        <button
          class="rounded border border-gray-700 p-2 md:hidden"
          type="button"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <ul class="hidden space-x-6 md:flex">
          <li><a href="#about" class="hover:text-yellow-400">About</a></li>
          <li><a href="#services" class="hover:text-yellow-400">Services</a></li>
          <li><a href="#portfolio" class="hover:text-yellow-400">Portfolio</a></li>
          <li><a href="#updates" class="hover:text-yellow-400">Updates</a></li>
          <li><a href="#contact" class="hover:text-yellow-400">Contact</a></li>
        </ul>
      </div>

      <div v-if="isMobileMenuOpen" class="border-t border-gray-700 px-4 pb-4 md:hidden">
        <ul class="space-y-3 pt-4">
          <li><a href="#about" class="block hover:text-yellow-400" @click="isMobileMenuOpen = false">About</a></li>
          <li><a href="#services" class="block hover:text-yellow-400" @click="isMobileMenuOpen = false">Services</a></li>
          <li><a href="#portfolio" class="block hover:text-yellow-400" @click="isMobileMenuOpen = false">Portfolio</a></li>
          <li><a href="#updates" class="block hover:text-yellow-400" @click="isMobileMenuOpen = false">Updates</a></li>
          <li><a href="#contact" class="block hover:text-yellow-400" @click="isMobileMenuOpen = false">Contact</a></li>
          <li>
            <router-link to="/admin" class="block rounded bg-yellow-400 px-3 py-2 font-semibold text-gray-900" @click="isMobileMenuOpen = false">
              Admin Dashboard
            </router-link>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Hero with slideshow -->
    <section id="home" class="relative min-h-[85vh] overflow-hidden">
      <div class="absolute inset-0">
        <img
          v-for="(image, index) in heroSlides"
          :key="image"
          :src="image"
          :alt="`RS Events Hero Slide ${index + 1}`"
          :class="[
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in',
            index === activeSlide ? 'opacity-100' : 'opacity-0'
          ]"
        >
      </div>

      <div class="absolute inset-0 bg-black/55"></div>

      <div class="relative z-10 flex min-h-[85vh] flex-col items-center justify-center px-4 text-center">
        <h1 class="text-4xl font-bold text-white md:text-6xl">RS Events</h1>
        <p class="mt-4 text-lg text-white md:text-2xl">Your Partner for Sound, Décor, Media &amp; Catering</p>
        <div class="mt-6 flex flex-wrap justify-center gap-4">
          <a href="#services" class="rounded bg-yellow-400 px-6 py-3 text-gray-900 hover:bg-yellow-500">Our Services</a>
          <a href="#contact" class="rounded border border-yellow-400 px-6 py-3 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900">Get a Quote</a>
        </div>

        <div class="mt-8 flex items-center gap-2">
          <button
            v-for="(_, index) in heroSlides"
            :key="`indicator-${index}`"
            type="button"
            :aria-label="`Go to slide ${index + 1}`"
            @click="activeSlide = index"
            :class="[
              'h-2.5 w-2.5 rounded-full transition-all duration-300 ease-in',
              activeSlide === index ? 'w-7 bg-yellow-400' : 'bg-white/70 hover:bg-white'
            ]"
          ></button>
        </div>
      </div>
    </section>

    <!-- About -->
    <section id="about" class="bg-gray-100 py-20">
      <div class="mx-auto max-w-5xl px-4 text-center">
        <h2 class="mb-4 text-3xl font-bold">About RS Events</h2>
        <p class="text-gray-700">
          RS Events delivers seamless, high-impact experiences for weddings, corporate events, and private functions. With professional sound, creative décor, high-quality media production, and delicious catering, we bring your vision to life.
        </p>
      </div>
    </section>

    <!-- Services -->
    <section id="services" class="py-20">
      <div class="mx-auto max-w-7xl px-4 text-center">
        <h2 class="mb-12 text-3xl font-bold">Our Services</h2>
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div class="rounded bg-white p-6 shadow transition hover:shadow-lg">
            <h3 class="mb-2 text-xl font-bold">PA System Hire</h3>
            <p>Professional audio systems, microphones, mixers, and technical support for flawless sound at every event.</p>
          </div>
          <div class="rounded bg-white p-6 shadow transition hover:shadow-lg">
            <h3 class="mb-2 text-xl font-bold">Décor &amp; Styling</h3>
            <p>Themed décor, stage design, lighting, floral arrangements, and backdrops that create unforgettable atmospheres.</p>
          </div>
          <div class="rounded bg-white p-6 shadow transition hover:shadow-lg">
            <h3 class="mb-2 text-xl font-bold">Media &amp; Production</h3>
            <p>Photography, videography, live streaming, and social media content to capture and share every moment.</p>
          </div>
          <div class="rounded bg-white p-6 shadow transition hover:shadow-lg">
            <h3 class="mb-2 text-xl font-bold">Catering</h3>
            <p>Custom menus, buffet and plated services, beverages, and professional catering staff for exceptional dining.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Portfolio -->
    <section id="portfolio" class="bg-gray-100 py-20">
      <div class="mx-auto max-w-7xl px-4 text-center">
        <h2 class="mb-12 text-3xl font-bold">Portfolio</h2>
        <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop" alt="Event 1" class="h-56 w-full rounded object-cover shadow transition hover:scale-105"/>
          <img src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop" alt="Event 2" class="h-56 w-full rounded object-cover shadow transition hover:scale-105"/>
          <img src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1200&auto=format&fit=crop" alt="Event 3" class="h-56 w-full rounded object-cover shadow transition hover:scale-105"/>
        </div>
      </div>
    </section>

    <!-- Updates / News -->
    <section id="updates" class="py-20">
      <div class="mx-auto max-w-7xl px-4 text-center">
        <h2 class="mb-12 text-3xl font-bold">Latest Updates</h2>
        <div class="grid gap-8 md:grid-cols-3">
          <div class="rounded bg-white p-6 text-left shadow transition hover:shadow-lg">
            <h3 class="mb-2 text-xl font-bold">New Event Package Launch</h3>
            <p class="mb-2 text-gray-700">Explore our Premium Wedding &amp; Corporate Packages, designed for seamless event execution.</p>
            <p class="text-sm text-gray-400">March 10, 2026</p>
          </div>
          <div class="rounded bg-white p-6 text-left shadow transition hover:shadow-lg">
            <h3 class="mb-2 text-xl font-bold">Client Testimonial Highlight</h3>
            <p class="mb-2 text-gray-700">Hear from clients who loved our décor and catering at their recent events.</p>
            <p class="text-sm text-gray-400">Feb 28, 2026</p>
          </div>
          <div class="rounded bg-white p-6 text-left shadow transition hover:shadow-lg">
            <h3 class="mb-2 text-xl font-bold">Media Production Upgrades</h3>
            <p class="mb-2 text-gray-700">New high-definition cameras and drone coverage for event media production.</p>
            <p class="text-sm text-gray-400">Feb 15, 2026</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section id="contact" class="bg-gray-100 py-20">
      <div class="mx-auto max-w-4xl px-4 text-center">
        <h2 class="mb-8 text-3xl font-bold">Contact RS Events</h2>
        <p class="mb-8">Planning an event? Reach out to us today!</p>
        <form class="space-y-4 text-left">
          <input type="text" placeholder="Your Name" class="w-full rounded border p-3"/>
          <input type="email" placeholder="Email" class="w-full rounded border p-3"/>
          <input type="tel" placeholder="Phone" class="w-full rounded border p-3"/>
          <textarea placeholder="Message" class="h-32 w-full rounded border p-3"></textarea>
          <button type="button" class="rounded bg-yellow-400 px-6 py-3 hover:bg-yellow-500">Send Message</button>
        </form>
        <div class="mt-6">
          <p>📍 Harare, Zimbabwe</p>
          <p>📞 Phone: [Your Number]</p>
          <p>📧 Email: [Your Email]</p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 py-6 text-center text-white">
      <p>© 2026 RS Events. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const isMobileMenuOpen = ref(false);
const activeSlide = ref(0);
const heroSlides = [
  'https://images.unsplash.com/photo-1519167758481-83f29c8f7f73?q=80&w=1920&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=1920&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1920&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=1920&auto=format&fit=crop'
];

let slideTimer = null;

onMounted(() => {
  slideTimer = setInterval(() => {
    activeSlide.value = (activeSlide.value + 1) % heroSlides.length;
  }, 4500);
});

onUnmounted(() => {
  if (slideTimer) {
    clearInterval(slideTimer);
  }
});
</script>
