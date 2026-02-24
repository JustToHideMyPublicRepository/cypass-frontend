<template>
  <div class="relative min-h-[80vh] max-w-5xl flex flex-col items-center px-4 pb-8 pt-12 mx-auto">
    <!-- Back Button -->
    <div class="w-full max-w-7xl mb-8">
      <button @click="router.back()"
        class="group flex items-center gap-2 text-hsa hover:text-primary transition-all font-black uppercase tracking-widest text-[10px]">
        <IconArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Retour
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="w-full max-w-7xl space-y-8 animate-fade-in">
      <UiAppSkeleton height="300px" radius="3rem" />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UiAppSkeleton height="400px" radius="2.5rem" />
        <UiAppSkeleton height="400px" radius="2.5rem" />
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="glass-panel p-12 rounded-[3rem] text-center max-w-2xl mx-auto">
      <div class="w-20 h-20 bg-danger/10 rounded-[2rem] flex items-center justify-center text-danger mx-auto mb-6">
        <IconAlertCircle class="w-10 h-10" />
      </div>
      <h2 class="text-2xl font-black text-BtW mb-2">Oups !</h2>
      <p class="text-hsa font-bold mb-8">{{ error }}</p>
      <NuxtLink to="/vigitech">
        <UiBaseButton variant="primary" class="!rounded-2xl px-8">Retour à VigiTech</UiBaseButton>
      </NuxtLink>
    </div>

    <!-- Profile Content -->
    <div v-else-if="user" class="w-full max-w-7xl space-y-8 animate-fade-in">
      <!-- Profile Header -->
      <RootUserHero :user="user" :user-avatar-url="userAvatarUrl" :public-incidents-count="publicIncidents.length" />

      <!-- Activity Section -->
      <RootUserActivity :public-incidents="publicIncidents" :comments="comments" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconAlertCircle, IconArrowLeft } from '@tabler/icons-vue'
import { getUserAvatarUrl } from '~/utils/user'

definePageMeta({
  layout: 'guest'
})

const route = useRoute()
const router = useRouter()
const store = useVigitechStore()

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

onMounted(fetchPublicProfile)

useHead({
  title: computed(() => user.value
    ? `Profil de ${user.value.first_name} ${user.value.last_name}`
    : 'Profil public')
})
</script>
