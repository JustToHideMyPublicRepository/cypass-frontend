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
import { onMounted } from 'vue'
import { useSettingsPrefStore } from '~/stores/settingsPref'

const settingsPref = useSettingsPrefStore()

onMounted(() => {
  settingsPref.loadFromLocalStorage()
})

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Paramètres'
})
</script>
