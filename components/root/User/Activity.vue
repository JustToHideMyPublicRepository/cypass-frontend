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
      <div v-if="activeTab === 'incidents'" class="space-y-6">
        <div v-if="publicIncidents.length" class="overflow-x-auto">
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
              <tr v-for="incident in paginatedIncidents" :key="incident.id"
                class="group bg-ash/5 hover:bg-ash/10 hover:scale-[1.01] transition-all duration-300">
                <td class="py-5 px-6 rounded-l-2xl">
                  <div class="space-y-1">
                    <div class="text-sm font-black text-BtW group-hover:text-primary transition-colors line-clamp-1">
                      {{ decodeHtmlEntities(incident.title) }}
                    </div>
                  </div>
                </td>
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
                <td class="py-5 px-6">
                  <div class="text-[10px] font-black text-hsa uppercase tracking-widest whitespace-nowrap">
                    {{ formatDateShort(incident.created_at) }}
                  </div>
                </td>
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

        <div v-else class="flex flex-col items-center justify-center py-32 text-center">
          <div class="w-24 h-24 bg-ash/5 rounded-[3rem] flex items-center justify-center mb-8 border border-ash/10">
            <IconShield class="w-10 h-10 text-ash/30" />
          </div>
          <h3 class="text-xl font-black text-BtW">Aucun signalement public</h3>
          <p class="text-sm font-bold text-hsa mt-2">Cet utilisateur n'a pas encore partagé d'incidents avec la
            communauté.</p>
        </div>

        <!-- Pagination Incidents -->
        <div v-if="totalIncidentPages > 1" class="flex items-center justify-center gap-4 pt-8 border-t border-ash/10">
          <UiBaseButton variant="ghost" size="sm" :disabled="incidentPage === 1" @click="incidentPage--"
            class="!p-3 !rounded-2xl hover:!bg-primary/10 hover:!text-primary transition-all">
            <IconChevronLeft class="w-5 h-5" />
          </UiBaseButton>
          <div class="px-6 py-2 rounded-2xl bg-ash/5 text-[10px] font-black text-BtW tracking-[0.2em]">
            <span class="text-primary">{{ incidentPage }}</span> / {{ totalIncidentPages }}
          </div>
          <UiBaseButton variant="ghost" size="sm" :disabled="incidentPage === totalIncidentPages"
            @click="incidentPage++" class="!p-3 !rounded-2xl hover:!bg-primary/10 hover:!text-primary transition-all">
            <IconChevronRight class="w-5 h-5" />
          </UiBaseButton>
        </div>
      </div>

      <!-- Comments Tab -->
      <div v-if="activeTab === 'comments'" class="space-y-6">
        <div v-if="comments.length" class="overflow-x-auto px-1">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="comment in paginatedComments" :key="comment.id"
              class="group bg-ash p-6 rounded-[2.5rem] border border-primary/20 hover:border-primary/50 hover:bg-WtB hover:shadow-2xl transition-all duration-500">
              <div class="flex items-start justify-between mb-4">
                <div class="text-[9px] font-black text-hsa uppercase tracking-[0.2em] bg-ash/10 px-3 py-1 rounded-full">
                  {{ formatDateShort(comment.created_at) }}
                </div>
                <NuxtLink :to="`/vigitech/${comment.incident_id}`"
                  class="text-primary hover:scale-110 transition-transform">
                  <IconExternalLink class="w-4 h-4" />
                </NuxtLink>
              </div>
              <p class="text-sm text-BtW leading-relaxed font-medium mb-6 line-clamp-3">
                "{{ comment.content }}"
              </p>
              <div class="pt-4 border-t border-ash/10 flex items-center justify-between">
                <div class="min-w-0 flex-1">
                  <p class="text-[8px] font-black text-hsa uppercase tracking-widest mb-1">Sur l'Incident</p>
                  <p class="text-[11px] font-black text-BtW truncate pr-4">
                    {{ decodeHtmlEntities(comment.incident_title) }}
                  </p>
                </div>
                <NuxtLink :to="`/vigitech/${comment.incident_id}`">
                  <UiBaseButton variant="ghost" size="sm"
                    class="!px-3 !py-1.5 !rounded-xl !text-[9px] !bg-primary/5 hover:!bg-primary !text-primary hover:!text-WtB transition-all">
                    Voir
                  </UiBaseButton>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center py-32 text-center">
          <div class="w-24 h-24 bg-ash/5 rounded-[3rem] flex items-center justify-center mb-8 border border-ash/10">
            <IconMessage class="w-10 h-10 text-ash/30" />
          </div>
          <h3 class="text-xl font-black text-BtW">Aucun commentaire</h3>
          <p class="text-sm font-bold text-hsa mt-2">Cet utilisateur n'a pas encore participé aux discussions.</p>
        </div>

        <!-- Pagination Comments -->
        <div v-if="totalCommentPages > 1" class="flex items-center justify-center gap-4 pt-8 border-t border-ash/10">
          <UiBaseButton variant="ghost" size="sm" :disabled="commentPage === 1" @click="commentPage--"
            class="!p-3 !rounded-2xl hover:!bg-primary/10 hover:!text-primary transition-all">
            <IconChevronLeft class="w-5 h-5" />
          </UiBaseButton>
          <div class="px-6 py-2 rounded-2xl bg-ash/5 text-[10px] font-black text-BtW tracking-[0.2em]">
            <span class="text-primary">{{ commentPage }}</span> / {{ totalCommentPages }}
          </div>
          <UiBaseButton variant="ghost" size="sm" :disabled="commentPage === totalCommentPages" @click="commentPage++"
            class="!p-3 !rounded-2xl hover:!bg-primary/10 hover:!text-primary transition-all">
            <IconChevronRight class="w-5 h-5" />
          </UiBaseButton>
        </div>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconAlertTriangle, IconMessage, IconShield, IconChevronLeft, IconChevronRight, IconExternalLink } from '@tabler/icons-vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { decodeHtmlEntities } from '~/utils/format'
import { mapIncidentType, mapThreatLevel } from '~/utils/vigitech'

const props = defineProps<{
  publicIncidents: any[]
  comments: any[]
}>()

const activeTab = ref<'incidents' | 'comments'>('incidents')
const pageSize = 5
const incidentPage = ref(1)
const commentPage = ref(1)

const paginatedIncidents = computed(() => {
  const start = (incidentPage.value - 1) * pageSize
  return props.publicIncidents.slice(start, start + pageSize)
})

const totalIncidentPages = computed(() => Math.ceil(props.publicIncidents.length / pageSize))

const paginatedComments = computed(() => {
  const start = (commentPage.value - 1) * pageSize
  return props.comments.slice(start, start + pageSize)
})

const totalCommentPages = computed(() => Math.ceil(props.comments.length / pageSize))

const formatDateShort = (dateStr: string) => {
  if (!dateStr) return ''
  try {
    return format(new Date(dateStr), 'dd MMM yyyy', { locale: fr })
  } catch {
    return ''
  }
}
</script>
