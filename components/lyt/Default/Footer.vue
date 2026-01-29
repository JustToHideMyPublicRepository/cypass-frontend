<template>
  <footer class="py-6 px-4 sm:px-6 lg:px-8 border-t border-ash bg-WtB/50">
    <div class="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">
      <div class="flex items-center text-center md:text-left order-2 md:order-1">
        <p class="text-xs text-hsa leading-relaxed">
          &copy; {{ new Date().getFullYear() }} CYPASS. Infrastructure Nationale de Confiance.
        </p>
      </div>

      <nav class="grid grid-cols-2 md:flex items-center gap-x-8 gap-y-2 order-1 md:order-2">
        <NuxtLink v-for="link in footerLinks" :key="link.path" :to="link.path"
          class="text-xs text-hsa hover:text-primary transition-colors whitespace-nowrap text-center md:text-left">
          {{ link.label }}
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-2 opacity-60 order-3">
        <span class="text-[10px] font-bold tracking-widest text-hsa uppercase">République du Bénin</span>
        <img src="https://flagcdn.com/w40/bj.png" alt="BJ" class="h-3.5 rounded-sm shadow-sm" />
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const footerLinks = [
  { label: 'Centre d\'aide', path: '/support' },
  { label: 'Mentions Légales', path: '/legal/mentions' },
  { label: 'Confidentialité', path: '/legal/privacy' },
  { label: 'CGU', path: '/legal/terms' }
]
</script>
