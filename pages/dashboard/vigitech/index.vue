<template>
  <div class="space-y-6">
    <MeVigitechHomeHeader title="VigiTech" subtitle="Vos signalements et veille cybernétique"
      @create="showCreateModal = true" />

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div class="lg:col-span-3 space-y-6">
        <div v-if="store.loading && !store.userIncidents.length" class="space-y-6">
          <UiBaseCard v-for="i in 3" :key="i" class="animate-pulse">
            <div class="h-24 bg-ash/10 rounded-xl"></div>
          </UiBaseCard>
        </div>

        <template v-else-if="filteredIncidents.length">
          <RootVigitechIncidentCard v-for="incident in filteredIncidents" :key="incident.id" :incident="incident"
            showFooter :detailUrl="`/dashboard/vigitech/${incident.id}`" @edit="openEditModal"
            @delete="confirmDelete" />
        </template>

        <MeVigitechHomeEmpty v-else :hasActiveFilters="hasActiveFilters" @reset="resetFilters" />
      </div>

      <!-- Sidebar: Filters & Widgets -->
      <div class="space-y-6">
        <MeVigitechHomeFilters v-model="filters" :hasActiveFilters="hasActiveFilters" @reset="resetFilters" />
        <MeVigitechHomeWidgets />
      </div>
    </div>

    <!-- Create / Edit Incident Modal -->
    <ModalVigitechCreateIncident :show="showCreateModal" :incident="editIncident" @close="closeModal"
      @success="onIncidentCreated" />

    <UiConfirmModal :show="showDeleteConfirm" title="Supprimer l'incident"
      message="Êtes-vous sûr de vouloir supprimer cet incident ? Cette action est irréversible."
      confirm-text="Supprimer" :loading="deleting" variant="danger" @close="showDeleteConfirm = false"
      @confirm="handleDelete" />
  </div>
</template>

<script setup lang="ts">
import { useVigitechStore } from '~/stores/vigitech'
import { useToastStore } from '~/stores/toast'
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

const toast = useToastStore()
const showDeleteConfirm = ref(false)
const deleting = ref(false)
const incidentToDelete = ref<Incident | null>(null)

const confirmDelete = (incident: Incident) => {
  incidentToDelete.value = incident
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  if (!incidentToDelete.value) return
  deleting.value = true
  const result = await store.deleteIncident(incidentToDelete.value.id)
  if (result.success) {
    toast.showToast('success', 'Incident supprimé', result.message || 'L\'incident a été supprimé.')
  } else {
    toast.showToast('error', 'Erreur', result.message || 'Impossible de supprimer l\'incident.')
  }
  deleting.value = false
  showDeleteConfirm.value = false
  incidentToDelete.value = null
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
