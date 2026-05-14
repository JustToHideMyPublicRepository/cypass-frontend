<template>
  <div class="max-w-6xl mx-auto space-y-8 animate-fade-in">
    <!-- Header / Navigation -->
    <MeWorkspaceDetailHeader :workspace="workspace" @delete="confirmDelete" @edit="store.openModal" />

    <!-- Loading State -->
    <MeWorkspaceDetailLoading v-if="loading" />

    <!-- Content -->
    <div v-else-if="workspace && !loading" class="space-y-8">
      <!-- Hero / Banner Section -->
      <MeWorkspaceDetailHero :workspace="workspace" />

      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Active Status Badge -->
          <div v-if="workspace.id === store.activeWorkspaceId"
            class="flex items-center gap-4 p-4 rounded-3xl bg-primary/5 border border-primary/20">
            <div
              class="w-10 h-10 rounded-2xl bg-primary text-WtB flex items-center justify-center shadow-lg shadow-primary/20">
              <IconCheck class="w-6 h-6" />
            </div>
            <div>
              <h5>Espace Actuel</h5>
              <p>Vous travaillez actuellement dans cet espace de travail.</p>
            </div>
          </div>

          <!-- Stats Cards -->
          <MeWorkspaceDetailStats :workspace="workspace" :members-count="members.length" />

          <MeWorkspaceDetailInfo :workspace="workspace" />
        </div>

        <div class="space-y-8">
          <MeWorkspaceDetailActions :workspace="workspace" :is-active="workspace.id === store.activeWorkspaceId"
            :default-loading="defaultLoading" @activate="store.setActiveWorkspace" @setDefault="handleSetDefault" />

          <MeWorkspaceDetailMembers :workspace="workspace" :members="members" />
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <MeWorkspaceDetailNotFound v-else-if="!loading" />

    <!-- Modal de confirmation de suppression -->
    <UiConfirmModal :show="showDeleteConfirm" title="Supprimer le workspace"
      :message="`Êtes-vous sûr de vouloir supprimer '${workspace?.name}' ? Les documents certifiés seront conservés mais rattachés à votre profil personnel.`"
      confirm-text="Supprimer définitivement" variant="danger" :loading="deleting" @cancel="showDeleteConfirm = false"
      @confirm="handleDelete" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { IconCheck } from '@tabler/icons-vue'
import { useWorkspaceStore } from '~/stores/back/user/workspace'
import { useToastStore } from '~/stores/front/toast'
import type { Workspace, WorkspaceMember } from '~/types/workspace'

const route = useRoute()
const store = useWorkspaceStore()
const toast = useToastStore()
const loading = ref(true)
const workspace = ref<Workspace | null>(null)
const members = ref<WorkspaceMember[]>([])

const showDeleteConfirm = ref(false)
const deleting = ref(false)
const defaultLoading = ref(false)

const confirmDelete = () => {
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  if (!workspace.value) return
  deleting.value = true
  const success = await store.deleteWorkspace(workspace.value.id)
  if (success) {
    toast.showToast('success', 'Workspace supprimé', 'Le workspace a été archivé et supprimé de votre liste.')
    showDeleteConfirm.value = false
    await useRouter().push('/dashboard/manage/workspace')
  } else {
    toast.showToast('error', 'Erreur', store.error || 'Impossible de supprimer le workspace.')
  }
  deleting.value = false
}

const fetchDetails = async () => {
  loading.value = true
  const id = route.params.id as string

  const success = await store.fetchWorkspaceById(id)
  if (success && store.currentDetail) {
    workspace.value = store.currentDetail.workspace
    members.value = store.currentDetail.members
  } else {
    workspace.value = null
    members.value = []
  }
  loading.value = false
}

const handleSetDefault = async (id: string) => {
  defaultLoading.value = true
  const success = await store.setDefaultWorkspace(id)
  if (success) {
    await fetchDetails()
  }
  defaultLoading.value = false
}

// Sync with store updates (after workspace edit via modal)
watch(() => store.currentDetail, (detail) => {
  if (detail) {
    workspace.value = detail.workspace
    members.value = detail.members
  }
}, { deep: true })

onMounted(() => {
  fetchDetails()
})

useHead({
  title: computed(() => `${workspace.value?.name || 'Workspace'}`),
  meta: [
    { name: 'description', content: 'Informations détaillées et configuration de l\'espace de travail.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
