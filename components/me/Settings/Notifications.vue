<template>
  <UiBaseCard class="!rounded-[2rem]">
    <!-- Custom Header for Collapse/Expand -->
    <template #header>
      <div class="flex-1 flex items-center justify-between cursor-pointer group"
        @click="settingsStore.toggleSection('notifications')">
        <h3 class="text-xl font-black text-BtW tracking-tight uppercase">Notifications</h3>
        <button class="p-2 rounded-full hover:bg-ash transition-colors text-hsa group-hover:text-primary">
          <IconChevronDown class="w-5 h-5 transition-transform duration-300"
            :class="{ '-rotate-180': settingsStore.display.notifications }" />
        </button>
      </div>
    </template>

    <!-- Collapsible Content -->
    <div v-show="settingsStore.display.notifications" class="space-y-6 animate-fade-in">
      <!-- Liste des différents types de notifications paramétrables -->
      <div v-for="(setting, index) in settingsList" :key="index"
        class="flex items-center justify-between gap-4 p-5 rounded-[2rem] bg-ash/20 border border-ashAct/30 transition-all hover:bg-ash/40 group/setting shadow-inner">
        <div class="flex-1">
          <!-- Nom de la notification -->
          <h4 class="font-black text-BtW text-sm uppercase tracking-tight">{{ setting.title }}</h4>
          <!-- Description de l'utilité de la notification -->
          <p class="text-[11px] text-hsa leading-tight mt-1 font-medium opacity-70">{{ setting.desc }}</p>
        </div>

        <!-- Interrupteur -->
        <div class="flex items-center gap-3">
          <template v-if="profilStore.loading && !profilStore.profile?.notification_settings && !loadingKey">
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
import { useNotificationsStore } from '~/stores/back/user/notifications'
import { useProfilStore } from '~/stores/back/user/profil'
import { useToastStore } from '~/stores/front/toast'
import type { NotificationSettings } from '~/types/profil'

const settingsStore = useSettingsPrefStore()
const notifStore = useNotificationsStore()
const profilStore = useProfilStore()
const toastStore = useToastStore()

// Clé en cours de mise à jour (pour le loader ciblé)
const loadingKey = ref<keyof NotificationSettings | null>(null)
const isResetting = ref(false)


// Liste réactive des réglages de notification disponibles
const settingsList = computed(() => {
  const s = profilStore.profile?.notification_settings
  return [
    {
      key: 'profile' as keyof NotificationSettings,
      title: 'Profil & Compte',
      desc: 'Mises à jour de votre avatar et informations de profil.',
      enabled: s?.profile ?? true
    },
    {
      key: 'documents' as keyof NotificationSettings,
      title: 'Documents & DocSentry',
      desc: 'Certifications réussies ou échouées de vos documents.',
      enabled: s?.documents ?? true
    },
    {
      key: 'incidents' as keyof NotificationSettings,
      title: 'Incidents VigiTech',
      desc: 'Nouveaux incidents signalés et commentaires.',
      enabled: s?.incidents ?? true
    },
    {
      key: 'security' as keyof NotificationSettings,
      title: 'Alertes de sécurité',
      desc: 'Connexions, changements de mot de passe, double authentification et suppressions.',
      enabled: s?.security ?? true
    },
  ]
})

// Basculer un réglage et envoyer la mise à jour au backend
async function toggleSetting(key: keyof NotificationSettings, value: boolean) {
  loadingKey.value = key

  const result = await notifStore.updateNotificationSettings({ [key]: value })

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

  const result = await notifStore.resetNotificationSettings()

  if (result.success) {
    toastStore.showToast('success', 'Réinitialisation réussie', result.message)
  } else {
    toastStore.showToast('error', 'Erreur', result.message)
  }

  isResetting.value = false
}
</script>
