<template>
  <div class="relative min-h-[85vh] py-12 px-4">
    <div class="max-w-6xl mx-auto space-y-8">
      <UiBreadcrumbs :items="[
        { label: 'Accueil', path: '/' },
        { label: 'VigiTech', path: '/vigitech' },
        { label: decodeHtmlEntities(incident?.title || 'Détail de l\'incident') }
      ]" />

      <!-- UI States -->
      <RootVigitechDetailLoading v-if="store.loading && !incident" />

      <RootVigitechDetailError v-else-if="store.error" :message="store.error" @retry="fetchData" />

      <RootVigitechDetailNotFound v-else-if="!store.loading && !incident" />

      <!-- Content -->
      <div v-else-if="incident" class="animate-fade-in">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <!-- Left Column: Main Content -->
          <div class="lg:col-span-8 space-y-8">
            <div class="glass-panel p-8 md:p-12 rounded-[3.5rem] border border-ashAct space-y-8 shadow-xl">
              <RootVigitechDetailHeader :incident="incident" />
              <RootVigitechDetailContent :incident="incident" />
              <RootVigitechDetailComments :incident-id="incident.id" :comments="store.comments"
                :loading="store.loadingComments" />
            </div>
          </div>

          <!-- Right Column: Actions & Advice -->
          <div class="lg:col-span-4 space-y-6">
            <RootVigitechDetailSidebar :incident="incident" @fetch="fetchData" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVigitechStore } from '~/stores/vigitech'
import { decodeHtmlEntities } from '~/utils/format'

definePageMeta({
  layout: 'guest'
})

const route = useRoute()
const store = useVigitechStore()
const incident = computed(() => store.currentIncident)

const fetchData = () => {
  const id = route.params.id as string
  store.fetchPublicIncidentById(id)
  store.fetchComments(id)
}

onMounted(fetchData)

useHead({
  title: computed(() => incident.value ? `${incident.value.title} - Incident` : 'Détail de l\'incident')
})
</script>
