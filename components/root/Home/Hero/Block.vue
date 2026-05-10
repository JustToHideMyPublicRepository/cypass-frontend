<template>
  <section class="relative py-8 overflow-hidden lg:overflow-visible">
    <div
      class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20viewBox=%220%200%20200%20200%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter%20id=%22noise%22%3E%3CfeTurbulence%20type=%22fractalNoise%22%20baseFrequency=%220.9%22%20numOctaves=%222%22%20stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect%20width=%22100%25%22%20height=%22100%25%22%20filter=%22url(%23noise)%22/%3E%3C/svg%3E')] opacity-[0.03] mix-blend-overlay pointer-events-none z-0">
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid lg:grid-cols-5 gap-6 items-center">
        <RootHomeHeroContent />
        <RootHomeHeroVisual />
      </div>
    </div>
  </section>
</template>
