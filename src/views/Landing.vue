<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
    <header class="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-gray-700 dark:bg-gray-900/95">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <p class="text-xl font-bold">RS Events — Exceptional Event Experiences</p>
          <p class="text-sm text-gray-600 dark:text-gray-300">Your Partner for Sound, Style, Media &amp; Catering</p>
        </div>
        <nav class="hidden gap-4 text-sm md:flex">
          <a href="#home" class="hover:text-blue-600">Home</a>
          <a href="#about" class="hover:text-blue-600">About Us</a>
          <a href="#services" class="hover:text-blue-600">Services</a>
          <a href="#portfolio" class="hover:text-blue-600">Portfolio</a>
          <a href="#packages" class="hover:text-blue-600">Packages &amp; Pricing</a>
          <a href="#faqs" class="hover:text-blue-600">FAQs</a>
          <a href="#contact" class="hover:text-blue-600">Contact</a>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-7xl space-y-16 px-6 py-10">
      <section id="home" class="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-10 text-white shadow-lg">
        <p class="text-sm uppercase tracking-[0.2em]">RS Events</p>
        <h1 class="mt-3 text-4xl font-extrabold leading-tight md:text-5xl">Where Every Moment Comes Alive</h1>
        <p class="mt-5 max-w-3xl text-lg text-blue-100">
          Delivering exceptional events with professional sound, stunning décor, captivating media, and delicious catering — all crafted for unforgettable experiences.
        </p>
        <div class="mt-8 flex flex-wrap gap-4">
          <a href="#services" class="rounded-lg bg-white px-5 py-3 font-semibold text-blue-700">Discover Our Services</a>
          <a href="#contact" class="rounded-lg border border-blue-200 px-5 py-3 font-semibold text-white">Get a Quote</a>
          <router-link to="/admin" class="rounded-lg border border-blue-200 px-5 py-3 font-semibold text-white">Admin Dashboard</router-link>
        </div>
      </section>

      <section id="about" class="space-y-5">
        <h2 class="text-3xl font-bold">About RS Events</h2>
        <p class="leading-7 text-gray-700 dark:text-gray-300">
          RS Events is a leading full-service event solutions provider based in Harare, Zimbabwe. We specialize in end-to-end support for events of all sizes — from intimate gatherings to large-scale celebrations.
        </p>
        <p class="leading-7 text-gray-700 dark:text-gray-300">
          With years of experience in event planning, technical support, and creative execution, our mission is to deliver seamless, memorable experiences tailored to your vision. We combine technical excellence, creative flair, and professional service to bring your event to life.
        </p>
        <h3 class="pt-2 text-xl font-semibold">Our Approach</h3>
        <ul class="list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">
          <li><strong>Client-First Focus:</strong> We listen first, then deliver solutions built around your needs.</li>
          <li><strong>Reliable Execution:</strong> Professional planning and flawless implementation.</li>
          <li><strong>Creative Design:</strong> Unique styling that matches your personality and event goals.</li>
          <li><strong>Memorable Moments:</strong> Experiences your guests will remember.</li>
        </ul>
      </section>

      <section id="services" class="space-y-6">
        <h2 class="text-3xl font-bold">Our Services</h2>
        <div class="grid gap-6 md:grid-cols-2">
          <article class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 class="text-xl font-semibold">🔊 PA System Hire</h3>
            <p class="mt-2 text-gray-700 dark:text-gray-300">Industry-grade audio solutions for events of all types — ensuring crisp, high-impact sound.</p>
            <ul class="mt-3 list-disc space-y-1 pl-6 text-gray-700 dark:text-gray-300">
              <li>Professional speaker systems</li>
              <li>Wireless &amp; wired microphones</li>
              <li>DJ sound rigs</li>
              <li>Mixers &amp; sound engineers</li>
              <li>On-site setup &amp; tech support</li>
            </ul>
            <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">Perfect for weddings, corporate events, concerts, church gatherings, and live performances.</p>
            <a href="#contact" class="mt-3 inline-block font-semibold text-blue-600">Learn More ➜</a>
          </article>

          <article class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 class="text-xl font-semibold">🎨 Décor &amp; Styling</h3>
            <p class="mt-2 text-gray-700 dark:text-gray-300">Transform your venue into a stunning environment that reflects your style.</p>
            <ul class="mt-3 list-disc space-y-1 pl-6 text-gray-700 dark:text-gray-300">
              <li>Themed décor &amp; props</li>
              <li>Wedding décor &amp; floral arrangements</li>
              <li>Lighting &amp; ambiance design</li>
              <li>Table setups, linens, draping, and centerpieces</li>
              <li>Backdrops &amp; stage décor</li>
            </ul>
            <a href="#contact" class="mt-3 inline-block font-semibold text-blue-600">Create the Perfect Atmosphere ➜</a>
          </article>

          <article class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 class="text-xl font-semibold">🎥 Media &amp; Production</h3>
            <p class="mt-2 text-gray-700 dark:text-gray-300">Capture and share the magic of your event with professional media services.</p>
            <ul class="mt-3 list-disc space-y-1 pl-6 text-gray-700 dark:text-gray-300">
              <li>Photography &amp; videography</li>
              <li>Event highlight reels</li>
              <li>Live streaming &amp; multi-cam coverage</li>
              <li>Social media content packages</li>
              <li>Event branding visuals</li>
            </ul>
            <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">Whether for memories or marketing, we cover it beautifully.</p>
            <a href="#contact" class="mt-3 inline-block font-semibold text-blue-600">Explore Media Services ➜</a>
          </article>

          <article class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 class="text-xl font-semibold">🍽️ Catering Solutions</h3>
            <p class="mt-2 text-gray-700 dark:text-gray-300">Delicious food and expert service that elevate every event.</p>
            <ul class="mt-3 list-disc space-y-1 pl-6 text-gray-700 dark:text-gray-300">
              <li>Custom menus (local &amp; international)</li>
              <li>Buffet &amp; plated services</li>
              <li>Professional catering staff</li>
              <li>Beverages &amp; table presentation</li>
              <li>Dietary options available</li>
            </ul>
            <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">We tailor menus to your preferences and guest needs.</p>
            <a href="#contact" class="mt-3 inline-block font-semibold text-blue-600">View Catering Options ➜</a>
          </article>
        </div>
      </section>

      <section class="space-y-4">
        <h2 class="text-3xl font-bold">Why Choose RS Events</h2>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div class="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"><h3 class="font-semibold">All-In-One Event Partner</h3><p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Delivering sound, style, media, and meals — no need for multiple vendors.</p></div>
          <div class="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"><h3 class="font-semibold">Experienced &amp; Professional Team</h3><p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Skilled staff across décor, audio tech, media, and catering.</p></div>
          <div class="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"><h3 class="font-semibold">Quality Equipment &amp; Presentation</h3><p class="mt-2 text-sm text-gray-600 dark:text-gray-400">High-quality PA systems, décor elements, and culinary offerings.</p></div>
          <div class="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"><h3 class="font-semibold">Personalized Service</h3><p class="mt-2 text-sm text-gray-600 dark:text-gray-400">We work with you from planning to execution — smoothly and stress-free.</p></div>
          <div class="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"><h3 class="font-semibold">Transparent Pricing</h3><p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Clear packages — no hidden costs.</p></div>
        </div>
      </section>

      <section id="portfolio" class="space-y-4">
        <h2 class="text-3xl font-bold">Featured Portfolio</h2>
        <p class="text-gray-700 dark:text-gray-300">A carousel of images showing past events with sound setups, décor designs, catering spreads, and media highlights.</p>
        <p class="text-sm text-gray-600 dark:text-gray-400">Examples include weddings, corporate functions, concerts, and church events.</p>
      </section>

      <section id="packages" class="space-y-6">
        <h2 class="text-3xl font-bold">Packages &amp; Pricing</h2>
        <div class="grid gap-6 md:grid-cols-3">
          <div class="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"><h3 class="text-xl font-semibold">Starter Package</h3><ul class="mt-3 list-disc space-y-1 pl-5 text-sm"><li>PA system &amp; microphones</li><li>Basic décor design</li><li>Photography coverage</li><li>Light buffet catering</li></ul></div>
          <div class="rounded-xl border-2 border-blue-600 bg-white p-6 dark:bg-gray-800"><h3 class="text-xl font-semibold">Standard Package</h3><ul class="mt-3 list-disc space-y-1 pl-5 text-sm"><li>Advanced PA system</li><li>Themed décor</li><li>Full photography + videography</li><li>Buffet + beverage service</li></ul></div>
          <div class="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"><h3 class="text-xl font-semibold">Premium Package</h3><ul class="mt-3 list-disc space-y-1 pl-5 text-sm"><li>Premium PA &amp; lighting rig</li><li>Custom décor &amp; staging</li><li>Full media production</li><li>Full catering + plated service</li></ul></div>
        </div>
        <p class="text-gray-700 dark:text-gray-300">Contact us for customized packages.</p>
      </section>

      <section class="space-y-4">
        <h2 class="text-3xl font-bold">Client Testimonials</h2>
        <blockquote class="rounded-lg border-l-4 border-blue-600 bg-white p-5 dark:bg-gray-800">“RS Events transformed our wedding — sound was perfect, décor looked amazing, and our guests are still talking about the food!” — Happy Client</blockquote>
        <blockquote class="rounded-lg border-l-4 border-blue-600 bg-white p-5 dark:bg-gray-800">“Professional and reliable team. Every detail was handled excellently.” — Corporate Client</blockquote>
      </section>

      <section id="faqs" class="space-y-4">
        <h2 class="text-3xl font-bold">Frequently Asked Questions</h2>
        <div class="space-y-3 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <p><strong>Do you serve outdoor events?</strong><br>Yes — we handle indoor and outdoor events, with power backup and weather-ready support.</p>
          <p><strong>Can I customize the décor theme?</strong><br>Absolutely — we tailor décor themes to every client’s vision.</p>
          <p><strong>Do you provide event planning support?</strong><br>Yes — ask about our full event coordination services.</p>
        </div>
      </section>

      <section id="contact" class="rounded-2xl bg-blue-50 p-8 dark:bg-blue-950/40">
        <h2 class="text-3xl font-bold">Contact Us</h2>
        <div class="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
          <p>📞 Phone: [Your Phone Number]</p>
          <p>📧 Email: [Your Business Email]</p>
          <p>📍 Location: Harare, Zimbabwe</p>
        </div>
        <a href="#" class="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white">Request a Quote ➜ Contact Form</a>
      </section>
    </main>

    <footer class="border-t border-gray-200 bg-white py-8 dark:border-gray-700 dark:bg-gray-900">
      <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 text-sm text-gray-600 dark:text-gray-300">
        <div class="flex flex-wrap gap-4">
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#faqs">FAQs</a>
          <a href="#contact">Contact</a>
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
        </div>
        <p>RS Events — Delivering unforgettable moments.</p>
      </div>
    </footer>
  </div>
</template>
