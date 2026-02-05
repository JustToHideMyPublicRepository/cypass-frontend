<template>
  <div class="perspective-1000 p-4 md:p-8">
    <div class="absolute inset-0 bg-gradient-to-tr opacity-20 blur-3xl rounded-full -z-10"
      :class="service.theme === 'blue' ? 'from-blue-500 to-indigo-500' : 'from-green-500 to-emerald-500'">
    </div>

    <!-- VISUEL: SECUSCAN (Terminal) -->
    <RootModuleDetailVisualSecuScan v-if="service.id === 'secuscan'" />

    <!-- VISUEL: VIGITECH (Radar) -->
    <RootModuleDetailVisualVigiTech v-else-if="service.id === 'vigitech'" />

    <!-- VISUEL: DOCSENTRY (Certificat) -->
    <RootModuleDetailVisualDocSentry v-else-if="service.id === 'docsentry'" />

    <!-- VISUEL: LEAKMONITOR (Explorateur) -->
    <RootModuleDetailVisualLeakMonitor v-else />
  </div>
</template>

<script setup lang="ts">

defineProps<{
  service: any
}>()
</script>
