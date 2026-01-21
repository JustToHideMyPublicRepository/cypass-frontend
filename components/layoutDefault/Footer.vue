<template>
  <footer class="py-6 px-4 sm:px-6 lg:px-8 border-t border-ash bg-WtB/50">
    <div class="flex flex-col md:flex-row justify-between items-center gap-4">
      <div class="flex items-center gap-6">
        <p class="text-xs text-hsa">
          &copy; {{ new Date().getFullYear() }} CYPASS. Infrastructure Nationale de Confiance.
        </p>
      </div>

      <nav class="flex items-center gap-6">
        <NuxtLink v-for="link in footerLinks" :key="link.path" :to="link.path"
          class="text-xs text-hsa hover:text-primary transition-colors">
          {{ link.label }}
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-2 opacity-60">
        <span class="text-[9px] font-bold tracking-widest text-hsa uppercase">République du Bénin</span>
        <img src="https://flagcdn.com/w40/bj.png" alt="BJ" class="h-3 rounded-sm" />
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
