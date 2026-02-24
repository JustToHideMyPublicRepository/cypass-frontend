<template>
  <div class="relative min-h-[85vh] py-12 px-4">
    <div class="max-w-6xl mx-auto space-y-8">
      <UiBreadcrumbs :items="[
        { label: 'Accueil', path: '/' },
        { label: 'VigiTech', path: '/vigitech' },
        { label: decodeHtmlEntities(incident?.title || 'Détail de l\'incident') }
      ]" />

      <!-- Skeleton Loading -->
      <div v-if="store.loading" class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div class="lg:col-span-8 space-y-8">
          <div class="glass-panel p-8 md:p-12 rounded-[3.5rem] border border-ashAct space-y-8 shadow-xl bg-ash/5">
            <div class="space-y-6">
              <div class="flex items-center gap-3">
                <UiAppSkeleton width="80px" height="24px" radius="99px" />
                <UiAppSkeleton width="120px" height="24px" radius="99px" />
              </div>
              <UiAppSkeleton width="80%" height="48px" radius="1rem" />
              <div class="flex gap-6">
                <UiAppSkeleton width="150px" height="20px" />
                <UiAppSkeleton width="150px" height="20px" />
              </div>
            </div>
            <div class="h-px bg-ashAct/50"></div>
            <div class="space-y-4">
              <UiAppSkeleton width="100px" height="12px" />
              <UiAppSkeleton :count="4" height="16px" />
            </div>
          </div>
        </div>
        <div class="lg:col-span-4 space-y-6">
          <UiAppSkeleton height="200px" radius="2.5rem" />
          <UiAppSkeleton height="150px" radius="2.5rem" />
        </div>
      </div>

      <div v-else-if="store.error" class="py-24 text-center space-y-8 animate-fade-in max-w-lg mx-auto">
        <div class="relative inline-block">
          <div class="absolute inset-0 bg-danger/20 blur-3xl rounded-full"></div>
          <IconAlertCircle class="w-20 h-20 text-danger relative z-10 mx-auto" />
        </div>
        <div class="space-y-4">
          <h2 class="text-3xl font-black text-BtW tracking-tighter">Oups ! Une erreur est survenue</h2>
          <p class="text-hsa font-medium leading-relaxed">
            {{ store.error.includes('404') ? 'Cet incident n\'existe plus ou n\'est pas accessible publiquement.' :
              'Nous rencontrons des difficultés techniques pour récupérer les détails de cet incident.' }}
          </p>
        </div>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <UiBaseButton variant="primary" @click="fetchData" class="w-full sm:w-auto">
            Réessayer
          </UiBaseButton>
          <NuxtLink to="/vigitech" class="w-full sm:w-auto">
            <UiBaseButton variant="ghost" class="w-full">
              Retourner à la liste
            </UiBaseButton>
          </NuxtLink>
        </div>
      </div>

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

      <div v-else-if="!store.loading && !incident" class="text-center py-32 space-y-6 animate-fade-in max-w-lg mx-auto">
        <IconAlertCircle class="w-16 h-16 text-danger mx-auto opacity-20" />
        <div class="space-y-2">
          <h3 class="text-2xl font-black text-BtW">Incident introuvable</h3>
          <p class="text-hsa font-bold">Ce signalement n'existe pas ou a été retiré pour des raisons de sécurité.</p>
        </div>
        <NuxtLink to="/vigitech" class="block">
          <UiBaseButton variant="ghost">Retourner à la liste</UiBaseButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconAlertCircle } from '@tabler/icons-vue'
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
