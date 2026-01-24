<template>
  <div class="space-y-6">
    <MeSettingsHeader />

    <!-- Theme Settings -->
    <MeSettingsAppearance />

    <!-- Notifications -->
    <MeSettingsNotifications :settings="notificationSettings" />

    <!-- Shortcuts Settings -->
    <MeSettingsShortcuts />

    <!-- Language & Region -->
    <MeSettingsRegion />

    <!-- Danger Zone -->
    <MeSettingsDanger />
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useHead({
  title: 'Paramètres'
})

const notificationSettings = reactive([
  {
    title: 'Alertes de sécurité critiques',
    desc: 'Recevoir une alerte immédiate en cas de faille détectée.',
    enabled: true
  },
  {
    title: 'Mises à jour de DocSentry',
    desc: 'Notifications lors de la validation d\'un document.',
    enabled: true
  },
  {
    title: 'Newsletter VigiTech',
    desc: 'Résumé hebdomadaire des menaces cybernétiques.',
    enabled: false
  },
])
</script>
