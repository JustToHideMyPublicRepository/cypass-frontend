<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-BtW">Corbeille des incidents</h1>
        <p class="text-hsa text-sm">Gérez vos signalements supprimés. Ils seront définitivement effacés après 7 jours.
        </p>
      </div>
      <div class="flex flex-row md:flex-col md:items-end items-center gap-3">
        <UiBaseButton v-if="store.trashedIncidents.length" @click="confirmRestoreAll" :loading="restoringAll"
          variant="primary" size="sm">
          <IconRotate class="w-4 h-4 mr-2" /> Tout restaurer
        </UiBaseButton>
        <NuxtLink to="/dashboard/vigitech"
          class="inline-flex items-center gap-2 text-primary hover:underline font-medium text-sm">
          <IconArrowLeft class="w-4 h-4" />
          Retour à la liste
        </NuxtLink>
      </div>
    </div>

    <!-- Content -->
    <div v-if="store.loading && !store.trashedIncidents.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UiBaseCard v-for="i in 4" :key="i" class="p-4">
        <div class="flex gap-4">
          <UiAppSkeleton type="avatar" radius="12px" />
          <div class="flex-1 space-y-2">
            <UiAppSkeleton type="text" width="40%" height="8px" />
            <UiAppSkeleton type="heading" width="80%" height="20px" />
            <UiAppSkeleton type="text" :count="1" />
          </div>
        </div>
      </UiBaseCard>
    </div>

    <div v-else-if="store.trashedIncidents.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UiBaseCard v-for="incident in store.trashedIncidents" :key="incident.id"
        class="border-l-4 border-l-ash bg-ash/5 transition-all hover:shadow-lg">
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div class="flex gap-4 flex-1 min-w-0">
            <!-- Icon Block -->
            <div class="shrink-0 pt-1">
              <div class="w-12 h-12 rounded-xl bg-hsa/10 flex items-center justify-center text-hsa">
                <IconTrash class="w-6 h-6" />
              </div>
            </div>

            <div class="space-y-1 flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <span class="custum-badge bg-ash/10 text-hsa">
                  {{ mapIncidentType(incident.type) }}
                </span>
                <UiStatusBadge :status="incident.threat_level === 'critical' ? 'High' : 'Medium'">
                  {{ mapThreatLevel(incident.threat_level) }}
                </UiStatusBadge>
                <div v-if="incident.deleted_at" class="text-[10px] font-bold text-danger uppercase tracking-wider">
                  Supprimé {{ formatRelativeTime(incident.deleted_at) }}
                </div>
              </div>

              <h3 class="text-base font-black text-BtW truncate">
                {{ incident.title }}
              </h3>
              <p class="text-xs text-hsa line-clamp-1 leading-relaxed">
                {{ incident.description }}
              </p>
            </div>
          </div>

          <div class="flex shrink-0 gap-2 items-center">
            <UiBaseButton @click="handleRestore(incident.id)" :disabled="!!localProcessingId" variant="secondary"
              size="sm" class="!px-3 min-w-[110px]">
              <template v-if="localProcessingId === incident.id">
                <UiLogoLoader size="xs" class="mr-2" /> Restaurer...
              </template>
              <template v-else>
                <IconRotate class="w-4 h-4 mr-2" /> Restaurer
              </template>
            </UiBaseButton>
          </div>
        </div>
      </UiBaseCard>
    </div>

    <!-- Empty State -->
    <UiBaseCard v-else class="p-12 text-center space-y-4 border-dashed border-2 border-ash/30 bg-transparent">
      <div class="w-16 h-16 rounded-full bg-hsa/10 flex items-center justify-center mx-auto text-hsa">
        <IconTrashOff class="w-8 h-8" />
      </div>
      <div class="space-y-1">
        <h3 class="text-lg font-black text-BtW">Votre corbeille est vide</h3>
        <p class="text-sm text-hsa max-w-sm mx-auto">
          Les incidents que vous supprimez apparaîtront ici pendant 7 jours avant d'être définitivement effacés.
        </p>
      </div>
      <UiBaseButton to="/dashboard/vigitech" variant="primary" size="sm" class="mt-4">
        Retourner aux incidents
      </UiBaseButton>
    </UiBaseCard>

    <!-- Modals -->
    <UiConfirmModal :show="showRestoreConfirm" title="Restaurer tous les incidents"
      message="Voulez-vous restaurer tous les incidents présents dans la corbeille ?" confirm-text="Restaurer tout"
      :loading="restoringAll" variant="primary" @cancel="showRestoreConfirm = false" @confirm="handleRestoreAll" />
  </div>
</template>

<script setup lang="ts">
import { IconTrash, IconRotate, IconTrashOff, IconArrowLeft } from '@tabler/icons-vue'
import { useUserVigitechStore } from '~/stores/back/user/vigitech'
import { useToastStore } from '~/stores/front/toast'
import { mapIncidentType, mapThreatLevel } from '~/utils/vigitech'
import { formatRelativeTime } from '~/utils/date'

const store = useUserVigitechStore()
const toast = useToastStore()

const restoringAll = ref(false)
const localProcessingId = ref<string | null>(null)
const showRestoreConfirm = ref(false)

const handleRestore = async (id: string) => {
  localProcessingId.value = id
  const result = await store.restoreIncident(id)
  if (result.success) {
    toast.showToast('success', 'Incident restauré', 'L\'incident a été remis dans la liste principale.')
  } else {
    toast.showToast('error', 'Erreur', result.message || 'Impossible de restaurer l\'incident.')
  }
  localProcessingId.value = null
}

const confirmRestoreAll = () => {
  showRestoreConfirm.value = true
}

const handleRestoreAll = async () => {
  restoringAll.value = true
  const result = await store.restoreAllIncidents()
  if (result.success) {
    toast.showToast('success', 'Restauration complète', 'Tous les incidents ont été restaurés.')
    showRestoreConfirm.value = false
  } else {
    toast.showToast('error', 'Erreur', result.message || 'Impossible de tout restaurer.')
  }
  restoringAll.value = false
}

onMounted(() => {
  store.fetchTrashedIncidents()
})

useHead({
  title: 'Corbeille Vigitech',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

<style scoped>
.custum-badge {
  @apply px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest;
}
</style>
