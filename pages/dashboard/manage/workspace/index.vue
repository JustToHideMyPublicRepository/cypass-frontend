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

    <div v-else-if="store.workspaces.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <UiBaseCard v-for="ws in store.workspaces" :key="ws.id" 
        class="group/ws transition-all hover:shadow-md border-ash/30 bg-WtB p-3 relative overflow-hidden"
        :class="{ 'ring-1 ring-primary/40 !bg-primary/5': ws.id === store.activeWorkspaceId }">
        
        <!-- Active Indicator -->
        <div v-if="ws.id === store.activeWorkspaceId" class="absolute top-0 right-0 w-8 h-8">
           <div class="absolute top-0 right-0 w-0 h-0 border-t-[32px] border-l-[32px] border-t-primary border-l-transparent opacity-10"></div>
           <IconCheck class="absolute top-1 right-1 w-3 h-3 text-primary" />
        </div>

        <div class="flex items-center gap-3">
          <!-- Logo -->
          <NuxtLink :to="`/dashboard/manage/workspace/${ws.id}`" 
            class="w-10 h-10 rounded-xl overflow-hidden border border-ash bg-ash/10 shrink-0 shadow-sm block hover:ring-2 hover:ring-primary/20 transition-all">
            <img :src="getWorkspaceLogoUrl(ws.logo_url, ws.name)" :alt="ws.name" class="w-full h-full object-cover" />
          </NuxtLink>

          <!-- Info -->
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-1.5 overflow-hidden">
              <NuxtLink :to="`/dashboard/manage/workspace/${ws.id}`" 
                class="text-xs font-bold text-BtW truncate leading-tight hover:text-primary transition-colors block tracking-tight">
                {{ ws.name }}
              </NuxtLink>
              <IconStarFilled v-if="ws.is_default" class="w-2.5 h-2.5 text-warning shrink-0" />
            </div>

            <div class="flex items-center gap-2 mt-1">
              <span class="inline-flex items-center gap-1 text-[9px] font-bold text-hsa uppercase tracking-tighter">
                <component :is="WORKSPACE_TYPE_CONFIG[ws.type || 'personal'].icon" class="w-2.5 h-2.5 text-primary opacity-70" />
                {{ getWorkspaceTypeLabel(ws.type).split(' ')[0] }}
              </span>

              <span class="inline-flex items-center gap-1 text-[9px] font-bold text-primary/80 uppercase tracking-tighter">
                <component :is="WORKSPACE_ROLE_CONFIG[ws.role || 'reader']?.icon" class="w-2.5 h-2.5" />
                {{ getWorkspaceRoleLabel(ws.role).split(' ')[0] }}
              </span>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="flex items-center gap-1 shrink-0">
             <button @click="store.openModal(ws)" class="p-1.5 rounded-lg hover:bg-primary/10 text-hsa hover:text-primary transition-colors" title="Modifier">
                <IconEdit class="w-3.5 h-3.5" />
             </button>
             <button v-if="!ws.is_default" @click="handleSetDefault(ws.id)" class="p-1.5 rounded-lg hover:bg-warning/10 text-hsa hover:text-warning transition-colors" title="Par défaut">
                <IconStar class="w-3.5 h-3.5" />
             </button>
             <button v-if="ws.role === 'owner' && !ws.is_default" @click="confirmDelete(ws)" class="p-1.5 rounded-lg hover:bg-danger/10 text-hsa hover:text-danger transition-colors" title="Supprimer">
                <IconTrash class="w-3.5 h-3.5" />
             </button>
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
    <UiConfirmModal :show="showDeleteConfirm" title="Supprimer le workspace"
      :message="`Êtes-vous sûr de vouloir supprimer '${workspaceToDelete?.name}' ? Les documents certifiés seront conservés mais rattachés à votre profil personnel.`"
      confirm-text="Supprimer définitivement" variant="danger" :loading="deleting" @cancel="showDeleteConfirm = false"
      @confirm="handleDelete" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { IconPlus, IconArrowLeft, IconEdit, IconTrash, IconCheck, IconAlertTriangle, IconUsers, IconStar, IconStarFilled } from '@tabler/icons-vue'
import { useWorkspaceStore } from '~/stores/back/user/workspace'
import { useToastStore } from '~/stores/front/toast'
import { getWorkspaceLogoUrl, getWorkspaceTypeLabel, getWorkspaceRoleLabel, WORKSPACE_TYPE_CONFIG, WORKSPACE_ROLE_CONFIG } from '~/utils/workspace'
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
