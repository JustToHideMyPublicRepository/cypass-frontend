<template>
  <UiAppFrame type="card" :glass="true" class="h-64 relative overflow-hidden group">
    <div class="absolute inset-0 bg-slate-900">
      <!-- Grid Map Effect -->
      <div class="absolute inset-0 opacity-20"
        style="background-image: radial-gradient(#3b82f6 1px, transparent 1px); background-size: 20px 20px;">
      </div>

      <!-- Radar Sweep -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent w-full h-full animate-[spin_4s_linear_infinite] opacity-30">
      </div>

      <!-- Location Pin -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <span class="relative flex h-6 w-6">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span class="relative inline-flex rounded-full h-6 w-6 bg-primary border-4 border-WtB"></span>
        </span>
      </div>

      <div
        class="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur px-3 py-1 rounded-lg border border-slate-700 text-xs text-white">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Systèmes Opérationnels
        </div>
      </div>
    </div>
  </UiAppFrame>
</template>
