<template>
  <UiAppFrame type="card" :glass="true" class="h-64 relative overflow-hidden group p-0">
    <div class="absolute inset-0 bg-slate-900">
      <iframe src="https://maps.google.com/maps?q=Cotonou,Benin&hl=fr&z=14&output=embed"
        class="w-full h-full border-0 grayscale invert contrast-[0.8] opacity-60 group-hover:opacity-100 group-hover:grayscale-0 group-hover:invert-0 transition-all duration-700"
        allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade">
      </iframe>

      <!-- Location Pin Overlay (Static for visual flair) -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <span class="relative flex h-6 w-6">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span
            class="relative inline-flex rounded-full h-6 w-6 bg-primary border-4 border-WtB shadow-lg shadow-primary/50"></span>
        </span>
      </div>

      <div
        class="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-xl border border-white/10 text-[10px] text-white font-bold uppercase tracking-wider">
        <div class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
          Agence Cotonou, Bénin
        </div>
      </div>
    </div>
  </UiAppFrame>
</template>
