<template>
  <UiBaseCard class="lg:col-span-12 !rounded-[3rem] overflow-hidden !border-none shadow-xl">
    <!-- Navigation par onglets personnalisée -->
    <div
      class="flex bg-ash/5 p-1.5 md:p-2 rounded-t-[2.5rem] md:rounded-t-[3rem] border-b border-ash/10 overflow-x-auto no-scrollbar flex-nowrap">
      <!-- Onglet Signalements -->
      <button @click="activeTab = 'incidents'"
        class="flex-1 py-3 md:py-4 flex items-center justify-center gap-2 md:gap-3 rounded-[1.8rem] md:rounded-[2rem] transition-all duration-500 font-black uppercase tracking-widest text-[9px] md:text-[11px] min-w-[140px] md:min-w-0"
        :class="activeTab === 'incidents' ? 'bg-ash shadow-lg text-primary translate-y-0' : 'text-hsa hover:text-BtW'">
        <IconAlertTriangle class="w-3.5 h-3.5 md:w-4 md:h-4" />
        Signalements
        <span
          class="ml-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary/5 flex items-center justify-center text-[8px] md:text-[9px]">
          {{ publicIncidents.length }}
        </span>
      </button>

      <!-- Onglet Commentaires -->
      <button @click="activeTab = 'comments'"
        class="flex-1 py-3 md:py-4 flex items-center justify-center gap-2 md:gap-3 rounded-[1.8rem] md:rounded-[2rem] transition-all duration-500 font-black uppercase tracking-widest text-[9px] md:text-[11px] min-w-[140px] md:min-w-0"
        :class="activeTab === 'comments' ? 'bg-ash shadow-lg text-primary translate-y-0' : 'text-hsa hover:text-BtW'">
        <IconMessage class="w-3.5 h-3.5 md:w-4 md:h-4" />
        Commentaires
        <span
          class="ml-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary/5 flex items-center justify-center text-[8px] md:text-[9px]">
          {{ comments.length }}
        </span>
      </button>
    </div>

    <!-- Contenu des onglets -->
    <div class="p-6 md:p-10 min-h-[400px] md:min-h-[500px] animate-fade-in">
      <!-- Vue des Signalements -->
      <RootUserActivityIncidents v-if="activeTab === 'incidents'" :incidents="publicIncidents" />

      <!-- Vue des Commentaires -->
      <RootUserActivityComments v-if="activeTab === 'comments'" :comments="comments" :user-avatar-url="userAvatarUrl"
        :is-own-profile="isOwnProfile" />
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconAlertTriangle, IconMessage } from '@tabler/icons-vue'

// Propriétés reçues du parent (profil de l'utilisateur)
const props = defineProps<{
  publicIncidents: any[]
  comments: any[]
  userAvatarUrl: string
  isOwnProfile?: boolean
}>()

// État local pour l'onglet actif
const activeTab = ref<'incidents' | 'comments'>('incidents')
</script>
