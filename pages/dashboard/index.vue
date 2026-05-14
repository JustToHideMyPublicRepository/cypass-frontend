<template>
  <div class="flex flex-col items-center justify-center p-6 relative overflow-hidden">
    <div class="max-w-5xl w-full space-y-12 relative z-10">
      <!-- En-tête -->
      <MeHomeHeader v-if="!wsStore.loading || wsStore.workspaces.length" :user-name="authStore.user?.first_name" />

      <!-- États de chargement (Skeletons) -->
      <MeHomeLoading v-if="wsStore.loading && !wsStore.workspaces.length" />

      <!-- Liste des Workspaces -->
      <MeHomeWorkspaceList v-else-if="wsStore.workspaces.length" :workspaces="wsStore.workspaces"
        :active-id="wsStore.activeWorkspaceId" :switching-id="switchingId" @select="selectWorkspace"
        @create="wsStore.openModal()" />

      <!-- Aucun workspace -->
      <MeHomeEmptyState v-else-if="!wsStore.loading" @create="wsStore.openModal()" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useWorkspaceStore } from '~/stores/back/user/workspace'
import { useAuthStore } from '~/stores/back/user/auth'
import type { Workspace } from '~/types/workspace'

const wsStore = useWorkspaceStore()
const authStore = useAuthStore()
const router = useRouter()
const switchingId = ref<string | null>(null)

useHead({
  title: 'Vos espaces',
  meta: [
    { name: 'description', content: 'Choisissez votre espace de travail pour accéder au tableau de bord.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Initialisation
onMounted(async () => {
  // On s'assure d'avoir les workspaces
  if (!wsStore.workspaces.length) {
    await wsStore.fetchWorkspaces()
  }

  // Redirection automatique seulement si on a un seul workspace et qu'il est déjà défini
  if (wsStore.workspaces.length === 1 && wsStore.activeWorkspace?.slug) {
    const targetSlug = wsStore.activeWorkspace.slug
    setTimeout(() => {
      router.replace(`/dashboard/${targetSlug}/docsentry`)
    }, 1000)
  }
})

// Sélection manuelle
const selectWorkspace = async (ws: Workspace) => {
  if (switchingId.value) return
  switchingId.value = ws.id

  // Effet de feedback visuel
  await new Promise(resolve => setTimeout(resolve, 600))

  wsStore.setActiveWorkspace(ws)
  if (ws.slug) {
    router.push(`/dashboard/${ws.slug}/docsentry`)
  } else {
    // Fallback si slug manquant (ne devrait pas arriver)
    router.push('/dashboard/profile')
  }
  switchingId.value = null
}
</script>
