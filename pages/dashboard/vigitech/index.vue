<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-black text-BtW tracking-tight">VigiTech</h1>
        <p class="text-hsa font-bold">Vos signalements et veille cybernétique</p>
      </div>

      <div class="flex items-center gap-3">
        <UiBaseButton @click="showCreateModal = true" class="!px-4 !py-2.5 !text-xs !uppercase !tracking-wider gap-2">
          <IconAlertCircle class="w-4 h-4" />
          Signaler un Incident
        </UiBaseButton>
        <UiBaseButton variant="secondary" to="/dashboard/vigitech/comments"
          class="!px-4 !py-2.5 !text-xs !uppercase !tracking-wider gap-2">
          <IconMessage class="w-4 h-4" />
          Mes commentaires
        </UiBaseButton>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div class="lg:col-span-3 space-y-6">
        <div v-if="store.loading && !store.userIncidents.length" class="space-y-6">
          <UiBaseCard v-for="i in 3" :key="i" class="animate-pulse">
            <div class="h-24 bg-ash/10 rounded-xl"></div>
          </UiBaseCard>
        </div>

        <template v-else-if="filteredIncidents.length">
          <RootVigitechIncidentCard v-for="incident in filteredIncidents" :key="incident.id" :incident="incident"
            showFooter :detailUrl="`/dashboard/vigitech/${incident.id}`" @edit="openEditModal" />
        </template>

        <div v-else class="text-center py-20 px-6 glass-panel rounded-[2rem] border-2 border-dashed border-ash">
          <div class="w-16 h-16 bg-ash/10 rounded-2xl flex items-center justify-center text-hsa mx-auto mb-4">
            <IconShieldCheck class="w-8 h-8 opacity-20" />
          </div>
          <h3 class="text-lg font-black text-BtW">{{ hasActiveFilters ? 'Aucun résultat' : 'Aucun incident signalé' }}
          </h3>
          <p class="text-hsa text-sm mt-2 max-w-sm mx-auto">
            {{
              hasActiveFilters
                ? 'Essayez de modifier vos critères de recherche.'
                : 'Vous n\'avez pas encore soumis de signalement. Rapportez incident.' }}
          </p>
          <UiBaseButton v-if="hasActiveFilters" variant="ghost" size="sm" class="mt-4" @click="resetFilters">
            Réinitialiser les filtres
          </UiBaseButton>
        </div>
      </div>

      <!-- Sidebar: Filters & Widgets -->
      <div class="space-y-6">
        <!-- Filtres -->
        <div class="glass-panel p-6 rounded-[2rem] border border-ashAct space-y-6 shadow-sm">
          <h3 class="text-[10px] font-black text-hsa uppercase tracking-[0.2em]">Filtrer</h3>
          <div class="space-y-4">
            <!-- Recherche -->
            <div class="space-y-1.5">
              <label class="text-[9px] font-black text-hsa uppercase tracking-widest px-1">Recherche</label>
              <div class="relative group">
                <span
                  class="absolute left-3 top-1/2 -translate-y-1/2 text-hsa group-focus-within:text-primary transition-colors">
                  <IconSearch class="w-4 h-4" />
                </span>
                <input v-model="filters.search" type="text" placeholder="Mot-clé..."
                  class="w-full h-10 pl-9 pr-4 rounded-xl bg-WtB border border-ash/50 font-bold text-xs outline-none focus:ring-2 focus:ring-primary transition-all placeholder-hsa/50" />
              </div>
            </div>

            <!-- Type -->
            <div class="space-y-1.5">
              <label class="text-[9px] font-black text-hsa uppercase tracking-widest px-1">Type de menace</label>
              <div class="relative group">
                <select v-model="filters.type"
                  class="w-full h-10 px-4 rounded-xl bg-WtB border border-ash/50 font-bold text-xs outline-none focus:ring-2 focus:ring-primary transition-all appearance-none cursor-pointer">
                  <option value="">Tous les types</option>
                  <option value="phishing">Phishing</option>
                  <option value="ransomware">Ransomware</option>
                  <option value="fake_profile">Faux Profil</option>
                  <option value="harassment">Harcèlement</option>
                </select>
                <IconChevronDown
                  class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hsa pointer-events-none group-focus-within:text-primary transition-colors" />
              </div>
            </div>

            <!-- Gravité -->
            <div class="space-y-1.5">
              <label class="text-[9px] font-black text-hsa uppercase tracking-widest px-1">Gravité</label>
              <div class="relative group">
                <select v-model="filters.level"
                  class="w-full h-10 px-4 rounded-xl bg-WtB border border-ash/50 font-bold text-xs outline-none focus:ring-2 focus:ring-primary transition-all appearance-none cursor-pointer">
                  <option value="">Toutes les gravités</option>
                  <option value="low">Faible</option>
                  <option value="medium">Moyenne</option>
                  <option value="critical">Critique</option>
                </select>
                <IconChevronDown
                  class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hsa pointer-events-none group-focus-within:text-primary transition-colors" />
              </div>
            </div>

            <!-- Dates -->
            <div class="space-y-4 pt-2 border-t border-ash">
              <div class="space-y-1.5">
                <label class="text-[9px] font-black text-hsa uppercase tracking-widest px-1">Depuis le</label>
                <input v-model="filters.date_start" type="datetime-local"
                  class="w-full h-10 px-3 rounded-xl bg-WtB border border-ash/50 text-xs font-bold outline-none focus:ring-2 focus:ring-primary transition-all" />
              </div>
              <div class="space-y-1.5">
                <label class="text-[9px] font-black text-hsa uppercase tracking-widest px-1">Jusqu'au</label>
                <input v-model="filters.date_end" type="datetime-local"
                  class="w-full h-10 px-3 rounded-xl bg-WtB border border-ash/50 text-xs font-bold outline-none focus:ring-2 focus:ring-primary transition-all" />
              </div>
            </div>
          </div>

          <UiBaseButton variant="ghost" block size="sm" class="!text-[9px] !font-black !uppercase" @click="resetFilters"
            :disabled="!hasActiveFilters">
            Réinitialiser
          </UiBaseButton>
        </div>

        <UiBaseCard title="Sources Surveillées" class="!rounded-[2rem]">
          <ul class="space-y-3 text-[11px] font-bold uppercase tracking-wider">
            <li class="flex justify-between items-center text-hsa">
              <span>Traffic Réseau</span>
              <span class="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            </li>
            <li class="flex justify-between items-center text-hsa">
              <span>Logs Système</span>
              <span class="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            </li>
            <li class="flex justify-between items-center text-hsa">
              <span>Feeds CERT-BJ</span>
              <span class="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            </li>
            <li class="flex justify-between items-center text-hsa">
              <span>Dark Web Monitor</span>
              <span class="w-2 h-2 rounded-full bg-warning"></span>
            </li>
          </ul>
        </UiBaseCard>

        <UiBaseCard
          class="bg-primary text-white border-none !rounded-[2rem] shadow-xl shadow-primary/20 overflow-hidden relative group">
          <div
            class="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700">
          </div>
          <h3 class="font-black mb-2 flex items-center gap-2 relative z-10">
            <IconBroadcast class="w-5 h-5 text-white/90" /> Mode Veille
          </h3>
          <p class="text-xs text-white/80 mb-6 leading-relaxed relative z-10">
            Analyse continue des menaces ciblant l'infrastructure nationale.
          </p>
          <div class="w-full bg-white/20 rounded-full h-1.5 mb-2 overflow-hidden relative z-10">
            <div class="bg-white h-1.5 rounded-full w-2/3 animate-[pulse_2s_infinite]"></div>
          </div>
          <div class="text-[10px] font-black uppercase tracking-widest text-white/70 text-right relative z-10">
            Analyse Active...
          </div>
        </UiBaseCard>
      </div>
    </div>

    <!-- Create / Edit Incident Modal -->
    <ModalVigitechCreateIncident :show="showCreateModal" :incident="editIncident" @close="closeModal"
      @success="onIncidentCreated" />
  </div>
</template>

<script setup lang="ts">
import { IconBroadcast, IconAlertCircle, IconShieldCheck, IconChevronDown, IconSearch, IconMessage } from '@tabler/icons-vue'
import { useVigitechStore } from '~/stores/vigitech'
import type { Incident } from '~/types/vigitech'

definePageMeta({
  layout: 'default'
})

const store = useVigitechStore()
const showCreateModal = ref(false)
const editIncident = ref<Incident | null>(null)

const openEditModal = (incident: Incident) => {
  editIncident.value = incident
  showCreateModal.value = true
}

const closeModal = () => {
  showCreateModal.value = false
  editIncident.value = null
}

const filters = ref({
  search: '',
  type: '',
  level: '',
  date_start: '',
  date_end: ''
})

const filteredIncidents = computed(() => {
  let list = store.userIncidents
  const q = filters.value.search.toLowerCase()
  if (q) {
    list = list.filter(i => {
      const title = (i.title || '').toLowerCase()
      const desc = (i.description || '').toLowerCase()
      const loc = (i.location || '').toLowerCase()
      return title.includes(q) || desc.includes(q) || loc.includes(q)
    })
  }
  if (filters.value.type) {
    list = list.filter(i => i.type === filters.value.type)
  }
  if (filters.value.level) {
    list = list.filter(i => i.threat_level === filters.value.level)
  }
  if (filters.value.date_start) {
    const start = new Date(filters.value.date_start).getTime()
    list = list.filter(i => new Date(i.created_at).getTime() >= start)
  }
  if (filters.value.date_end) {
    const end = new Date(filters.value.date_end).getTime()
    list = list.filter(i => new Date(i.created_at).getTime() <= end)
  }
  return list
})

const hasActiveFilters = computed(() => {
  return filters.value.search !== '' || filters.value.type !== '' ||
    filters.value.level !== '' || filters.value.date_start !== '' || filters.value.date_end !== ''
})

const resetFilters = () => {
  filters.value = { search: '', type: '', level: '', date_start: '', date_end: '' }
}

const onIncidentCreated = () => {
  // Logic after successful creation is handled in the store (fetchUserIncidents)
}

onMounted(() => {
  store.fetchUserIncidents()
})

useHead({
  title: 'Gestion des incidents'
})
</script>
