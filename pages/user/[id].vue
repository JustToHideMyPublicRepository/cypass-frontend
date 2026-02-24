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
        :comments-count="comments.length" />

      <!-- Section Activité -->
      <RootUserActivity :public-incidents="publicIncidents" :comments="comments" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconArrowLeft } from '@tabler/icons-vue'
import { getUserAvatarUrl } from '~/utils/user'

// Configuration de la page
definePageMeta({
  layout: 'guest'
})

// Accès aux utilitaires de route, de navigation et de store
const route = useRoute()
const router = useRouter()
const store = useVigitechStore()

// États réactifs de la page
const loading = ref(true)
const error = ref<string | null>(null)
const user = ref<any>(null)
const publicIncidents = ref<any[]>([])
const comments = ref<any[]>([])

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
const fetchPublicProfile = async () => {
  loading.value = true
  error.value = null
  try {
    const response: any = await $fetch('/api/profile/public', {
      params: { id: route.params.id }
    })

    if (response.success && response.data) {
      user.value = response.data.user
      publicIncidents.value = response.data.activity?.public_incidents || []
      comments.value = response.data.activity?.comments || []
    } else {
      error.value = response.message || 'Impossible de charger le profil'
    }
  } catch (err: any) {
    error.value = err.data?.message || 'Une erreur est survenue lors du chargement du profil'
  } finally {
    loading.value = false
  }
}

// Initialisation au montage du composant
onMounted(fetchPublicProfile)

/**
 * Mise à jour dynamique du titre de la page (Balise <title>)
 */
useHead({
  title: computed(() => user.value
    ? `Profil de ${user.value.first_name} ${user.value.last_name}`
    : 'Profil public')
})
</script>
