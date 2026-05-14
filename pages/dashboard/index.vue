<template>
  <div class="min-h-[85vh] flex flex-col items-center justify-center p-6 relative overflow-hidden">
    <!-- Décorations de fond subtiles -->
    <div class="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
    <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10"></div>

    <div class="max-w-5xl w-full space-y-12 relative z-10">
      <!-- En-tête -->
      <div v-if="!wsStore.loading || wsStore.workspaces.length" class="text-center space-y-4 animate-fade-down">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ash/50 border border-ash mb-2">
          <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          <span class="text-[10px] font-bold uppercase tracking-wider text-hsa">Tableau de bord</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-black text-BtW tracking-tight">
          Heureux de vous revoir, <span class="text-primary">{{ authStore.user?.first_name || 'utilisateur' }}</span>
        </h1>
        <p class="text-hsa max-w-xl mx-auto text-base md:text-lg">
          Veuillez sélectionner l'espace de travail que vous souhaitez utiliser pour cette session.
        </p>
      </div>

      <!-- États de chargement (Skeletons) -->
      <div v-if="wsStore.loading && !wsStore.workspaces.length" class="space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 3" :key="i" class="bg-WtB border border-ash rounded-3xl p-6 space-y-4 shadow-sm">
            <div class="flex items-center gap-4">
              <UiAppSkeleton type="rect" width="48px" height="48px" radius="16px" />
              <div class="flex-1 space-y-2">
                <UiAppSkeleton type="heading" width="70%" height="16px" />
                <UiAppSkeleton type="text" width="40%" height="10px" />
              </div>
            </div>
            <div class="pt-4 border-t border-ash/50 flex justify-between items-center">
              <UiAppSkeleton type="text" width="30%" height="8px" />
              <UiAppSkeleton type="circle" width="16px" height="16px" />
            </div>
          </div>
        </div>
      </div>

      <!-- Liste des Workspaces -->
      <div v-else-if="wsStore.workspaces.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        <UiBaseCard v-for="(ws, index) in wsStore.workspaces" :key="ws.id" @click="selectWorkspace(ws)"
          class="group/ws p-6 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-2 relative overflow-hidden animate-fade-up"
          :style="{ animationDelay: `${index * 100}ms` }" :class="[
            isActive(ws.id)
              ? 'border-primary/40 bg-primary/5 ring-1 ring-primary/10'
              : 'border-ash hover:border-primary/30 bg-WtB'
          ]">

          <!-- Indicateur de changement -->
          <div v-if="switchingId === ws.id"
            class="absolute inset-0 bg-WtB/80 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
            <UiLogoLoader size="sm" color="primary" />
            <span class="text-[10px] font-bold text-primary mt-2 uppercase tracking-widest">Connexion...</span>
          </div>

          <!-- Indicateur Actif -->
          <div v-if="isActive(ws.id)" class="absolute top-0 right-0 w-12 h-12">
            <div
              class="absolute top-0 right-0 w-0 h-0 border-t-[48px] border-l-[48px] border-t-primary border-l-transparent opacity-10">
            </div>
            <IconCheck class="absolute top-2 right-2 w-4 h-4 text-primary" />
          </div>

          <div class="flex flex-col gap-5">
            <!-- Logo & Badge -->
            <div class="flex items-center justify-between">
              <div
                class="w-14 h-14 rounded-2xl overflow-hidden border-2 border-ash group-hover/ws:border-primary/30 transition-all shadow-sm bg-ash/5 p-0.5">
                <img :src="getWorkspaceLogoUrl(ws.logo_url, ws.name)" :alt="ws.name"
                  class="w-full h-full object-cover rounded-xl" />
              </div>
              <div v-if="ws.is_default"
                class="px-2.5 py-1 rounded-lg bg-warning/10 text-warning text-[10px] font-black uppercase tracking-wider border border-warning/20 shadow-sm">
                Défaut
              </div>
            </div>

            <!-- Infos -->
            <div class="space-y-2">
              <h3
                class="text-lg font-black text-BtW truncate group-hover/ws:text-primary transition-colors tracking-tight">
                {{ ws.name }}
              </h3>
              <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span
                  class="inline-flex items-center gap-1.5 text-[10px] font-bold text-hsa uppercase tracking-wider bg-ash/30 px-2 py-0.5 rounded-md border border-ash/50">
                  <component :is="WORKSPACE_TYPE_CONFIG[ws.type]?.icon || IconBuilding" class="w-3 h-3 text-primary" />
                  {{ getWorkspaceTypeLabel(ws.type) }}
                </span>
                <span v-if="ws.role"
                  class="inline-flex items-center gap-1.5 text-[10px] font-bold text-primary/70 uppercase tracking-wider bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">
                  {{ getWorkspaceRoleLabel(ws.role) }}
                </span>
              </div>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-between pt-4 border-t border-ash/50 mt-1">
              <div class="flex items-center gap-1.5">
                <div class="flex -space-x-2">
                  <div v-for="i in Math.min(3, ws.members_count || 1)" :key="i"
                    class="w-5 h-5 rounded-full border-2 border-WtB bg-ash flex items-center justify-center text-[8px] font-bold text-BtW">
                    <IconUser class="w-2.5 h-2.5" />
                  </div>
                </div>
                <span class="text-[10px] text-hsa font-bold">{{ ws.members_count || 1 }} membre(s)</span>
              </div>
              <div
                class="w-8 h-8 rounded-full bg-ash/50 flex items-center justify-center group-hover/ws:bg-primary group-hover/ws:text-white transition-all shadow-sm">
                <IconArrowRight class="w-4 h-4 transition-transform group-hover/ws:translate-x-0.5" />
              </div>
            </div>
          </div>
        </UiBaseCard>

        <!-- Ajouter un nouveau -->
        <button @click="wsStore.openModal()"
          class="p-6 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-ash rounded-[2rem] hover:border-primary/40 hover:bg-primary/5 transition-all text-hsa hover:text-primary group/new min-h-[220px] bg-transparent animate-fade-up"
          :style="{ animationDelay: `${wsStore.workspaces.length * 100}ms` }">
          <div
            class="w-12 h-12 rounded-full bg-ash/20 group-hover/new:bg-primary/10 flex items-center justify-center transition-all group-hover/new:rotate-90">
            <IconPlus class="w-6 h-6" />
          </div>
          <div class="text-center">
            <span class="text-sm font-black uppercase tracking-widest block">Nouveau Workspace</span>
            <span class="text-[10px] text-hsa/60 font-medium mt-1 block">Ajoutez une organisation</span>
          </div>
        </button>
      </div>

      <!-- Aucun workspace -->
      <div v-else-if="!wsStore.loading" class="text-center space-y-8 animate-fade-up max-w-md mx-auto">
        <div class="w-24 h-24 bg-ash/20 rounded-full flex items-center justify-center mx-auto text-hsa relative">
          <IconBuilding class="w-12 h-12" />
          <div
            class="absolute -top-1 -right-1 w-8 h-8 bg-warning/20 rounded-full flex items-center justify-center text-warning border border-warning/20">
            <IconPlus class="w-4 h-4" />
          </div>
        </div>
        <div class="space-y-3">
          <h2 class="text-3xl font-black text-BtW tracking-tight">Aucun espace trouvé</h2>
          <p class="text-hsa text-base">
            Il semble que vous n'ayez pas encore d'espace de travail. Créez-en un pour commencer à gérer vos documents
            et incidents.
          </p>
        </div>
        <UiBaseButton @click="wsStore.openModal()" variant="primary" size="lg"
          class="w-full shadow-lg shadow-primary/20">
          <IconPlus class="w-5 h-5 mr-3" /> Créer mon premier workspace
        </UiBaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useWorkspaceStore } from '~/stores/back/user/workspace'
import { useAuthStore } from '~/stores/back/user/auth'
import { getWorkspaceLogoUrl, getWorkspaceTypeLabel, getWorkspaceRoleLabel, WORKSPACE_TYPE_CONFIG, WORKSPACE_ROLE_CONFIG } from '~/utils/workspace'
import { IconPlus, IconArrowRight, IconBuilding, IconUser, IconCheck } from '@tabler/icons-vue'
import type { Workspace } from '~/types/workspace'

/**
 * Dashboard Index Page
 * Permet à l'utilisateur de choisir son workspace actif avec une interface premium.
 * Gère une redirection automatique intelligente si un seul workspace est présent.
 */

const wsStore = useWorkspaceStore()
const authStore = useAuthStore()
const router = useRouter()
const switchingId = ref<string | null>(null)

// Titre de la page
useHead({
  title: 'Sélectionner un Espace - CYPASS',
  meta: [{ name: 'description', content: 'Choisissez votre espace de travail pour accéder au tableau de bord.' }]
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

// Vérifier si un workspace est actif
const isActive = (id: string) => wsStore.activeWorkspaceId === id
</script>

<style scoped>
.animate-fade-down {
  animation: fade-down 0.6s ease-out forwards;
}

.animate-fade-up {
  animation: fade-up 0.6s ease-out forwards;
}

@keyframes fade-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
