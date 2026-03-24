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
        <h1 class="text-4xl font-extrabold tracking-wide text-white md:text-6xl">RS Events</h1>
        <p class="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-yellow-300">Zimbabwe's trusted event partner</p>
        <p class="mt-4 text-lg text-white md:text-2xl">World-class event infrastructure, décor, media production, and catering for celebrations of every size.</p>
        <div class="mt-6 flex flex-wrap justify-center gap-4">
          <a href="#services" class="rounded bg-yellow-400 px-6 py-3 text-gray-900 hover:bg-yellow-500">Explore Our Services</a>
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
        <p class="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-yellow-600">Explore Our Services</p>
        <h2 class="mb-4 text-3xl font-bold">🛠️ Event Solutions Built For Every Occasion</h2>
        <p class="mx-auto mb-12 max-w-3xl text-gray-700">From intimate roora ceremonies to large weddings and corporate functions, we deliver dependable equipment, creative styling, and professional execution.</p>
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="service in services"
            :key="service.title"
            class="overflow-hidden rounded bg-white shadow transition hover:-translate-y-1 hover:shadow-lg"
          >
            <img :src="service.image" :alt="service.title" class="h-40 w-full object-cover" />
            <div class="p-6 text-left">
              <h3 class="mb-2 text-xl font-bold">{{ service.title }}</h3>
              <p class="text-gray-700">{{ service.description }}</p>
              <a href="#contact" class="mt-4 inline-block text-sm font-semibold text-yellow-700 hover:text-yellow-800">Learn More →</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Experience Highlight -->
    <section class="bg-white py-16">
      <div class="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-2 md:items-center">
        <div>
          <p class="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-yellow-600">Why choose RS Events</p>
          <h2 class="mb-4 text-3xl font-bold">Passionately creating memorable events across Zimbabwe</h2>
          <p class="mb-4 text-gray-700">
            We combine professional planning, reliable event infrastructure, and a can-do team to make every event smooth, elegant, and unforgettable.
          </p>
          <p class="text-gray-700">
            Whether it's a private function, roora ceremony, wedding, or corporate activation, RS Events helps bring your vision to life with confidence.
          </p>
        </div>
        <div class="overflow-hidden rounded-xl shadow-lg">
          <img src="/Img/img2.jpg" alt="RS Events setup showcase" class="h-full w-full object-cover" />
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

    <!-- WhatsApp Chatbot Simulation -->
    <section id="chatbot" class="bg-gray-900 py-20 text-white">
      <div class="mx-auto max-w-5xl px-4">
        <p class="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-green-400">WhatsApp Assistant Demo</p>
        <h2 class="mb-4 text-3xl font-bold">Simulate Chatbot Pricing Replies</h2>
        <p class="mb-8 text-gray-300">Select a package option (1-15), then follow prompts for décor people and food plates. The bot will calculate your final price instantly.</p>
        <div class="mb-6 rounded-lg border border-gray-700 bg-gray-800/60 p-4">
          <p class="mb-2 text-sm font-semibold text-green-300">Available Options (Vertical View)</p>
          <ol class="grid gap-1 text-sm text-gray-200">
            <li v-for="item in botOptions" :key="item.id">{{ item.id }}. {{ item.label }}</li>
          </ol>
        </div>

        <div class="rounded-xl border border-gray-700 bg-black/60 p-4 shadow-xl">
          <div class="mb-3 flex items-center gap-2 border-b border-gray-700 pb-3 text-sm text-gray-400">
            <span class="inline-block h-3 w-3 rounded-full bg-red-400"></span>
            <span class="inline-block h-3 w-3 rounded-full bg-yellow-400"></span>
            <span class="inline-block h-3 w-3 rounded-full bg-green-400"></span>
            <span class="ml-2">whatsapp_bot.cmd</span>
          </div>

          <div class="mb-4 max-h-80 space-y-2 overflow-y-auto pr-2">
            <p v-for="(line, idx) in botMessages" :key="idx" class="font-mono text-sm" :class="line.role === 'bot' ? 'text-green-300' : 'text-blue-300'">
              <span>{{ line.role === 'bot' ? 'bot>' : 'you>' }}</span>
              {{ line.text }}
            </p>
          </div>

          <form class="flex flex-col gap-3 sm:flex-row" @submit.prevent="runBotCommand">
            <input
              v-model="botInput"
              type="text"
              placeholder="Type command... e.g. people 80"
              class="w-full rounded border border-gray-600 bg-gray-900 px-4 py-2 text-sm text-white focus:border-green-400 focus:outline-none"
            />
            <button type="submit" class="rounded bg-green-500 px-5 py-2 text-sm font-semibold text-gray-900 hover:bg-green-400">
              Send
            </button>
          </form>
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

const services = [
  {
    title: '🔊 PA System Hire',
    image: '/Img/img1.jpg',
    description: 'Crystal-clear sound systems, microphones, mixers, and expert setup for ceremonies, receptions, and corporate events.',
  },
  {
    title: '🎨 Décor & Styling',
    image: '/Img/img2.jpg',
    description: 'Elegant themed styling, stage décor, centerpieces, backdrops, and lighting design tailored to your event vision.',
  },
  {
    title: '🎥 Media & Production',
    image: '/Img/img3.jpg',
    description: 'Professional photography, videography, highlight reels, and content production to preserve every key moment.',
  },
  {
    title: '🍽️ Catering',
    image: '/Img/img4.jpg',
    description: 'Delicious menu options, buffet or plated service, and attentive staff to give your guests a memorable dining experience.',
  },
];

const botInput = ref('');
const botState = ref({
  step: 'await_option',
  option: null,
  decorPeople: null,
  plates: null,
});

const botOptions = [
  { id: 1, label: 'Decor, PA System, Media, Catering' },
  { id: 2, label: 'Decor, PA System, Media' },
  { id: 3, label: 'Decor, PA System, Catering' },
  { id: 4, label: 'Decor, Media, Catering' },
  { id: 5, label: 'PA System, Media, Catering' },
  { id: 6, label: 'Decor, PA System' },
  { id: 7, label: 'Decor, Media' },
  { id: 8, label: 'Decor, Catering' },
  { id: 9, label: 'PA System, Media' },
  { id: 10, label: 'PA System, Catering' },
  { id: 11, label: 'Media, Catering' },
  { id: 12, label: 'Decor' },
  { id: 13, label: 'PA System' },
  { id: 14, label: 'Media' },
  { id: 15, label: 'Catering' },
];

const OPTION_MAP = Object.fromEntries(botOptions.map((item) => {
  const services = item.label
    .toLowerCase()
    .replace('pa system', 'pa')
    .split(',')
    .map((s) => s.trim())
    .map((s) => (s === 'catering' ? 'catering' : s));

  const normalized = services.map((s) => {
    if (s === 'decor') return 'decor';
    if (s === 'pa') return 'pa';
    if (s === 'media') return 'media';
    if (s === 'catering') return 'catering';
    return s;
  });

  return [item.id, normalized];
}));

const botMessages = ref([
  { role: 'bot', text: 'Greetings, how are you? 👋' },
  { role: 'bot', text: 'You can customize your own package here.' },
  { role: 'bot', text: 'Please select an option number from 1 to 15 (shown vertically above).' },
]);

const getMediaPrice = () => Number(packagePricing.value.media_roora_reel || 0);

const sendBotMessage = (text) => {
  botMessages.value.push({ role: 'bot', text });
};

const runBotCommand = () => {
  const raw = botInput.value.trim();
  if (!raw) return;

  botMessages.value.push({ role: 'user', text: raw });

  if (raw.toLowerCase() === 'help') {
    sendBotMessage('Type option number 1-15. If you want to restart, type restart.');
    botInput.value = '';
    return;
  }

  if (raw.toLowerCase() === 'restart') {
    botState.value = { step: 'await_option', option: null, decorPeople: null, plates: null };
    sendBotMessage('Session restarted. Please select option 1-15.');
    botInput.value = '';
    return;
  }

  if (botState.value.step === 'await_option') {
    const option = Number(raw);
    const services = OPTION_MAP[option];

    if (!services) {
      sendBotMessage('Invalid option. Please select a number from 1 to 15.');
      botInput.value = '';
      return;
    }

    botState.value.option = option;
    botState.value.decorPeople = null;
    botState.value.plates = null;

    if (services.includes('decor') || services.includes('pa')) {
      botState.value.step = 'await_decor_people';
      sendBotMessage('Please enter number of people decor.');
    } else if (services.includes('catering')) {
      botState.value.step = 'await_plates';
      sendBotMessage('Please enter number of people food plates.');
    } else {
      const total = services.includes('media') ? getMediaPrice() : 0;
      sendBotMessage(`Total Amount for option ${option} is ${formatCurrency(total)}.`);
      botState.value.step = 'await_option';
      sendBotMessage('You can select another option (1-15).');
    }

    botInput.value = '';
    return;
  }

  if (botState.value.step === 'await_decor_people') {
    const people = Number(raw);
    if (!Number.isFinite(people) || people <= 0) {
      sendBotMessage('Please enter a valid number of people for decor.');
      botInput.value = '';
      return;
    }

    botState.value.decorPeople = people;
    const services = OPTION_MAP[botState.value.option] || [];

    if (services.includes('catering')) {
      botState.value.step = 'await_plates';
      sendBotMessage('Please enter number of people food plates.');
    } else {
      const decor = services.includes('decor') ? getDecorPriceForPeople(people) : 0;
      const pa = services.includes('pa') ? getPaPriceForPeople(people) : 0;
      const media = services.includes('media') ? getMediaPrice() : 0;
      const total = decor + pa + media;
      sendBotMessage(`Total Amount is ${formatCurrency(total)} (Decor ${formatCurrency(decor)}, PA ${formatCurrency(pa)}, Media ${formatCurrency(media)}).`);
      botState.value.step = 'await_option';
      sendBotMessage('You can select another option (1-15).');
    }

    botInput.value = '';
    return;
  }

  if (botState.value.step === 'await_plates') {
    const plates = Number(raw);
    if (!Number.isFinite(plates) || plates <= 0) {
      sendBotMessage('Please enter a valid number of food plates.');
      botInput.value = '';
      return;
    }

    botState.value.plates = plates;
    const services = OPTION_MAP[botState.value.option] || [];
    const people = botState.value.decorPeople || plates;

    const decor = services.includes('decor') ? getDecorPriceForPeople(people) : 0;
    const pa = services.includes('pa') ? getPaPriceForPeople(people) : 0;
    const media = services.includes('media') ? getMediaPrice() : 0;
    const catering = services.includes('catering') ? Number(packagePricing.value.catering_per_plate || 0) * plates : 0;
    const total = decor + pa + media + catering;

    sendBotMessage(`Total Amount is ${formatCurrency(total)} (Decor ${formatCurrency(decor)}, PA ${formatCurrency(pa)}, Media ${formatCurrency(media)}, Catering ${formatCurrency(catering)}).`);
    botState.value.step = 'await_option';
    sendBotMessage('You can select another option (1-15).');
    botInput.value = '';
    return;
  }

  botInput.value = '';
};

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
