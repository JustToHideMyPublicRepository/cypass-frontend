<template>
  <div class="space-y-6">
    <!-- Header -->
    <MeWorkspaceHomeHeader @create="store.openModal()" />

    <!-- Workspace List (Loading + Grid) -->
    <MeWorkspaceHomeList v-if="store.loading || store.workspaces.length" :workspaces="store.workspaces"
      :active-workspace-id="store.activeWorkspaceId" :loading="store.loading" @edit="store.openModal"
      @setDefault="handleSetDefault" @delete="confirmDelete" />

    <!-- Empty State -->
    <MeWorkspaceHomeEmpty v-else @create="store.openModal()" />

    <!-- Modal de confirmation de suppression -->
    <UiConfirmModal :show="showDeleteConfirm" title="Supprimer le workspace"
      :message="`Êtes-vous sûr de vouloir supprimer '${workspaceToDelete?.name}' ? Les documents certifiés seront conservés mais rattachés à votre profil personnel.`"
      confirm-text="Supprimer définitivement" variant="danger" :loading="deleting" @cancel="showDeleteConfirm = false"
      @confirm="handleDelete" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useWorkspaceStore } from '~/stores/back/user/workspace'
import { useToastStore } from '~/stores/front/toast'
import type { Workspace } from '~/types/workspace'

const store = useWorkspaceStore()
const toast = useToastStore()

const showDeleteConfirm = ref(false)
const workspaceToDelete = ref<Workspace | null>(null)
const deleting = ref(false)

const confirmDelete = (ws: Workspace) => {
  workspaceToDelete.value = ws
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  if (!workspaceToDelete.value) return
  deleting.value = true
  const success = await store.deleteWorkspace(workspaceToDelete.value.id)
  if (success) {
    toast.showToast('success', 'Workspace supprimé', 'Le workspace a été archivé et supprimé de votre liste.')
    showDeleteConfirm.value = false
  } else {
    toast.showToast('error', 'Erreur', store.error || 'Impossible de supprimer le workspace.')
  }
  deleting.value = false
}

const handleSetDefault = async (id: string) => {
  const success = await store.setDefaultWorkspace(id)
  if (success) {
    toast.showToast('success', 'Workspace par défaut', 'Votre espace de travail par défaut a été mis à jour.')
  } else {
    toast.showToast('error', 'Erreur', store.error || 'Impossible de définir le workspace par défaut.')
  }
}

onMounted(async () => {
  if (!store.workspaces.length) {
    await store.fetchWorkspaces()
  }
})

useHead({
  title: 'Gérer les Workspaces',
  meta: [
    { name: 'description', content: 'Gérez vos espaces de travail, vos membres et vos configurations.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
