<template>
  <div class="space-y-6">
    <MeSettingsHeader />

    <!-- Theme Settings -->
    <MeSettingsAppearance />

    <!-- Notifications -->
    <MeSettingsNotifications />

    <!-- Shortcuts Settings -->
    <MeSettingsShortcuts />

    <!-- Vigitech Settings -->
    <MeSettingsVigitech />

    <!-- Language & Region -->
    <MeSettingsRegion />

    <!-- Danger Zone -->
    <MeSettingsDanger />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Paramètres'
})
</script>
