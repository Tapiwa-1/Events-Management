<template>
  <div class="bg-white dark:bg-gray-900 min-h-screen font-sans text-gray-900 dark:text-gray-100">
    <!-- Navigation -->
    <nav class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <router-link to="/" class="flex items-center space-x-3 rtl:space-x-reverse">
          <span class="self-center text-2xl font-bold whitespace-nowrap text-blue-700 dark:text-blue-500">RS Events</span>
        </router-link>
        <button @click="isMenuOpen = !isMenuOpen" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
          <span class="sr-only">Open main menu</span>
          <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
        </button>
        <div :class="{'hidden': !isMenuOpen, 'block': isMenuOpen}" class="w-full md:block md:w-auto" id="navbar-default">
          <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li><a href="#" class="block py-2 px-3 text-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500" aria-current="page">Home</a></li>
            <li><a href="#about" class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">About Us</a></li>
            <li><a href="#services" class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Services</a></li>
            <li><a href="#portfolio" class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Portfolio</a></li>
            <li><a href="#pricing" class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Pricing</a></li>
            <li><a href="#contact" class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Contact</a></li>
            <li class="md:hidden pt-4 border-t border-gray-200 dark:border-gray-700">
               <router-link to="/login" class="block py-2 px-3 text-blue-700 dark:text-blue-500">Log in</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative bg-white dark:bg-gray-900 overflow-hidden pt-16 pb-32">
      <div class="max-w-screen-xl px-4 mx-auto lg:flex lg:items-center">
        <div class="lg:w-1/2">
          <h1 class="text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl text-gray-900 dark:text-white mb-6">
            RS Events | <span class="text-blue-700 dark:text-blue-500">Where Every Moment Comes Alive</span>
          </h1>
          <p class="max-w-2xl mb-8 font-light text-gray-500 lg:mb-10 md:text-lg lg:text-xl dark:text-gray-400">
            Delivering exceptional events with professional sound, stunning décor, captivating media, and delicious catering — all crafted for unforgettable experiences.
          </p>
          <div class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <a href="#services" class="inline-flex items-center justify-center px-6 py-3.5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
              Discover Our Services
            </a>
            <a href="#contact" class="inline-flex items-center justify-center px-6 py-3.5 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
              Get a Quote
            </a>
          </div>
        </div>
        <div class="hidden lg:flex lg:w-1/2 justify-center items-center relative">
            <div class="w-96 h-96 bg-blue-600/10 rounded-full absolute blur-3xl animate-pulse"></div>
            <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800" alt="Event atmosphere" class="rounded-2xl shadow-2xl relative z-10 w-4/5 transform rotate-3 hover:rotate-0 transition duration-500">
        </div>
      </div>
    </section>

    <!-- About Us Section -->
    <section id="about" class="bg-gray-50 dark:bg-gray-800 py-24">
      <div class="max-w-screen-xl px-4 mx-auto">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">About RS Events</h2>
            <p class="text-lg text-gray-600 dark:text-gray-400 mb-6">
              RS Events is a leading full‑service event solutions provider based in Harare, Zimbabwe. We specialize in end‑to‑end support for events of all sizes — from intimate gatherings to large‑scale celebrations.
            </p>
            <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
              With years of experience in event planning, technical support, and creative execution, our mission is to deliver seamless, memorable experiences tailored to your vision. We combine technical excellence, creative flair, and professional service to bring your event to life.
            </p>
            <div class="grid grid-cols-2 gap-6">
              <div class="flex items-start">
                <div class="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg flex items-center justify-center mr-4">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                  <h4 class="font-bold dark:text-white">Client-First</h4>
                  <p class="text-sm text-gray-500">We listen, then deliver.</p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-lg flex items-center justify-center mr-4">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <div>
                  <h4 class="font-bold dark:text-white">Reliable</h4>
                  <p class="text-sm text-gray-500">Flawless implementation.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=400" alt="About event" class="rounded-xl shadow-lg">
            <img src="https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&q=80&w=400" alt="About décor" class="mt-8 rounded-xl shadow-lg">
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="py-24 bg-white dark:bg-gray-900">
      <div class="max-w-screen-xl px-4 mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Our Services</h2>
          <p class="text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
            Exceptional Event Experiences: Your Partner for Sound, Style, Media & Catering
          </p>
        </div>

        <div class="grid gap-12 md:grid-cols-2">
          <!-- Service 1: PA System Hire -->
          <div class="flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 transition hover:shadow-2xl">
            <div class="h-48 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=600" alt="PA System" class="w-full h-full object-cover">
            </div>
            <div class="p-8">
              <div class="flex items-center mb-4">
                <span class="text-3xl mr-4">🔊</span>
                <h3 class="text-2xl font-bold dark:text-white">PA System Hire</h3>
              </div>
              <p class="text-gray-600 dark:text-gray-400 mb-6">
                We provide industry‑grade audio solutions for events of all types — ensuring crisp, high‑impact sound.
              </p>
              <div class="mb-6">
                <h4 class="font-bold mb-3 dark:text-white uppercase text-xs tracking-wider">What We Provide:</h4>
                <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li class="flex items-center"><svg class="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L9 10.586l3.293-3.293a1 1 0 111.414 1.414z"></path></svg>Professional speaker systems</li>
                  <li class="flex items-center"><svg class="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L9 10.586l3.293-3.293a1 1 0 111.414 1.414z"></path></svg>Wireless & wired microphones</li>
                  <li class="flex items-center"><svg class="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L9 10.586l3.293-3.293a1 1 0 111.414 1.414z"></path></svg>DJ sound rigs & mixers</li>
                </ul>
              </div>
              <a href="#contact" class="inline-flex items-center font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-500">
                Learn More <span class="ml-2">➜</span>
              </a>
            </div>
          </div>

          <!-- Service 2: Décor & Styling -->
          <div class="flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 transition hover:shadow-2xl">
            <div class="h-48 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=600" alt="Décor" class="w-full h-full object-cover">
            </div>
            <div class="p-8">
              <div class="flex items-center mb-4">
                <span class="text-3xl mr-4">🎨</span>
                <h3 class="text-2xl font-bold dark:text-white">Décor & Styling</h3>
              </div>
              <p class="text-gray-600 dark:text-gray-400 mb-6">
                Transform your venue into a stunning environment that reflects your style and personality.
              </p>
              <div class="mb-6">
                <h4 class="font-bold mb-3 dark:text-white uppercase text-xs tracking-wider">Decor Capabilities:</h4>
                <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li class="flex items-center"><svg class="w-4 h-4 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L9 10.586l3.293-3.293a1 1 0 111.414 1.414z"></path></svg>Wedding & Themed décor</li>
                  <li class="flex items-center"><svg class="w-4 h-4 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L9 10.586l3.293-3.293a1 1 0 111.414 1.414z"></path></svg>Lighting & Ambiance design</li>
                  <li class="flex items-center"><svg class="w-4 h-4 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L9 10.586l3.293-3.293a1 1 0 111.414 1.414z"></path></svg>Table setups & Centerpieces</li>
                </ul>
              </div>
              <a href="#contact" class="inline-flex items-center font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-500">
                Create the Perfect Atmosphere <span class="ml-2">➜</span>
              </a>
            </div>
          </div>

          <!-- Service 3: Media & Production -->
          <div class="flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 transition hover:shadow-2xl">
            <div class="h-48 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=600" alt="Media" class="w-full h-full object-cover">
            </div>
            <div class="p-8">
              <div class="flex items-center mb-4">
                <span class="text-3xl mr-4">🎥</span>
                <h3 class="text-2xl font-bold dark:text-white">Media & Production</h3>
              </div>
              <p class="text-gray-600 dark:text-gray-400 mb-6">
                Capture and share the magic of your event with professional media and branding services.
              </p>
              <div class="mb-6">
                <h4 class="font-bold mb-3 dark:text-white uppercase text-xs tracking-wider">Media Services:</h4>
                <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li class="flex items-center"><svg class="w-4 h-4 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L9 10.586l3.293-3.293a1 1 0 111.414 1.414z"></path></svg>Photography & Videography</li>
                  <li class="flex items-center"><svg class="w-4 h-4 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L9 10.586l3.293-3.293a1 1 0 111.414 1.414z"></path></svg>Live streaming & Coverage</li>
                  <li class="flex items-center"><svg class="w-4 h-4 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L9 10.586l3.293-3.293a1 1 0 111.414 1.414z"></path></svg>Event Highlight reels</li>
                </ul>
              </div>
              <a href="#contact" class="inline-flex items-center font-semibold text-red-600 hover:text-red-700 dark:text-red-500">
                Explore Media Services <span class="ml-2">➜</span>
              </a>
            </div>
          </div>

          <!-- Service 4: Catering Solutions -->
          <div class="flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 transition hover:shadow-2xl">
            <div class="h-48 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=600" alt="Catering" class="w-full h-full object-cover">
            </div>
            <div class="p-8">
              <div class="flex items-center mb-4">
                <span class="text-3xl mr-4">🍽️</span>
                <h3 class="text-2xl font-bold dark:text-white">Catering Solutions</h3>
              </div>
              <p class="text-gray-600 dark:text-gray-400 mb-6">
                Delicious food and expert service that elevate every event, from intimate to large-scale.
              </p>
              <div class="mb-6">
                <h4 class="font-bold mb-3 dark:text-white uppercase text-xs tracking-wider">Catering Includes:</h4>
                <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li class="flex items-center"><svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L9 10.586l3.293-3.293a1 1 0 111.414 1.414z"></path></svg>Custom menus (Local & International)</li>
                  <li class="flex items-center"><svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L9 10.586l3.293-3.293a1 1 0 111.414 1.414z"></path></svg>Buffet & Plated services</li>
                  <li class="flex items-center"><svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L9 10.586l3.293-3.293a1 1 0 111.414 1.414z"></path></svg>Professional catering staff</li>
                </ul>
              </div>
              <a href="#contact" class="inline-flex items-center font-semibold text-green-600 hover:text-green-700 dark:text-green-500">
                View Catering Options <span class="ml-2">➜</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="bg-blue-700 dark:bg-blue-900 py-24 text-white">
      <div class="max-w-screen-xl px-4 mx-auto">
        <h2 class="text-3xl font-extrabold text-center mb-16">Why Choose RS Events</h2>
        <div class="grid md:grid-cols-3 gap-12 text-center">
          <div>
            <div class="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6 text-2xl">🤝</div>
            <h3 class="text-xl font-bold mb-4">All‑In‑One Partner</h3>
            <p class="text-blue-100">Delivering sound, style, media, and meals — no need for multiple vendors.</p>
          </div>
          <div>
            <div class="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6 text-2xl">👨‍💼</div>
            <h3 class="text-xl font-bold mb-4">Professional Team</h3>
            <p class="text-blue-100">Skilled staff across décor, audio tech, media, and catering.</p>
          </div>
          <div>
            <div class="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6 text-2xl">🛡️</div>
            <h3 class="text-xl font-bold mb-4">Quality & Reliability</h3>
            <p class="text-blue-100">High‑quality equipment and presentation with smooth execution.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Portfolio -->
    <section id="portfolio" class="py-24 bg-gray-50 dark:bg-gray-800">
      <div class="max-w-screen-xl px-4 mx-auto text-center">
        <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-12">Featured Portfolio</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="group relative overflow-hidden rounded-xl h-64">
            <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=400" alt="Wedding" class="w-full h-full object-cover transition transform group-hover:scale-110">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition">
              <span class="text-white font-semibold">Weddings</span>
            </div>
          </div>
          <div class="group relative overflow-hidden rounded-xl h-64">
            <img src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=400" alt="Corporate" class="w-full h-full object-cover transition transform group-hover:scale-110">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition">
              <span class="text-white font-semibold">Corporate Functions</span>
            </div>
          </div>
          <div class="group relative overflow-hidden rounded-xl h-64 md:mt-8">
            <img src="https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&q=80&w=400" alt="Concerts" class="w-full h-full object-cover transition transform group-hover:scale-110">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition">
              <span class="text-white font-semibold">Concerts & Live Events</span>
            </div>
          </div>
          <div class="group relative overflow-hidden rounded-xl h-64 md:mt-8">
            <img src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=400" alt="Church" class="w-full h-full object-cover transition transform group-hover:scale-110">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition">
              <span class="text-white font-semibold">Church Gatherings</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Packages & Pricing -->
    <section id="pricing" class="py-24 bg-white dark:bg-gray-900">
      <div class="max-w-screen-xl px-4 mx-auto">
        <h2 class="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-16">Packages & Pricing</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Starter -->
          <div class="p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
            <h3 class="text-xl font-bold mb-4 dark:text-white">Starter Package</h3>
            <div class="text-4xl font-extrabold mb-8 dark:text-white">Custom</div>
            <ul class="space-y-4 mb-8 flex-grow text-gray-600 dark:text-gray-400">
              <li class="flex items-center"><svg class="w-5 h-5 mr-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>PA system & microphones</li>
              <li class="flex items-center"><svg class="w-5 h-5 mr-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>Basic décor design</li>
              <li class="flex items-center"><svg class="w-5 h-5 mr-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>Photography coverage</li>
              <li class="flex items-center"><svg class="w-5 h-5 mr-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>Light buffet catering</li>
            </ul>
            <a href="#contact" class="w-full py-3 text-center rounded-lg border border-blue-700 text-blue-700 font-bold hover:bg-blue-50 transition">Select Plan</a>
          </div>
          <!-- Standard -->
          <div class="p-8 bg-blue-700 rounded-2xl shadow-xl flex flex-col text-white scale-105 z-10">
            <div class="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4 self-start">Most Popular</div>
            <h3 class="text-xl font-bold mb-4">Standard Package</h3>
            <div class="text-4xl font-extrabold mb-8 text-white">Custom</div>
            <ul class="space-y-4 mb-8 flex-grow text-blue-50">
              <li class="flex items-center"><svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>Advanced PA system</li>
              <li class="flex items-center"><svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>Themed décor</li>
              <li class="flex items-center"><svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>Full photography + videography</li>
              <li class="flex items-center"><svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>Buffet + beverage service</li>
            </ul>
            <a href="#contact" class="w-full py-3 text-center rounded-lg bg-white text-blue-700 font-bold hover:bg-gray-100 transition">Select Plan</a>
          </div>
          <!-- Premium -->
          <div class="p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
            <h3 class="text-xl font-bold mb-4 dark:text-white">Premium Package</h3>
            <div class="text-4xl font-extrabold mb-8 dark:text-white">Custom</div>
            <ul class="space-y-4 mb-8 flex-grow text-gray-600 dark:text-gray-400">
              <li class="flex items-center"><svg class="w-5 h-5 mr-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>Premium PA & lighting rig</li>
              <li class="flex items-center"><svg class="w-5 h-5 mr-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>Custom décor & staging</li>
              <li class="flex items-center"><svg class="w-5 h-5 mr-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>Full media production</li>
              <li class="flex items-center"><svg class="w-5 h-5 mr-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>Full catering + plated service</li>
            </ul>
            <a href="#contact" class="w-full py-3 text-center rounded-lg border border-blue-700 text-blue-700 font-bold hover:bg-blue-50 transition">Select Plan</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Client Testimonials -->
    <section class="py-24 bg-gray-50 dark:bg-gray-800">
      <div class="max-w-screen-xl px-4 mx-auto text-center">
        <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-16">Client Testimonials</h2>
        <div class="grid md:grid-cols-2 gap-12">
          <figure class="max-w-screen-md mx-auto">
              <svg class="h-12 mx-auto mb-3 text-gray-400 dark:text-gray-600" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 8.89543 14.017 10V13M10.017 21L10.017 18C10.017 16.8954 9.12157 16 8.01699 16H5.01699C4.46471 16 4.01699 15.5523 4.01699 15V9C4.01699 8.44772 4.46471 8 5.01699 8H8.01699C9.12157 8 10.017 8.89543 10.017 10V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <blockquote>
                  <p class="text-2xl font-medium text-gray-900 dark:text-white italic">“RS Events transformed our wedding — sound was perfect, décor looked amazing, and our guests are still talking about the food!”</p>
              </blockquote>
              <figcaption class="flex items-center justify-center mt-6 space-x-3">
                  <div class="flex items-center divide-x-2 divide-gray-500 dark:divide-gray-700">
                      <cite class="pr-3 font-medium text-gray-900 dark:text-white">Happy Client</cite>
                      <cite class="pl-3 text-sm text-gray-500 dark:text-gray-400">Wedding Client</cite>
                  </div>
              </figcaption>
          </figure>
          <figure class="max-w-screen-md mx-auto">
              <svg class="h-12 mx-auto mb-3 text-gray-400 dark:text-gray-600" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 8.89543 14.017 10V13M10.017 21L10.017 18C10.017 16.8954 9.12157 16 8.01699 16H5.01699C4.46471 16 4.01699 15.5523 4.01699 15V9C4.01699 8.44772 4.46471 8 5.01699 8H8.01699C9.12157 8 10.017 8.89543 10.017 10V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <blockquote>
                  <p class="text-2xl font-medium text-gray-900 dark:text-white italic">“Professional and reliable team. Every detail was handled excellently.”</p>
              </blockquote>
              <figcaption class="flex items-center justify-center mt-6 space-x-3">
                  <div class="flex items-center divide-x-2 divide-gray-500 dark:divide-gray-700">
                      <cite class="pr-3 font-medium text-gray-900 dark:text-white">Corporate Client</cite>
                      <cite class="pl-3 text-sm text-gray-500 dark:text-gray-400">Annual Summit</cite>
                  </div>
              </figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- FAQs Section -->
    <section id="faq" class="py-24 bg-white dark:bg-gray-900">
      <div class="max-w-screen-xl px-4 mx-auto">
        <h2 class="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-16">Frequently Asked Questions</h2>
        <div class="max-w-3xl mx-auto space-y-8">
          <div>
            <h3 class="text-xl font-bold dark:text-white mb-2">Do you serve outdoor events?</h3>
            <p class="text-gray-600 dark:text-gray-400">Yes — we handle indoor and outdoor events, with power backup and weather‑ready support.</p>
          </div>
          <div>
            <h3 class="text-xl font-bold dark:text-white mb-2">Can I customize the décor theme?</h3>
            <p class="text-gray-600 dark:text-gray-400">Absolutely — we tailor décor themes to every client’s vision.</p>
          </div>
          <div>
            <h3 class="text-xl font-bold dark:text-white mb-2">Do you provide event planning support?</h3>
            <p class="text-gray-600 dark:text-gray-400">Yes — ask about our full event coordination services.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Us -->
    <section id="contact" class="py-24 bg-gray-50 dark:bg-gray-800">
      <div class="max-w-screen-xl px-4 mx-auto">
        <div class="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">Contact Us</h2>
            <div class="space-y-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center mr-4">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </div>
                <div>
                  <h4 class="font-bold dark:text-white">Phone</h4>
                  <p class="text-gray-600 dark:text-gray-400">[Your Phone Number]</p>
                </div>
              </div>
              <div class="flex items-center">
                <div class="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full flex items-center justify-center mr-4">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <div>
                  <h4 class="font-bold dark:text-white">Email</h4>
                  <p class="text-gray-600 dark:text-gray-400">[Your Business Email]</p>
                </div>
              </div>
              <div class="flex items-center">
                <div class="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full flex items-center justify-center mr-4">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <div>
                  <h4 class="font-bold dark:text-white">Location</h4>
                  <p class="text-gray-600 dark:text-gray-400">Harare, Zimbabwe</p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
             <h3 class="text-2xl font-bold mb-6 dark:text-white">Request a Quote</h3>
             <form @submit.prevent class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1 dark:text-gray-300">Name</label>
                    <input type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1 dark:text-gray-300">Email</label>
                    <input type="email" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1 dark:text-gray-300">Message</label>
                    <textarea rows="4" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"></textarea>
                </div>
                <button type="submit" class="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg transition">Send Message</button>
             </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-screen-xl px-4 mx-auto grid md:grid-cols-4 gap-8">
        <div>
          <span class="text-2xl font-bold text-blue-500">RS Events</span>
          <p class="mt-4 text-gray-400 text-sm">Delivering unforgettable moments and exceptional event experiences since inception.</p>
        </div>
        <div>
          <h4 class="font-bold mb-4">Navigation</h4>
          <ul class="space-y-2 text-gray-400 text-sm">
            <li><a href="#" class="hover:text-white transition">Home</a></li>
            <li><a href="#about" class="hover:text-white transition">About Us</a></li>
            <li><a href="#services" class="hover:text-white transition">Services</a></li>
            <li><a href="#portfolio" class="hover:text-white transition">Portfolio</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold mb-4">Support</h4>
          <ul class="space-y-2 text-gray-400 text-sm">
            <li><a href="#faq" class="hover:text-white transition">FAQs</a></li>
            <li><a href="#contact" class="hover:text-white transition">Contact</a></li>
            <li><router-link to="/login" class="hover:text-white transition">Staff Portal</router-link></li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold mb-4">Legal</h4>
          <ul class="space-y-2 text-gray-400 text-sm">
            <li><a href="#" class="hover:text-white transition">Terms of Service</a></li>
            <li><a href="#" class="hover:text-white transition">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
      <div class="max-w-screen-xl px-4 mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-xs">
        © 2024 RS Events. All Rights Reserved. Harare, Zimbabwe.
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isMenuOpen = ref(false);
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>
