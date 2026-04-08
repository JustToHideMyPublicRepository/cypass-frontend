<template>
  <UiBaseCard class="!rounded-[2rem]">
    <!-- Custom Header for Collapse/Expand -->
    <template #header>
      <div class="flex-1 flex items-center justify-between cursor-pointer group"
        @click="settingsStore.toggleSection('newsletter')">
        <h3 class="text-xl font-black text-BtW tracking-tight uppercase">Newsletter</h3>
        <button class="p-2 rounded-full hover:bg-ash transition-colors text-hsa group-hover:text-primary">
          <IconChevronDown class="w-5 h-5 transition-transform duration-300"
            :class="{ '-rotate-180': settingsStore.display.newsletter }" />
        </button>
      </div>
    </template>

    <!-- Collapsible Content -->
    <div v-show="settingsStore.display.newsletter" class="space-y-6 animate-fade-in">
      <!-- Liste des différents types de newsletters paramétrables -->
      <div v-for="(setting, index) in settingsList" :key="index"
        class="flex items-center justify-between gap-4 p-5 rounded-[2rem] bg-ash/20 border border-ashAct/30 transition-all hover:bg-ash/40 group/setting shadow-inner">
        <div class="flex-1">
          <!-- Nom du réglage -->
          <h4 class="font-black text-BtW text-sm uppercase tracking-tight">{{ setting.title }}</h4>
          <!-- Description -->
          <p class="text-[11px] text-hsa leading-tight mt-1 font-medium opacity-70">{{ setting.desc }}</p>
        </div>

        <!-- Interrupteur -->
        <div class="flex items-center gap-3">
          <template v-if="profilStore.loading && !profilStore.profile?.newsletter_settings && !loadingKey">
            <UiAppSkeleton type="text" width="40px" height="24px" class="rounded-2xl" />
          </template>
          <template v-else>
            <UiLogoLoader v-if="loadingKey === setting.key" size="xs" />
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" :checked="setting.enabled" @change="toggleSetting(setting.key, !setting.enabled)"
                class="sr-only peer" :disabled="loadingKey === setting.key || isResetting">
              <div class="input-toggle-slider">
              </div>
            </label>
          </template>
        </div>
      </div>

      <!-- Réitialiser -->
      <div class="pt-4 flex justify-end items-center">
        <UiBaseButton @click="resetSettings()" variant="ghost" :disabled="isResetting"
          class="!inline-flex !items-center !gap-2 !px-3 !py-1.5 !text-[11px] !font-bold !uppercase tracking-wider">
          <UiLogoLoader v-if="isResetting" size="xs" />
          <IconRotate v-else class="w-4 h-4" />
          Restaurer Defaults
        </UiBaseButton>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { IconChevronDown, IconRotate } from '@tabler/icons-vue'
import { useSettingsPrefStore } from '~/stores/front/settingsPref'
import { useProfilStore } from '~/stores/back/user/profil'
import { useToastStore } from '~/stores/front/toast'
import type { NewsletterSettings } from '~/types/profil'

const settingsStore = useSettingsPrefStore()
const profilStore = useProfilStore()
const toastStore = useToastStore()

// Clé en cours de mise à jour (pour le loader ciblé)
const loadingKey = ref<keyof NewsletterSettings | null>(null)
const isResetting = ref(false)

// Liste réactive des réglages de newsletter disponibles
const settingsList = computed(() => {
  const s = profilStore.profile?.newsletter_settings
  return [
    {
      key: 'marketing' as keyof NewsletterSettings,
      title: 'Marketing & Promotions',
      desc: 'Offres exclusives, promotions spéciales et actualités de nos partenaires.',
      enabled: s?.marketing ?? true
    },
    {
      key: 'product' as keyof NewsletterSettings,
      title: 'Produit & News',
      desc: 'Nouvelles fonctionnalités, mises à jour importantes et conseils d\'utilisation.',
      enabled: s?.product ?? true
    },
    {
      key: 'security' as keyof NewsletterSettings,
      title: 'Sécurité & Alertes',
      desc: 'Bulletins de sécurité critiques, alertes de vulnérabilité et meilleures pratiques.',
      enabled: s?.security ?? true
    }
  ]
})

// Basculer un réglage et envoyer la mise à jour au backend
async function toggleSetting(key: keyof NewsletterSettings, value: boolean) {
  loadingKey.value = key

  const result = await profilStore.updateNewsletterSettings({ [key]: value })

  if (result.success) {
    toastStore.showToast('success', 'Préférence mise à jour', result.message)
  } else {
    toastStore.showToast('error', 'Erreur', result.message)
  }

  loadingKey.value = null
}

// Réinitialiser les préférences
async function resetSettings() {
  isResetting.value = true

  const result = await profilStore.resetNewsletterSettings()

  if (result.success) {
    toastStore.showToast('success', 'Réinitialisation réussie', result.message)
  } else {
    toastStore.showToast('error', 'Erreur', result.message)
  }

  isResetting.value = false
}
</script>
