<template>
  <div class="max-w-6xl mx-auto space-y-8 animate-fade-in">
    <!-- Header / Navigation -->
    <div class="flex items-center justify-between">
      <NuxtLink to="/dashboard/manage/workspace"
        class="group flex items-center gap-2 text-hsa hover:text-primary transition-all font-bold text-sm bg-ash/10 px-4 py-2 rounded-xl border border-ash/20">
        <IconArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Retour à la liste
      </NuxtLink>

      <div v-if="workspace" class="flex items-center gap-3">
        <button v-if="workspace.role === 'owner' && !workspace.is_default" @click="confirmDelete"
          class="p-2 rounded-xl hover:bg-danger/10 text-hsa hover:text-danger transition-colors" title="Supprimer">
          <IconTrash class="w-5 h-5" />
        </button>
        <UiBaseButton @click="store.openModal(workspace)" variant="primary" size="sm"
          class="!rounded-xl shadow-lg shadow-primary/20">
          <IconEdit class="w-4 h-4 mr-2" /> Modifier le profil
        </UiBaseButton>
      </div>
    </div>

    <div v-if="loading" class="space-y-8">
      <UiAppSkeleton type="rect" width="100%" height="240px" class="!rounded-[2.5rem]" />
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          <UiAppSkeleton v-for="i in 2" :key="i" type="rect" width="100%" height="150px" class="!rounded-[2.5rem]" />
        </div>
        <UiAppSkeleton type="rect" width="100%" height="400px" class="!rounded-[2.5rem]" />
      </div>
    </div>

    <div v-else-if="workspace && !loading" class="space-y-8">
      <!-- Hero / Banner Section -->
      <div class="relative group">
        <div
          class="h-48 md:h-64 rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-secondary/5 to-bgClr border border-ash/30 overflow-hidden relative shadow-2xl shadow-ash/10">
          <!-- Abstract Background Pattern -->
          <div class="absolute inset-0 opacity-20 pointer-events-none">
            <div class="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
            <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"></div>
          </div>

          <div class="absolute bottom-8 left-10 flex items-end gap-6 w-full pr-20">
            <!-- Large Logo -->
            <div
              class="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] border-4 border-bgClr bg-WtB shadow-2xl overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500">
              <img :src="getWorkspaceLogoUrl(workspace.logo_url, workspace.name)" :alt="workspace.name"
                class="w-full h-full object-cover" />
            </div>
            <!-- Identity -->
            <div class="pb-2 space-y-2 flex-1 min-w-0">
              <h1 class="text-3xl md:text-5xl font-black text-BtW tracking-tight truncate">{{ workspace.name }}</h1>
              <div class="flex flex-wrap items-center gap-3">
                <span
                  class="px-3 py-1 rounded-xl bg-ash/20 backdrop-blur-md text-[10px] font-bold text-hsa border border-ash/30 uppercase tracking-widest">
                  <component :is="WORKSPACE_TYPE_CONFIG[workspace.type || 'personal'].icon"
                    class="w-3.5 h-3.5 inline mr-1.5 text-primary" />
                  {{ getWorkspaceTypeLabel(workspace.type) }}
                </span>
                <span
                  class="px-3 py-1 rounded-xl bg-primary/10 backdrop-blur-md text-[10px] font-bold text-primary border border-primary/20 uppercase tracking-widest">
                  <component :is="WORKSPACE_ROLE_CONFIG[workspace.role || 'reader'].icon"
                    class="w-3.5 h-3.5 inline mr-1.5" />
                  {{ getWorkspaceRoleLabel(workspace.role) }}
                </span>
                <span v-if="workspace.members_count"
                  class="px-3 py-1 rounded-xl bg-ash/20 backdrop-blur-md text-[10px] font-bold text-hsa border border-ash/30 uppercase tracking-widest">
                  <IconUsers class="w-3.5 h-3.5 inline mr-1.5" />
                  {{ workspace.members_count }} {{ workspace.members_count > 1 ? 'membres' : 'membre' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Quick Status Card (If active) -->
          <div v-if="workspace.id === store.activeWorkspaceId"
            class="flex items-center gap-4 p-4 rounded-3xl bg-primary/5 border border-primary/20">
            <div
              class="w-10 h-10 rounded-2xl bg-primary text-WtB flex items-center justify-center shadow-lg shadow-primary/20">
              <IconCheck class="w-6 h-6" />
            </div>
            <div>
              <p class="text-xs font-black text-primary uppercase tracking-widest">Espace Actuel</p>
              <p class="text-sm text-BtW/70">Vous travaillez actuellement dans cet espace de travail.</p>
            </div>
          </div>

          <!-- Stats Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div
              class="p-6 rounded-[2rem] bg-WtB border border-ash/30 shadow-sm hover:shadow-xl transition-all group/stat">
              <div
                class="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-6 border border-primary/10 group-hover/stat:bg-primary group-hover/stat:text-WtB transition-all">
                <IconUsers class="w-6 h-6" />
              </div>
              <p class="text-[10px] font-black text-hsa uppercase tracking-[0.25em] mb-1">Membres Actifs</p>
              <h3 class="text-3xl font-black text-BtW">{{ workspace.members_count || 1 }}</h3>
            </div>
            <div v-if="workspace.country"
              class="p-6 rounded-[2rem] bg-WtB border border-ash/30 shadow-sm hover:shadow-xl transition-all group/stat">
              <div
                class="w-12 h-12 rounded-2xl bg-secondary/5 flex items-center justify-center text-secondary mb-6 border border-secondary/10 group-hover/stat:bg-secondary group-hover/stat:text-WtB transition-all">
                <IconMapPin class="w-6 h-6" />
              </div>
              <p class="text-[10px] font-black text-hsa uppercase tracking-[0.25em] mb-1">Siège Social</p>
              <h3 class="text-3xl font-black text-BtW truncate">{{ workspace.country }}</h3>
            </div>
            <div
              class="p-6 rounded-[2rem] bg-WtB border border-ash/30 shadow-sm hover:shadow-xl transition-all group/stat">
              <div
                class="w-12 h-12 rounded-2xl bg-warning/5 flex items-center justify-center text-warning mb-6 border border-warning/10 group-hover/stat:bg-warning group-hover/stat:text-WtB transition-all">
                <IconCalendar class="w-6 h-6" />
              </div>
              <p class="text-[10px] font-black text-hsa uppercase tracking-[0.25em] mb-1">Création</p>
              <h3 class="text-lg font-black text-BtW">{{ new Date(workspace.created_at).toLocaleDateString(undefined, {
                month: 'long', year: 'numeric' }) }}</h3>
            </div>
          </div>

          <!-- Legal & Detailed Info -->
          <UiBaseCard class="p-10 border-ash/30 relative overflow-hidden group/legal rounded-[2.5rem]">
            <div
              class="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-bl-full translate-x-16 -translate-y-16 group-hover/legal:scale-125 transition-transform duration-700">
            </div>

            <div class="relative space-y-8">
              <div class="flex items-center gap-4 pb-6 border-b border-ash/10">
                <div class="p-3 bg-ash/10 rounded-2xl">
                  <IconBuildingSkyscraper class="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 class="text-xl font-black text-BtW tracking-tight">Informations Structurelles</h3>
                  <p class="text-xs text-hsa font-medium">Détails administratifs et identifiants du workspace.</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div class="space-y-6">
                  <div class="flex flex-col gap-2">
                    <span class="text-[10px] font-black text-hsa uppercase tracking-widest flex items-center gap-2">
                      <IconFingerprint class="w-3.5 h-3.5" /> ID Systémique
                    </span>
                    <div
                      class="group/id flex items-center justify-between bg-ash/5 border border-ash/10 p-3 rounded-2xl hover:bg-ash/10 transition-all">
                      <code class="text-xs font-mono text-BtW select-all">{{ workspace.id }}</code>
                      <IconClick class="w-4 h-4 text-hsa opacity-0 group-hover/id:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <div class="flex flex-col gap-1">
                    <span class="text-[10px] font-black text-hsa uppercase tracking-widest">Enregistré le</span>
                    <span class="text-sm font-bold text-BtW">{{ new Date(workspace.created_at).toLocaleString()
                      }}</span>
                  </div>
                </div>

                <div v-if="workspace.rccm || workspace.ifu" class="space-y-8">
                  <div v-if="workspace.rccm"
                    class="flex flex-col gap-2 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                    <span class="text-[10px] font-black text-primary uppercase tracking-widest">Immatriculation
                      RCCM</span>
                    <div class="flex items-center gap-3">
                      <IconFileText class="w-5 h-5 text-primary/60" />
                      <span class="text-lg font-black text-BtW tracking-tight">{{ workspace.rccm }}</span>
                    </div>
                  </div>
                  <div v-if="workspace.ifu"
                    class="flex flex-col gap-2 p-4 rounded-2xl bg-secondary/5 border border-secondary/10">
                    <span class="text-[10px] font-black text-secondary uppercase tracking-widest">Identifiant IFU</span>
                    <div class="flex items-center gap-3">
                      <IconFingerprint class="w-5 h-5 text-secondary/60" />
                      <span class="text-lg font-black text-BtW tracking-tight">{{ workspace.ifu }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </UiBaseCard>
        </div>

        <!-- Sidebar Actions & Members -->
        <div class="space-y-8">
          <!-- Active Status & Quick Switch -->
          <div v-if="workspace.id !== store.activeWorkspaceId"
            class="p-8 rounded-[2.5rem] bg-WtB border border-ash/30 shadow-xl shadow-ash/5 relative overflow-hidden group/switch">
            <div
              class="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-20 group-hover:opacity-100 transition-opacity">
            </div>

            <div class="flex items-center justify-between mb-8">
              <div
                class="w-14 h-14 rounded-2xl bg-ash/10 flex items-center justify-center text-hsa shadow-inner border border-ash/20">
                <IconRocket class="w-7 h-7 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
              <span class="text-[10px] font-black text-hsa uppercase tracking-[0.3em]">Activation</span>
            </div>

            <h4 class="text-2xl font-black text-BtW mb-4 tracking-tight leading-tight">Envie de basculer ?</h4>
            <p class="text-sm text-hsa mb-8 leading-relaxed font-medium">
              Ce workspace n'est pas votre espace de travail actuel. Toutes vos certifications et dossiers iront ici si
              vous l'activez.
            </p>

            <UiBaseButton @click="store.setActiveWorkspace(workspace)" variant="primary"
              class="w-full !py-4 shadow-2xl shadow-primary/20 font-black !rounded-2xl transition-all transform hover:scale-[1.02] active:scale-95 mb-3">
              Activer maintenant
            </UiBaseButton>

            <UiBaseButton v-if="!workspace.is_default" @click="handleSetDefault(workspace.id)" variant="ghost"
              class="w-full !py-3 border border-warning/30 text-warning hover:bg-warning/5 font-bold !rounded-2xl transition-all">
              <IconStar class="w-4 h-4 mr-2" /> Définir par défaut
            </UiBaseButton>
            <div v-else
              class="w-full py-3 flex items-center justify-center gap-2 bg-warning/5 border border-warning/20 rounded-2xl text-warning font-black text-xs uppercase tracking-widest">
              <IconStarFilled class="w-4 h-4" /> Workspace par défaut
            </div>
          </div>

          <!-- Members List Preview -->
          <UiBaseCard class="p-8 border-ash/30 shadow-sm rounded-[2.5rem]">
            <div class="flex items-center justify-between mb-8">
              <div class="flex items-center gap-2">
                <IconUsers class="w-5 h-5 text-primary" />
                <h3 class="text-sm font-black text-BtW uppercase tracking-widest">Membres</h3>
              </div>
              <NuxtLink to="#"
                class="text-[10px] font-black text-primary hover:bg-primary/5 px-2 py-1 rounded-lg transition-colors">
                VOIR TOUT</NuxtLink>
            </div>

            <div class="space-y-4">
              <!-- Mock Members for UI Preview -->
              <div v-for="i in Math.min(workspace.members_count || 1, 3)" :key="i"
                class="flex items-center gap-3 p-4 rounded-2xl bg-ash/5 border border-ash/10 group/item hover:bg-WtB hover:shadow-md transition-all cursor-default">
                <div
                  class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-xs font-black text-primary border border-ash/20 group-hover/item:scale-110 transition-transform">
                  {{ i === 1 ? 'AD' : (i === 2 ? 'JD' : 'MK') }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-black text-BtW truncate">{{ i === 1 ? 'Administrateur' : 'Membre' }}</p>
                  <p class="text-[10px] text-hsa font-bold uppercase tracking-tighter">{{ workspace.role === 'owner' &&
                    i === 1 ? 'Propriétaire' : 'Collaborateur' }}</p>
                </div>
              </div>

              <UiBaseButton variant="ghost"
                class="w-full !rounded-2xl !py-4 border-2 border-dashed border-ash/30 text-hsa hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all text-xs font-black uppercase tracking-widest">
                <IconUserPlus class="w-4 h-4 mr-3" /> Inviter
              </UiBaseButton>
            </div>
          </UiBaseCard>
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <UiBaseCard v-else-if="!loading"
      class="p-16 text-center space-y-6 rounded-[3rem] border-ash/30 shadow-2xl shadow-ash/5 max-w-lg mx-auto mt-20">
      <div
        class="w-24 h-24 rounded-full bg-danger/5 flex items-center justify-center mx-auto text-danger border border-danger/10">
        <IconAlertTriangle class="w-12 h-12" />
      </div>
      <div class="space-y-2">
        <h3 class="text-2xl font-black text-BtW tracking-tight">Accès restreint</h3>
        <p class="text-sm text-hsa font-medium leading-relaxed">
          Ce workspace est introuvable ou vous n'avez pas les permissions pour visualiser ses détails.
        </p>
      </div>
      <NuxtLink to="/dashboard/manage/workspace" class="block pt-4">
        <UiBaseButton variant="primary" size="sm" class="!rounded-2xl px-10">Retour à la liste</UiBaseButton>
      </NuxtLink>
    </UiBaseCard>

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
import {
  IconArrowLeft, IconEdit, IconCheck, IconUsers, IconMapPin, IconCalendar,
  IconBuildingSkyscraper, IconFileText, IconFingerprint, IconClick, IconRocket,
  IconUserPlus, IconAlertTriangle, IconStar, IconStarFilled, IconTrash
} from '@tabler/icons-vue'
import { useWorkspaceStore } from '~/stores/back/user/workspace'
import { useToastStore } from '~/stores/front/toast'
import {
  getWorkspaceLogoUrl, getWorkspaceTypeLabel, getWorkspaceRoleLabel,
  WORKSPACE_TYPE_CONFIG, WORKSPACE_ROLE_CONFIG
} from '~/utils/workspace'
import type { Workspace } from '~/types/workspace'

const route = useRoute()
const store = useWorkspaceStore()
const toast = useToastStore()
const loading = ref(true)
const workspace = ref<Workspace | null>(null)

const showDeleteConfirm = ref(false)
const deleting = ref(false)

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

  if (!store.workspaces.length) {
    await store.fetchWorkspaces()
  }

  workspace.value = store.workspaces.find(w => w.id === id) || null
  loading.value = false
}

const handleSetDefault = async (id: string) => {
  const success = await store.setDefaultWorkspace(id)
  if (success) {
    // Le store met déjà à jour la liste locale
  }
}

// Sync with store updates
watch(() => store.workspaces, () => {
  const id = route.params.id as string
  workspace.value = store.workspaces.find(w => w.id === id) || null
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

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

::selection {
  background: rgba(var(--primary-rgb), 0.1);
  color: var(--primary);
}
</style>
