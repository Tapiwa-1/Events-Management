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
          <li><a href="#packages" class="hover:text-yellow-400">Packages</a></li>
          <li><a href="#portfolio" class="hover:text-yellow-400">Portfolio</a></li>
          <li><a href="#updates" class="hover:text-yellow-400">Updates</a></li>
          <li><a href="#contact" class="hover:text-yellow-400">Contact</a></li>
        </ul>
      </div>

      <div v-if="isMobileMenuOpen" class="border-t border-gray-700 px-4 pb-4 md:hidden">
        <ul class="space-y-3 pt-4">
          <li><a href="#about" class="block hover:text-yellow-400" @click="isMobileMenuOpen = false">About</a></li>
          <li><a href="#services" class="block hover:text-yellow-400" @click="isMobileMenuOpen = false">Services</a></li>
          <li><a href="#packages" class="block hover:text-yellow-400" @click="isMobileMenuOpen = false">Packages</a></li>
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
        <h2 class="mb-12 text-3xl font-bold">🛠️ Our Services</h2>
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div class="rounded bg-white p-6 shadow transition hover:shadow-lg">
            <h3 class="mb-2 text-xl font-bold">🔊 PA System Hire</h3>
            <p>Professional audio systems, microphones, mixers, and technical support for flawless sound at every event.</p>
          </div>
          <div class="rounded bg-white p-6 shadow transition hover:shadow-lg">
            <h3 class="mb-2 text-xl font-bold">🎨 Décor &amp; Styling</h3>
            <p>Themed décor, stage design, lighting, floral arrangements, and backdrops that create unforgettable atmospheres.</p>
          </div>
          <div class="rounded bg-white p-6 shadow transition hover:shadow-lg">
            <h3 class="mb-2 text-xl font-bold">🎥 Media &amp; Production</h3>
            <p>Photography, videography, live streaming, and social media content to capture and share every moment.</p>
          </div>
          <div class="rounded bg-white p-6 shadow transition hover:shadow-lg">
            <h3 class="mb-2 text-xl font-bold">🍽️ Catering</h3>
            <p>Custom menus, buffet and plated services, beverages, and professional catering staff for exceptional dining.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Packages -->
    <section id="packages" class="bg-gray-100 py-20">
      <div class="mx-auto max-w-7xl px-4 text-center">
        <h2 class="mb-4 text-3xl font-bold">📦 Our Packages</h2>
        <p class="mx-auto mb-12 max-w-3xl text-gray-700">
          Each package total is calculated dynamically from PA + Décor + Media + Catering (per plate × people).
        </p>

        <div class="grid gap-8 md:grid-cols-2 xl:grid-cols-4 text-left">
          <div
            v-for="pkg in landingPackages"
            :key="pkg.name"
            class="rounded-xl border p-6 shadow transition hover:-translate-y-1 hover:shadow-lg" :class="pkg.cardClass"
          >
            <h3 class="mb-1 text-xl font-bold" :class="pkg.titleClass">{{ pkg.name }}</h3>
            <p class="text-sm font-medium text-gray-600">{{ pkg.people }} people</p>
            <p class="mb-4 text-sm text-gray-700">{{ pkg.description }}</p>

            <ul class="space-y-2 text-gray-700 text-sm">
              <li>PA System: <span class="font-semibold">{{ formatCurrency(pkg.pa) }}</span></li>
              <li>Décor: <span class="font-semibold">{{ formatCurrency(pkg.decor) }}</span></li>
              <li>Media: <span class="font-semibold">{{ formatCurrency(pkg.media) }}</span></li>
              <li>Catering: <span class="font-semibold">{{ formatCurrency(pkg.catering) }}</span></li>
            </ul>

            <div class="mt-4 border-t pt-3">
              <p class="text-lg font-bold" :class="pkg.totalClass">Total: {{ formatCurrency(pkg.total) }}</p>
              <p v-if="pkg.mediaNote" class="mt-1 text-xs text-gray-500">{{ pkg.mediaNote }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Portfolio -->
    <section id="portfolio" class="bg-gray-100 py-20">
      <div class="mx-auto max-w-7xl px-4 text-center">
        <h2 class="mb-12 text-3xl font-bold">🖼️ Portfolio</h2>
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
        <h2 class="mb-12 text-3xl font-bold">📰 Latest Updates</h2>
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
        <h2 class="mb-8 text-3xl font-bold">📞 Contact RS Events</h2>
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
import { computed, onMounted, onUnmounted, ref } from 'vue';
import api from '../api';

const isMobileMenuOpen = ref(false);
const activeSlide = ref(0);
const packagePricing = ref({
  pa_under_100: 130,
  pa_under_200: 200,
  pa_under_350: 250,
  decor_20: 180,
  decor_30: 220,
  decor_40: 280,
  decor_50: 300,
  media_roora_still: 120,
  media_roora_reel: 180,
  media_wedding_note: 'Coming soon',
  catering_per_plate: 2.5,
});
const heroSlides = [
  '/Img/img1.jpg',
  '/Img/img2.jpg',
  '/Img/img3.jpg',
  '/Img/img4.jpg'
];

let slideTimer = null;

const loadPackagePricing = async () => {
  try {
    const { data } = await api.get('/packages/public');
    packagePricing.value = { ...packagePricing.value, ...data };
  } catch (err) {
    console.error('Failed to load package pricing', err);
  }
};

const formatCurrency = (amount) => {
  return `$${Number(amount || 0).toFixed(2)}`;
};

const getPaPriceForPeople = (people) => {
  if (people < 100) return Number(packagePricing.value.pa_under_100 || 0);
  if (people < 200) return Number(packagePricing.value.pa_under_200 || 0);
  return Number(packagePricing.value.pa_under_350 || 0);
};

const getDecorPriceForPeople = (people) => {
  if (people <= 20) return Number(packagePricing.value.decor_20 || 0);
  if (people <= 30) return Number(packagePricing.value.decor_30 || 0);
  if (people <= 40) return Number(packagePricing.value.decor_40 || 0);
  return Number(packagePricing.value.decor_50 || 0);
};

const buildPackage = ({ name, people, mediaType = 'reel', mediaNote = '', description = '', cardClass = 'bg-white border-gray-200', titleClass = 'text-gray-900', totalClass = 'text-gray-900' }) => {
  const pa = getPaPriceForPeople(people);
  const decor = getDecorPriceForPeople(people);
  const media = mediaType === 'still'
    ? Number(packagePricing.value.media_roora_still || 0)
    : Number(packagePricing.value.media_roora_reel || 0);
  const catering = Number(packagePricing.value.catering_per_plate || 0) * people;
  const total = pa + decor + media + catering;

  return { name, people, pa, decor, media, catering, total, mediaNote, description, cardClass, titleClass, totalClass };
};

const landingPackages = computed(() => [
  buildPackage({
    name: 'Basic Roora Package',
    people: 20,
    mediaType: 'still',
    description: 'A beautiful starter setup for intimate lobola ceremonies with essential service coverage.',
    cardClass: 'bg-rose-50 border-rose-200',
    titleClass: 'text-rose-700',
    totalClass: 'text-rose-700'
  }),
  buildPackage({
    name: 'Roora Plus Package',
    people: 40,
    mediaType: 'reel',
    description: 'Balanced value and style for medium gatherings, with enhanced décor and media highlights.',
    cardClass: 'bg-amber-50 border-amber-200',
    titleClass: 'text-amber-700',
    totalClass: 'text-amber-700'
  }),
  buildPackage({
    name: 'Roora Premium',
    people: 50,
    mediaType: 'reel',
    description: 'A premium experience for larger roora events that need standout ambiance and coverage.',
    cardClass: 'bg-emerald-50 border-emerald-200',
    titleClass: 'text-emerald-700',
    totalClass: 'text-emerald-700'
  }),
  buildPackage({
    name: 'RooraWedding',
    people: 150,
    mediaType: 'reel',
    mediaNote: `Wedding media: ${packagePricing.value.media_wedding_note}`,
    description: 'Designed for big celebrations with robust PA, décor support, and full catering scale.',
    cardClass: 'bg-indigo-50 border-indigo-200',
    titleClass: 'text-indigo-700',
    totalClass: 'text-indigo-700'
  }),
]);

onMounted(() => {
  loadPackagePricing();

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
