<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-BtW tracking-tight">Gestion des Workspaces</h1>
        <p class="text-hsa text-sm">Organisez vos espaces de travail, modifiez-les ou supprimez-les si nécessaire.</p>
      </div>
      <div class="flex items-center gap-3">
        <UiBaseButton @click="store.openModal()" variant="primary" size="sm">
          <IconPlus class="w-4 h-4 mr-2" /> Nouveau workspace
        </UiBaseButton>
        <NuxtLink to="/dashboard" class="inline-flex items-center gap-2 text-hsa hover:text-primary transition-colors font-medium text-sm">
          <IconArrowLeft class="w-4 h-4" />
          Retour
        </NuxtLink>
      </div>
    </div>

    <!-- Workspace Grid -->
    <div v-if="store.loading && !store.workspaces.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <UiBaseCard v-for="i in 6" :key="i" class="p-5">
        <div class="flex items-center gap-4">
          <UiAppSkeleton type="avatar" radius="16px" class="w-12 h-12" />
          <div class="flex-1 space-y-2">
            <UiAppSkeleton type="heading" width="60%" height="16px" />
            <UiAppSkeleton type="text" width="40%" height="10px" />
          </div>
        </div>
      </UiBaseCard>
    </div>

    <div v-else-if="store.workspaces.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <UiBaseCard v-for="ws in store.workspaces" :key="ws.id" 
        class="group/ws transition-all hover:shadow-xl hover:-translate-y-1 bg-ash/5 border-ash/30"
        :class="{ 'ring-2 ring-primary ring-offset-2 ring-offset-bgClr': ws.id === store.activeWorkspaceId }">
        <div class="p-5 space-y-4">
          <!-- Main Info -->
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-12 h-12 rounded-[1rem] overflow-hidden border border-ash bg-ash/10 shrink-0 shadow-sm">
                <img :src="getWorkspaceLogoUrl(ws.logo_url, ws.name)" :alt="ws.name" class="w-full h-full object-cover" />
              </div>
              <div class="min-w-0">
                <h3 class="text-base font-black text-BtW truncate leading-tight">{{ ws.name }}</h3>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-[10px] font-bold text-hsa/60 flex items-center gap-1">
                    <component :is="WORKSPACE_TYPE_CONFIG[ws.type].icon" class="w-3 h-3" />
                    {{ getWorkspaceTypeLabel(ws.type) }}
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Indicators -->
            <div class="flex flex-col items-end gap-1.5 shrink-0">
              <div v-if="ws.id === store.activeWorkspaceId" 
                class="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest">
                Actif
              </div>
              <div v-if="ws.status === 'default'"
                class="px-2 py-0.5 rounded-full bg-ash/20 text-hsa text-[9px] font-black uppercase tracking-widest">
                Par défaut
              </div>
            </div>
          </div>

          <!-- Quick Stats / Info -->
          <div class="grid grid-cols-2 gap-2 pt-2">
            <div class="p-2 rounded-lg bg-ash/20 text-center">
              <p class="text-[8px] font-black text-hsa uppercase tracking-[0.1em]">Membres</p>
              <p class="text-sm font-bold text-BtW">{{ ws.members_count || 1 }}</p>
            </div>
            <div class="p-2 rounded-lg bg-ash/20 text-center">
              <p class="text-[8px] font-black text-hsa uppercase tracking-[0.1em]">Rôle</p>
              <p class="text-[10px] font-bold text-BtW truncate">{{ getWorkspaceRoleLabel(ws.role) }}</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 pt-2 border-t border-ash/50 opacity-0 group-hover/ws:opacity-100 transition-opacity translate-y-1 group-hover/ws:translate-y-0 duration-300">
            <UiBaseButton @click="store.openModal(ws)" variant="ghost" size="xs" class="flex-1 !rounded-lg hover:!bg-primary/10 hover:text-primary !py-1.5">
              <IconEdit class="w-4 h-4 mr-1.5" /> Modifier
            </UiBaseButton>
            <UiBaseButton v-if="ws.role === 'owner'" @click="confirmDelete(ws)" variant="ghost" size="xs" 
              class="flex-1 !rounded-lg hover:!bg-danger/10 hover:text-danger !py-1.5 border-none">
              <IconTrash class="w-4 h-4 mr-1.5" /> Supprimer
            </UiBaseButton>
          </div>
        </div>
      </UiBaseCard>
    </div>

    <!-- Empty State -->
    <UiBaseCard v-else class="p-12 text-center space-y-4 border-dashed border-2 border-ash/30 bg-transparent">
      <div class="w-16 h-16 rounded-full bg-hsa/10 flex items-center justify-center mx-auto text-hsa">
        <IconPlus class="w-8 h-8" />
      </div>
      <div class="space-y-1">
        <h3 class="text-lg font-black text-BtW">Aucun workspace trouvé</h3>
        <p class="text-sm text-hsa max-w-sm mx-auto">
          C'est étrange, vous devriez avoir au moins un workspace personnel.
        </p>
      </div>
      <UiBaseButton @click="store.openModal()" variant="primary" size="sm" class="mt-4">
        Créer un workspace
      </UiBaseButton>
    </UiBaseCard>

    <!-- Modal de confirmation de suppression -->
    <UiConfirmModal 
      :show="showDeleteConfirm" 
      title="Supprimer le workspace"
      :message="`Êtes-vous sûr de vouloir supprimer '${workspaceToDelete?.name}' ? Les documents certifiés seront conservés mais rattachés à votre profil personnel.`"
      confirm-text="Supprimer définitivement"
      variant="danger"
      :loading="deleting"
      @cancel="showDeleteConfirm = false"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { IconPlus, IconArrowLeft, IconEdit, IconTrash, IconCheck, IconAlertTriangle } from '@tabler/icons-vue'
import { useWorkspaceStore } from '~/stores/back/user/workspace'
import { useToastStore } from '~/stores/front/toast'
import { getWorkspaceLogoUrl, getWorkspaceTypeLabel, getWorkspaceRoleLabel, WORKSPACE_TYPE_CONFIG } from '~/utils/workspace'
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

onMounted(() => {
  store.fetchWorkspaces()
})

useHead({
  title: 'Gérer les Workspaces — CYPASS',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
