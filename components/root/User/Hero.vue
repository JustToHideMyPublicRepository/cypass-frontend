<template>
  <UiBaseCard class="!rounded-[3rem] overflow-hidden !border-none shadow-2xl relative group">
    <!-- Éléments de design premium : Fonds ambients et effets de flou (Blur) -->
    <div class="absolute inset-0 bg-gradient-to-br from-primary/10 via-WtB to-secondary/5 opacity-50"></div>
    <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
    <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]"></div>

    <div class="relative p-8 md:p-16 flex flex-col md:flex-row items-center gap-10 md:gap-16">
      <!-- Section Avatar -->
      <div class="relative shrink-0">
        <div @click="showImageViewer = true"
          class="relative z-10 w-36 h-36 md:w-48 md:h-48 rounded-[3rem] p-1.5 bg-gradient-to-tr from-primary to-secondary shadow-2xl cursor-pointer hover:scale-105 transition-all duration-500 overflow-hidden group/avatar">
          <div class="w-full h-full rounded-[2.8rem] overflow-hidden bg-ash border-4 border-WtB shadow-inner relative">
            <img :src="userAvatarUrl"
              class="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110"
              :alt="user.first_name" />
            <!-- Calque de survol pour l'indication de zoom -->
            <div
              class="absolute inset-0 bg-black/20 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
              <IconZoomIn class="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        <!-- Anneau décoratif animé en arrière-plan de l'avatar -->
        <div class="absolute inset-0 -m-4 border border-primary/10 rounded-[4rem] animate-[spin_20s_linear_infinite]">
        </div>
      </div>

      <!-- Informations textuelles : Nom, Statut, Organisation -->
      <div class="flex-1 text-center md:text-left space-y-6">
        <div class="space-y-2">
          <div class="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <h1 class="text-4xl md:text-5xl font-black text-BtW tracking-tighter leading-tight">
              {{ user.first_name }} <span class="text-primary">{{ user.last_name }}</span>
            </h1>
            <div class="flex items-center">
              <!-- Indicateur de statut (Actif/Inactif) -->
              <UiStatusBadge v-if="user.status == true || user.status === 'active'" status="active">
                Actif
              </UiStatusBadge>
              <UiStatusBadge v-else status="Error">
                Inactif
              </UiStatusBadge>
            </div>
          </div>
          <!-- Affichage de l'organisation si renseigné -->
          <p v-if="user.organization_name"
            class="flex items-center justify-center md:justify-start gap-2 text-primary font-black uppercase tracking-[0.3em] text-xs">
            <IconBuilding class="w-4 h-4" />
            {{ user.organization_name }}
          </p>
        </div>

        <!-- Statistiques et dates clés -->
        <div class="flex flex-wrap items-center justify-center md:justify-start gap-8">
          <!-- Date d'inscription -->
          <div class="group/stat">
            <p
              class="text-[10px] font-black text-hsa uppercase tracking-widest mb-1 group-hover/stat:text-primary transition-colors">
              Membre depuis</p>
            <div class="flex items-center gap-2 text-BtW font-bold text-lg">
              <IconCalendar class="w-5 h-5 text-primary/40" />
              {{ formattedDate }}
            </div>
          </div>
          <!-- Séparateur visuel -->
          <div class="w-px h-10 bg-ash/20 hidden md:block"></div>
          <!-- Compteurs d'activité publique -->
          <div class="group/stat">
            <p
              class="text-[10px] font-black text-hsa uppercase tracking-widest mb-1 group-hover/stat:text-primary transition-colors">
              Activité publique</p>
            <div class="flex flex-col gap-1.5">
              <div class="flex items-center gap-2 text-BtW font-bold text-lg">
                <IconShield class="w-5 h-5 text-primary/80" />
                {{ publicIncidentsCount }} Incident{{ publicIncidentsCount > 1 ? 's' : '' }}
              </div>
              <div class="flex items-center gap-2 text-hsa font-bold text-xs pl-0.5">
                <IconMessage class="w-3.5 h-3.5 text-primary/60" />
                {{ commentsCount }} Commentaire{{ commentsCount > 1 ? 's' : '' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Visionneuse d'image plein écran -->
    <ModalImageViewer v-if="userAvatarUrl" :show="showImageViewer" :image-url="userAvatarUrl"
      @close="showImageViewer = false" />
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconZoomIn, IconBuilding, IconCalendar, IconShield, IconMessage } from '@tabler/icons-vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

// Définition des propriétés attendues
const props = defineProps<{
  user: any
  userAvatarUrl: string
  publicIncidentsCount: number
  commentsCount: number
}>()

// État pour afficher la modale visionneuse d'image
const showImageViewer = ref(false)

/**
 * Formate la date d'inscription au format "Mois Année".
 */
const formattedDate = computed(() => {
  if (!props.user?.created_at) return ''
  try {
    return format(new Date(props.user.created_at), 'MMMM yyyy', { locale: fr })
  } catch {
    return ''
  }
})
</script>
