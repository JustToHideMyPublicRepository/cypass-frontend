<template>
  <!-- Page de profil public de l'utilisateur -->
  <div class="relative min-h-[80vh] max-w-5xl flex flex-col items-center px-4 pb-8 pt-12 mx-auto">
    <!-- Bouton Retour -->
    <div class="w-full max-w-7xl mb-8">
      <button @click="router.back()"
        class="group flex items-center gap-2 text-hsa hover:text-primary transition-all font-black uppercase tracking-widest text-[10px]">
        <IconArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Retour
      </button>
    </div>

    <!-- État de chargement -->
    <RootUserLoading v-if="loading" />

    <!-- État d'erreur -->
    <RootUserError v-else-if="error" :message="error" @retry="fetchPublicProfile" />

    <!-- Contenu du Profil -->
    <div v-else-if="user" class="w-full max-w-7xl space-y-8 animate-fade-in">
      <!-- En-tête du profil -->
      <RootUserHero :user="user" :user-avatar-url="userAvatarUrl" :public-incidents-count="publicIncidents.length"
        :comments-count="comments.length"
        :is-own-profile="!!(authStore.user && String(authStore.user.id) === String(route.params.id))"
        :is-logged-in="!!authStore.user" @report="modals.report = true" />

      <!-- Section Activité -->
      <RootUserActivity :public-incidents="publicIncidents" :comments="comments" :user-avatar-url="userAvatarUrl" />
    </div>

    <!-- Modal de signalement -->
    <ModalReportAddUser v-if="user" :show="modals.report" :target-id="String(route.params.id)"
      @close="modals.report = false" @success="handleReportSuccess" />
  </div>
</template>

<script setup lang="ts">
import { IconArrowLeft } from '@tabler/icons-vue'
import { getUserAvatarUrl } from '~/utils/user'
import { useAuthStore } from '~/stores/back/user/auth'
import { useToastStore } from '~/stores/front/toast'
import { useUserPublicStore } from '~/stores/back/public/userPublic'
import { storeToRefs } from 'pinia'

// Configuration de la page
definePageMeta({
  layout: 'guest'
})

// Accès aux utilitaires de route, de navigation et de store
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToastStore()

// States managed by public store
const publicUserStore = useUserPublicStore()
const { user, publicIncidents, comments, loading, error } = storeToRefs(publicUserStore)

const modals = reactive({
  report: false
})

// Notification lors de l'ouverture de la modale de signalement
watch(() => modals.report, (isVisible) => {
  if (isVisible) {
    toast.showToast('info', 'Signalement', 'Votre signalement sera examiné en toute confidentialité par notre équipe.')
  }
})

const userAvatarUrl = computed(() => {
  return getUserAvatarUrl(
    user.value?.avatar_url,
    user.value?.first_name,
    user.value?.last_name
  )
})

/**
 * Récupère les données du profil public via l'API.
 */
const fetchPublicProfile = () => publicUserStore.getPublicProfile(String(route.params.id))

/**
 * Gère le succès du signalement.
 */
const handleReportSuccess = () => {
  modals.report = false
  toast.showToast('success', 'Signalement envoyé', 'Le compte a été signalé avec succès et sera examiné.')
  // Optionnel: rafraîchir le profil pour voir le badge "Compte suspecté"
  fetchPublicProfile()
}

// Initialisation au montage du composant
onMounted(fetchPublicProfile)

/**
 * Mise à jour dynamique du titre de la page (Balise <title>)
 */
useHead({
  title: computed(() => user.value
    ? `Profil de ${user.value.first_name} ${user.value.last_name}`
    : 'Profil public'),
  meta: [
    { name: 'description', content: 'Consultez les activités publiques et signalements d\'un membre de la communauté CYPASS.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
