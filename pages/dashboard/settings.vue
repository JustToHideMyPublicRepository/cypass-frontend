<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-BtW">Paramètres</h1>
      <p class="text-hsa">Personnalisez votre expérience CYPASS.</p>
    </div>

    <!-- Theme Settings -->
    <UiBaseCard title="Apparence">
      <div class="space-y-4">
        <div class="flex items-center justify-between p-4 rounded-xl bg-ash/30 border border-ash">
          <div class="flex items-center gap-4">
            <div class="p-2 bg-WtB rounded-lg shadow-sm">
              <IconMoon v-if="$colorMode.value === 'dark'" class="w-6 h-6 text-primary" />
              <IconSun v-else class="w-6 h-6 text-warning" />
            </div>
            <div>
              <h3 class="font-bold text-BtW">Thème du système</h3>
              <p class="text-sm text-hsa">Basculer entre le mode clair et sombre.</p>
            </div>
          </div>
          <ClientOnly>
            <select v-model="$colorMode.preference"
              class="px-4 py-2 rounded-lg bg-WtB border border-ash focus:ring-2 focus:ring-primary outline-none text-BtW text-sm cursor-pointer">
              <option value="system">Système</option>
              <option value="light">Clair</option>
              <option value="dark">Sombre</option>
            </select>
          </ClientOnly>
        </div>
      </div>
    </UiBaseCard>

    <!-- Notifications -->
    <UiBaseCard title="Notifications">
      <div class="space-y-6">
        <div v-for="(setting, index) in notificationSettings" :key="index"
          class="flex items-center justify-between pb-4 border-b border-ash last:border-0 last:pb-0">
          <div>
            <h3 class="font-medium text-BtW">{{ setting.title }}</h3>
            <p class="text-xs text-hsa mt-0.5">{{ setting.desc }}</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="setting.enabled" class="sr-only peer">
            <div
              class="w-11 h-6 bg-ash peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary">
            </div>
          </label>
        </div>
      </div>
    </UiBaseCard>

    <!-- Language & Region -->
    <UiBaseCard title="Langue et Région">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-1">
          <label class="text-xs font-bold text-hsa uppercase">Langue</label>
          <div class="relative">
            <IconLanguage class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa" />
            <select
              class="w-full pl-10 pr-4 py-2.5 rounded-lg bg-ash border border-ashAct focus:ring-2 focus:ring-primary outline-none text-BtW appearance-none">
              <option>Français (France)</option>
              <option>English (US)</option>
            </select>
          </div>
        </div>
        <div class="space-y-1">
          <label class="text-xs font-bold text-hsa uppercase">Fuseau Horaire</label>
          <div class="relative">
            <IconClock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa" />
            <select
              class="w-full pl-10 pr-4 py-2.5 rounded-lg bg-ash border border-ashAct focus:ring-2 focus:ring-primary outline-none text-BtW appearance-none">
              <option>Africa/Porto-Novo (GMT+1)</option>
              <option>Europe/Paris (GMT+1)</option>
              <option>UTC (GMT+0)</option>
            </select>
          </div>
        </div>
      </div>
    </UiBaseCard>

    <!-- Danger Zone -->
    <UiBaseCard class="border border-danger/30 bg-danger/5">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-bold text-danger">Zone de danger</h3>
          <p class="text-sm text-danger/70">Actions irréversibles pour votre compte.</p>
        </div>
        <UiBaseButton variant="danger" size="sm" @click="openDeleteModal">
          Supprimer mon compte
        </UiBaseButton>
      </div>
    </UiBaseCard>

    <!-- Delete Account Modal -->
    <ModalSettingDelete :show="showDeleteModal" @close="showDeleteModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { IconSun, IconMoon, IconLanguage, IconClock } from '@tabler/icons-vue'
import { useProfilStore } from '~/stores/profil'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useHead({
  title: 'Paramètres'
})

const profilStore = useProfilStore()
const notificationSettings = reactive([
  { title: 'Alertes de sécurité critiques', desc: 'Recevoir une alerte immédiate en cas de faille détectée.', enabled: true },
  { title: 'Mises à jour de DocSentry', desc: 'Notifications lors de la validation d\'un document.', enabled: true },
  { title: 'Newsletter VigiTech', desc: 'Résumé hebdomadaire des menaces cybernétiques.', enabled: false },
])

const showDeleteModal = ref(false)

const openDeleteModal = () => {
  showDeleteModal.value = true
}
</script>
