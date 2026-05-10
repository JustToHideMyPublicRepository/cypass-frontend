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

    <div v-else-if="store.workspaces.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UiBaseCard v-for="ws in store.workspaces" :key="ws.id" 
        class="group/ws transition-all hover:shadow-xl border-ash/30 bg-WtB overflow-hidden relative"
        :class="{ 'ring-1 ring-primary/40 border-primary/20': ws.id === store.activeWorkspaceId }">
        
        <!-- Active Indicator Tip -->
        <div v-if="ws.id === store.activeWorkspaceId" class="absolute top-0 left-0 w-1 h-full bg-primary"></div>

        <div class="p-5 space-y-4">
          <!-- Header: Logo & Name -->
          <div class="flex items-center gap-3 min-w-0">
            <NuxtLink :to="`/dashboard/manage/workspace/${ws.id}`" class="w-11 h-11 rounded-xl overflow-hidden border border-ash bg-ash/10 shrink-0 shadow-sm block hover:ring-2 hover:ring-primary/20 transition-all">
              <img :src="getWorkspaceLogoUrl(ws.logo_url, ws.name)" :alt="ws.name" class="w-full h-full object-cover" />
            </NuxtLink>
            <div class="min-w-0 flex-1">
              <NuxtLink :to="`/dashboard/manage/workspace/${ws.id}`" class="text-sm font-black text-BtW truncate leading-tight hover:text-primary transition-colors block tracking-tight">
                {{ ws.name }}
              </NuxtLink>
              <div v-if="ws.status === 'default'" class="flex items-center gap-1 mt-0.5">
                <span class="text-[8px] font-black text-hsa uppercase tracking-widest bg-ash/20 px-1.2 py-0.2 rounded leading-none">Par défaut</span>
              </div>
            </div>
          </div>

          <!-- Attributes Line (Type, Role, Members) -->
          <div class="flex flex-wrap items-center gap-2">
            <!-- Type Badge -->
            <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-ash/10 border border-ash/20 text-[9px] font-bold text-hsa shadow-sm">
              <component :is="WORKSPACE_TYPE_CONFIG[ws.type || 'personal'].icon" class="w-2.5 h-2.5 text-primary" />
              {{ getWorkspaceTypeLabel(ws.type) }}
            </span>

            <!-- Role Badge -->
            <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-primary/5 border border-primary/10 text-[9px] font-bold text-primary shadow-sm uppercase tracking-wider">
              <component :is="WORKSPACE_ROLE_CONFIG[ws.role || 'reader']?.icon" class="w-2.5 h-2.5" />
              {{ getWorkspaceRoleLabel(ws.role) }}
            </span>

            <!-- Members Count -->
            <span class="text-[9px] font-bold text-hsa/60 ml-auto whitespace-nowrap">
              <IconUsers class="w-2.5 h-2.5 inline mr-1" />
              {{ ws.members_count || 1 }} {{ (ws.members_count || 1) > 1 ? 'membres' : 'membre' }}
            </span>
          </div>

          <!-- Actions (Inline) -->
          <div class="flex items-center gap-2 pt-3 border-t border-ash/30">
            <UiBaseButton @click="store.openModal(ws)" variant="ghost" size="xs" class="flex-1 !rounded-xl hover:!bg-primary/5 hover:text-primary !py-2 border border-ash/20 hover:border-primary/20 transition-all font-bold text-[10px]">
              <IconEdit class="w-3 h-3 mr-1.5" /> Modifier
            </UiBaseButton>
            <UiBaseButton v-if="ws.role === 'owner'" @click="confirmDelete(ws)" variant="ghost" size="xs" 
              class="flex-1 !rounded-xl hover:!bg-danger/5 hover:text-danger !py-2 border border-ash/20 hover:border-danger/20 transition-all font-bold text-hsa text-[10px]">
              <IconTrash class="w-3 h-3 mr-1.5" /> Supprimer
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
import { IconPlus, IconArrowLeft, IconEdit, IconTrash, IconCheck, IconAlertTriangle, IconUsers } from '@tabler/icons-vue'
import { useWorkspaceStore } from '~/stores/back/user/workspace'
import { useToastStore } from '~/stores/front/toast'
import { 
  getWorkspaceLogoUrl, getWorkspaceTypeLabel, getWorkspaceRoleLabel, 
  WORKSPACE_TYPE_CONFIG, WORKSPACE_ROLE_CONFIG 
} from '~/utils/workspace'
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
