<template>
  <UiBaseCard class="lg:col-span-12 !rounded-[3rem] overflow-hidden !border-none shadow-xl">
    <!-- Navigation par onglets personnalisée -->
    <div class="flex bg-ash/5 p-2 rounded-t-[3rem] border-b border-ash/10">
      <!-- Onglet Signalements -->
      <button @click="activeTab = 'incidents'"
        class="flex-1 py-4 flex items-center justify-center gap-3 rounded-[2rem] transition-all duration-500 font-black uppercase tracking-widest text-[11px]"
        :class="activeTab === 'incidents' ? 'bg-ash shadow-lg text-primary translate-y-0' : 'text-hsa hover:text-BtW'">
        <IconAlertTriangle class="w-4 h-4" />
        Signalements
        <span class="ml-1 w-6 h-6 rounded-full bg-primary/5 flex items-center justify-center text-[9px]">
          {{ publicIncidents.length }}
        </span>
      </button>

      <!-- Onglet Commentaires -->
      <button @click="activeTab = 'comments'"
        class="flex-1 py-4 flex items-center justify-center gap-3 rounded-[2rem] transition-all duration-500 font-black uppercase tracking-widest text-[11px]"
        :class="activeTab === 'comments' ? 'bg-ash shadow-lg text-primary translate-y-0' : 'text-hsa hover:text-BtW'">
        <IconMessage class="w-4 h-4" />
        Commentaires
        <span class="ml-1 w-6 h-6 rounded-full bg-primary/5 flex items-center justify-center text-[9px]">
          {{ comments.length }}
        </span>
      </button>
    </div>

    <!-- Contenu des onglets -->
    <div class="p-8 md:p-10 min-h-[500px] animate-fade-in">
      <!-- Vue des Signalements -->
      <RootUserActivityIncidents v-if="activeTab === 'incidents'" :incidents="publicIncidents" />

      <!-- Vue des Commentaires -->
      <RootUserActivityComments v-if="activeTab === 'comments'" :comments="comments" :user-avatar-url="userAvatarUrl" />
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
}>()

// État local pour l'onglet actif
const activeTab = ref<'incidents' | 'comments'>('incidents')
</script>
