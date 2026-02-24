<template>
  <div class="space-y-6">
    <UiBreadcrumbs :items="[
      { label: 'Tableau de bord', path: '/dashboard' },
      { label: 'VigiTech', path: '/dashboard/vigitech' },
      { label: decodeHtmlEntities(incident?.title || 'Détail') }
    ]" />

    <!-- Header -->
    <div class="flex items-center gap-4">
      <div>
        <h1 class="text-2xl font-black text-BtW">Détails du Signalement</h1>
        <p class="text-xs font-bold text-hsa uppercase tracking-widest">Référence: {{ route.params.id }}</p>
      </div>
    </div>

    <!-- Skeleton Loading -->
    <div v-if="store.loading" class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      <div class="lg:col-span-2 space-y-6">
        <UiAppSkeleton height="400px" radius="2.5rem" />
        <UiAppSkeleton height="200px" radius="2.5rem" />
      </div>
      <div class="space-y-6">
        <UiAppSkeleton height="150px" radius="2rem" />
        <UiAppSkeleton height="300px" radius="2rem" />
      </div>
    </div>

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
        <MeVigitechDetailComments :comments="store.comments" :loading="store.loadingComments" />
      </div>

      <!-- Right Sidebar -->
      <div class="space-y-6">
        <MeVigitechDetailSidebar :incident="incident" @success="fetchData" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconAlertCircle } from '@tabler/icons-vue'
import { useVigitechStore } from '~/stores/vigitech'
import { decodeHtmlEntities } from '~/utils/format'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const store = useVigitechStore()
const incident = computed(() => store.currentIncident)

const fetchData = () => {
  const id = route.params.id as string
  store.fetchUserIncidentById(id)
  store.fetchComments(id)
}

onMounted(fetchData)

useHead({
  title: computed(() => incident.value
    ? `${incident.value.title} - VigiTech`
    : 'Detail de l\'incident - VigiTech')
})
</script>
