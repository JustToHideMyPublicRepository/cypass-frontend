<template>
  <div class="space-y-6">
    <!-- Affichage si des incidents existent -->
    <div v-if="incidents.length">
      <!-- Mobile View: Cards -->
      <div class="grid grid-cols-1 gap-4 md:hidden">
        <div v-for="incident in paginatedItems" :key="incident.id"
          class="bg-ash/5 p-6 rounded-3xl border border-ash/10 space-y-4 hover:border-primary/20 transition-all duration-300">
          <div class="flex justify-between items-start">
            <h4 class="text-sm font-black text-BtW line-clamp-2 pr-4 leading-snug">
              {{ decodeHtmlEntities(incident.title) }}
            </h4>
            <div class="shrink-0 text-[10px] font-black text-hsa uppercase tracking-widest">
              {{ formatDateShort(incident.created_at) }}
            </div>
          </div>

          <div class="flex items-center justify-between gap-4 pt-2 border-t border-ash/10">
            <div class="flex flex-col gap-1.5">
              <span class="text-[9px] font-black text-BtW uppercase tracking-tighter opacity-60">
                {{ mapIncidentType(incident.type) }}
              </span>
              <UiStatusBadge
                :status="incident.threat_level === 'critical' ? 'High' : incident.threat_level === 'medium' ? 'Medium' : 'Low'"
                class="!text-[8px] !px-2 !py-0.5 uppercase !w-fit">
                {{ mapThreatLevel(incident.threat_level) }}
              </UiStatusBadge>
            </div>
            <NuxtLink :to="`/vigitech/${incident.id}`" class="shrink-0">
              <UiBaseButton variant="primary" size="sm"
                class="!px-4 !py-2 !rounded-xl !text-[10px] shadow-lg shadow-primary/10">
                Consulter
              </UiBaseButton>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Desktop View: Table -->
      <div class="hidden md:block overflow-x-auto no-scrollbar">
        <table class="w-full text-left border-separate border-spacing-y-4">
          <thead>
            <tr class="text-[10px] font-black uppercase tracking-[0.25em] text-hsa/60 px-4">
              <th class="pb-2 px-6">Détails de l'incident</th>
              <th class="pb-2 px-6">Type & Niveau</th>
              <th class="pb-2 px-6">Date</th>
              <th class="pb-2 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            <!-- Ligne d'incident individuelle -->
            <tr v-for="incident in paginatedItems" :key="incident.id"
              class="group bg-ash/5 hover:bg-ash/10 hover:scale-[1.01] transition-all duration-300">
              <!-- Titre de l'incident -->
              <td class="py-5 px-6 rounded-l-2xl">
                <div class="text-sm font-black text-BtW group-hover:text-primary transition-colors line-clamp-1">
                  {{ decodeHtmlEntities(incident.title) }}
                </div>
              </td>
              <!-- Classification : Type et Niveau de menace -->
              <td class="py-5 px-6">
                <div class="flex flex-col gap-1.5">
                  <span class="text-[10px] font-black text-BtW uppercase tracking-tighter">{{
                    mapIncidentType(incident.type) }}</span>
                  <UiStatusBadge
                    :status="incident.threat_level === 'critical' ? 'High' : incident.threat_level === 'medium' ? 'Medium' : 'Low'"
                    class="!text-[8px] !px-2 !py-0.5 uppercase !w-fit">
                    {{ mapThreatLevel(incident.threat_level) }}
                  </UiStatusBadge>
                </div>
              </td>
              <!-- Date de signalement -->
              <td class="py-5 px-6">
                <div class="text-[10px] font-black text-hsa uppercase tracking-widest whitespace-nowrap">
                  {{ formatDateShort(incident.created_at) }}
                </div>
              </td>
              <!-- Bouton d'action pour consulter les détails -->
              <td class="py-5 px-6 text-right rounded-r-2xl">
                <NuxtLink :to="`/vigitech/${incident.id}`">
                  <UiBaseButton variant="primary" size="sm"
                    class="!px-4 !py-2 !rounded-xl !text-[10px] shadow-lg shadow-primary/10">
                    Consulter
                  </UiBaseButton>
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- État vide -->
    <div v-else class="flex flex-col items-center justify-center py-32 text-center">
      <div class="w-24 h-24 bg-hsa rounded-[3rem] flex items-center justify-center mb-8 border border-ash/10">
        <IconShield class="w-10 h-10 text-ash" />
      </div>
      <h3 class="text-xl font-black text-BtW">Aucun signalement public</h3>
      <p class="text-sm font-bold text-hsa mt-2">Cet utilisateur n'a pas encore partagé d'incidents avec la communauté.
      </p>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-center gap-4 pt-8 border-t border-ash/10">
      <UiBaseButton variant="ghost" size="sm" :disabled="page === 1" @click="page--"
        class="!p-3 !rounded-2xl hover:!bg-primary/10 hover:!text-primary transition-all">
        <IconChevronLeft class="w-5 h-5" />
      </UiBaseButton>
      <div class="px-6 py-2 rounded-2xl bg-ash/5 text-[10px] font-black text-BtW tracking-[0.2em]">
        <span class="text-primary">{{ page }}</span> / {{ totalPages }}
      </div>
      <UiBaseButton variant="ghost" size="sm" :disabled="page === totalPages" @click="page++"
        class="!p-3 !rounded-2xl hover:!bg-primary/10 hover:!text-primary transition-all">
        <IconChevronRight class="w-5 h-5" />
      </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconShield, IconChevronLeft, IconChevronRight } from '@tabler/icons-vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { decodeHtmlEntities } from '~/utils/format'
import { mapIncidentType, mapThreatLevel } from '~/utils/vigitech'

// Propriétés reçues
const props = defineProps<{
  incidents: any[]
}>()

// Logique de pagination
const page = ref(1)
const pageSize = 5
const totalPages = computed(() => Math.ceil(props.incidents.length / pageSize))
const paginatedItems = computed(() => {
  const start = (page.value - 1) * pageSize
  return props.incidents.slice(start, start + pageSize)
})

/**
 * Formate la date de création de l'incident en français.
 */
const formatDateShort = (dateStr: string) => {
  if (!dateStr) return ''
  try {
    return format(new Date(dateStr), 'dd MMM yyyy', { locale: fr })
  } catch {
    return ''
  }
}
</script>
