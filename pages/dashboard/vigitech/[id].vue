<template>
  <div class="space-y-6">
    <!-- Header -->
    <MeVigitechDetailHero :incident="incident" />

    <!-- Loading States -->
    <MeVigitechDetailLoading v-if="store.loading && !incident" />

    <div v-else-if="store.error" class="glass-panel p-12 rounded-[2rem] text-center">
      <IconAlertCircle class="w-12 h-12 text-danger mx-auto mb-4" />
      <p class="text-BtW font-bold">{{ store.error }}</p>
      <UiBaseButton variant="ghost" class="mt-4" @click="fetchData">Réessayer</UiBaseButton>
    </div>

    <div v-else-if="incident" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Info -->
      <div class="lg:col-span-2 space-y-6">
        <UiBaseCard class="!rounded-[2.5rem] overflow-hidden">
          <MeVigitechDetailHeader :incident="incident" />
          <MeVigitechDetailContent :incident="incident" />
        </UiBaseCard>

        <!-- Comments Section -->
        <MeVigitechDetailComments :incidentId="incident.id" :comments="store.comments"
          :loading="store.loadingComments" />
      </div>

      <div class="space-y-6">
        <MeVigitechDetailSidebar :incident="incident" @success="fetchData" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVigitechStore } from '~/stores/vigitech'
import { useVigiPrefStore } from '~/stores/vigiPref'
import { IconAlertCircle } from '@tabler/icons-vue'

const route = useRoute()
const store = useVigitechStore()
const settingsStore = useVigiPrefStore()

const incident = computed(() => store.currentIncident)

const fetchData = async () => {
  const id = route.params.id as string
  await store.fetchUserIncidentById(id)
  await store.fetchComments(id)
}

onMounted(async () => {
  settingsStore.loadFromLocalStorage()
  await fetchData()
})

useHead({
  title: computed(() => incident.value
    ? `${incident.value.title} - VigiTech`
    : 'Detail de l\'incident - VigiTech'),
  meta: [
    { name: 'description', content: 'Analyse détaillée et suivi de l\'incident sur la plateforme de veille VigiTech.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
