<template>
  <UiBaseCard class="lg:col-span-12 !rounded-[3rem] overflow-hidden !border-none shadow-xl">
    <!-- Tab Navigation Custom -->
    <div class="flex bg-ash/5 p-2 rounded-t-[3rem] border-b border-ash/10">
      <button @click="activeTab = 'incidents'"
        class="flex-1 py-4 flex items-center justify-center gap-3 rounded-[2rem] transition-all duration-500 font-black uppercase tracking-widest text-[11px]"
        :class="activeTab === 'incidents' ? 'bg-ash shadow-lg text-primary translate-y-0' : 'text-hsa hover:text-BtW'">
        <IconAlertTriangle class="w-4 h-4" />
        Signalements
        <span class="ml-1 w-6 h-6 rounded-full bg-primary/5 flex items-center justify-center text-[9px]">
          {{ publicIncidents.length }}
        </span>
      </button>
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

    <div class="p-8 md:p-10 min-h-[500px] animate-fade-in">
      <!-- Incidents Tab -->
      <RootUserActivityIncidents v-if="activeTab === 'incidents'" :incidents="publicIncidents" />

      <!-- Comments Tab -->
      <RootUserActivityComments v-if="activeTab === 'comments'" :comments="comments" />
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconAlertTriangle, IconMessage } from '@tabler/icons-vue'

const props = defineProps<{
  publicIncidents: any[]
  comments: any[]
}>()

const activeTab = ref<'incidents' | 'comments'>('incidents')
</script>
