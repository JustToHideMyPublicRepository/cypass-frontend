<template>
  <UiBaseCard class="p-10 border-ash/30 relative overflow-hidden rounded-[2.5rem]">
    <div class="relative space-y-4">
      <div class="flex items-center gap-4 pb-6 border-b border-ash/10">
        <div class="p-3 bg-ash/10 rounded-2xl">
          <IconBuildingSkyscraper class="w-6 h-6 text-primary" />
        </div>
        <div>
          <h5>Informations Structurelles</h5>
          <p>Détails administratifs et identifiants du workspace.</p>
        </div>
      </div>

      <div class="space-y-4">
        <!-- Identité Systémique -->
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex-1 min-w-[240px] space-y-2">
            <span class="text-[10px] font-black text-hsa uppercase tracking-widest flex items-center gap-2">
              <IconFingerprint class="w-3.5 h-3.5" /> ID du workspace
            </span>
            <p class="text-xs">{{ workspace.id }}</p>
          </div>

          <div class="flex-1 min-w-[240px] space-y-2">
            <span class="text-[10px] font-black text-hsa uppercase tracking-widest flex items-center gap-2">
              <IconCalendar class="w-3.5 h-3.5" /> Date de création
            </span>
            <p class="text-xs">{{ formattedCreatedAt }}</p>
          </div>
        </div>

        <!-- Données Légales -->
        <div v-if="workspace.rccm || workspace.ifu" class="flex flex-wrap items-center gap-8 pt-2 border-t border-ash">
          <div v-if="workspace.rccm"
            class="flex-1 min-w-[240px] flex flex-col gap-2 p-5 rounded-2xl bg-primary/5 border border-primary/10">
            <span class="text-[10px] font-black text-primary uppercase tracking-widest">Immatriculation RCCM</span>
            <div class="flex items-center gap-3">
              <IconFileText class="w-5 h-5 text-primary/60" />
              <span class="text-lg font-black text-BtW tracking-tight">{{ workspace.rccm }}</span>
            </div>
          </div>
          <div v-if="workspace.ifu"
            class="flex-1 min-w-[240px] flex flex-col gap-2 p-5 rounded-2xl bg-secondary/5 border border-secondary/10">
            <span class="text-[10px] font-black text-secondary uppercase tracking-widest">Identifiant IFU</span>
            <div class="flex items-center gap-3">
              <IconFingerprint class="w-5 h-5 text-secondary/60" />
              <span class="text-lg font-black text-BtW tracking-tight">{{ workspace.ifu }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconBuildingSkyscraper, IconFingerprint, IconFileText, IconCalendar } from '@tabler/icons-vue'
import type { Workspace } from '~/types/workspace'

const props = defineProps<{
  workspace: Workspace
}>()

const formattedCreatedAt = computed(() => {
  const dateStr = props.workspace.created_at
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return isNaN(date.getTime()) ? '—' : date.toLocaleString()
})
</script>
