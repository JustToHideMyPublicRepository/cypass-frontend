<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
    <UiBaseCard v-for="(ws, index) in workspaces" :key="ws.id" @click="$emit('select', ws)"
      class="group/ws p-4 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-2 relative overflow-hidden animate-fade-up"
      :style="{ animationDelay: `${index * 100}ms` }" :class="[
        isActive(ws.id, activeId)
          ? 'border-primary/40 bg-primary/5 ring-1 ring-primary/10'
          : 'border-ash hover:border-primary/30 bg-WtB'
      ]">

      <!-- Indicateur de changement -->
      <div v-if="switchingId === ws.id"
        class="absolute inset-0 bg-WtB/80 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
        <UiLogoLoader size="sm" color="primary" />
      </div>

      <!-- Indicateur Actif -->
      <div v-if="isActive(ws.id, activeId)" class="absolute top-0 right-0 w-12 h-12">
        <div
          class="absolute top-0 right-0 w-0 h-0 border-t-[48px] border-l-[48px] border-t-primary border-l-transparent opacity-10">
        </div>
        <IconCheck class="absolute top-2 right-2 w-4 h-4 text-primary" />
      </div>

      <div class="flex flex-col gap-5">
        <!-- Logo & Badge -->
        <div class="flex items-center justify-between">
          <div
            class="w-14 h-14 rounded-2xl overflow-hidden border-2 border-ash group-hover/ws:border-primary/30 transition-all shadow-sm bg-ash/5 p-0.5">
            <img :src="getWorkspaceLogoUrl(ws.logo_url, ws.name)" :alt="ws.name"
              class="w-full h-full object-cover rounded-xl" />
          </div>
          <div v-if="ws.is_default"
            class="px-2.5 py-1 rounded-lg bg-warning/10 text-warning text-[10px] font-black uppercase tracking-wider border border-warning/20 shadow-sm">
            Défaut
          </div>
        </div>

        <!-- Infos -->
        <div class="space-y-2">
          <h5> {{ ws.name }} </h5>
          <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span
              class="inline-flex items-center gap-1.5 text-[10px] font-bold text-hsa uppercase tracking-wider bg-ash/30 px-2 py-0.5 rounded-md border border-ash/50">
              <component :is="WORKSPACE_TYPE_CONFIG[ws.type]?.icon || IconBuilding" class="w-3 h-3 text-primary" />
              {{ getWorkspaceTypeLabel(ws.type) }}
            </span>
            <span v-if="ws.role"
              class="inline-flex items-center gap-1.5 text-[10px] font-bold text-primary/70 uppercase tracking-wider bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">
              {{ getWorkspaceRoleLabel(ws.role) }}
            </span>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between pt-4 border-t border-ash/50 mt-1">
          <div class="flex items-center gap-1.5">
            <div class="flex -space-x-2">
              <div v-for="i in Math.min(3, ws.members_count || 1)" :key="i"
                class="w-5 h-5 rounded-full border-2 border-WtB bg-ash flex items-center justify-center text-[8px] font-bold text-BtW">
                <IconUser class="w-2.5 h-2.5" />
              </div>
            </div>
            <span class="text-[10px] text-hsa font-bold">{{ ws.members_count || 1 }} membre(s)</span>
          </div>
          <div
            class="w-8 h-8 rounded-full bg-ash/50 flex items-center justify-center group-hover/ws:bg-primary group-hover/ws:text-white transition-all shadow-sm">
            <IconArrowRight class="w-4 h-4 transition-transform group-hover/ws:translate-x-0.5" />
          </div>
        </div>
      </div>
    </UiBaseCard>

    <!-- Ajouter un nouveau -->
    <button @click="$emit('create')"
      class="p-6 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-ash rounded-[2rem] hover:border-primary/40 hover:bg-primary/5 transition-all text-hsa hover:text-primary group/new min-h-[220px] bg-transparent animate-fade-up"
      :style="{ animationDelay: `${workspaces.length * 100}ms` }">
      <div
        class="w-12 h-12 rounded-full bg-ash/20 group-hover/new:bg-primary/10 flex items-center justify-center transition-all group-hover/new:rotate-90">
        <IconPlus class="w-6 h-6" />
      </div>
      <div class="text-center">
        <span class="text-sm font-black uppercase tracking-widest block">Nouveau Workspace</span>
        <span class="text-[10px] text-hsa/60 font-medium mt-1 block">Ajoutez une organisation</span>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { IconPlus, IconArrowRight, IconBuilding, IconUser, IconCheck } from '@tabler/icons-vue'
import { getWorkspaceLogoUrl, getWorkspaceTypeLabel, getWorkspaceRoleLabel, WORKSPACE_TYPE_CONFIG } from '~/utils/workspace'
import type { Workspace } from '~/types/workspace'

defineProps<{
  workspaces: Workspace[]
  activeId?: string | null
  switchingId?: string | null
}>()

const emit = defineEmits(['select', 'create'])

const isActive = (id: string, activeId?: string | null) => activeId === id
</script>
