<template>
  <div class="fixed inset-0 overflow-hidden pointer-events-none -z-10">
    <!-- Living Gradients -->
    <div
      class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-float opacity-60 dark:opacity-20">
    </div>
    <div
      class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 rounded-full blur-[120px] animate-float-delayed opacity-60 dark:opacity-20">
    </div>
    <div
      class="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px] animate-pulse-slow">
    </div>

    <!-- Grid Pattern Overlay -->
    <div
      class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-10 mix-blend-overlay">
    </div>
  </div>
</template>
