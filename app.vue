<template>
  <div class="min-h-screen bg-gradient-premium text-textClr font-body">
    <VitePwaManifest />
    <UiGlobalDropZone />
    <NuxtLayout>
      <NuxtPage :page-key="route => route.fullPath" />
      <UtilsGlobalHelp />
      <UiAppToast :model-value="toastStore.show" @update:model-value="val => toastStore.show = val"
        :type="toastStore.type" :title="toastStore.title" :message="toastStore.message"
        :duration="toastStore.duration" />
      <ModalGlobalSearch />
      <ModalGlobalAiAnalysis />
      <ModalGlobalAiAnalysisSettings />
    </NuxtLayout>

    <UtilsNoScript />
    <UtilsCookieConsent />
    <UtilsOfflineQuiz v-if="isOffline" :connection-restored="connectionRestored" />
    <UtilsContextMenu />
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from '@/stores/front/toast'
import { useShortcutsStore } from '@/stores/front/shortcuts'
import { useSearchStore } from '@/stores/front/search'
import { useAiAnalysisStore } from '@/stores/front/aiAnalysis'

const toastStore = useToastStore()
const shortcutsStore = useShortcutsStore()
const searchStore = useSearchStore()
const aiAnalysisStore = useAiAnalysisStore()

const isOffline = ref(false)
const connectionRestored = ref(false)

const updateOnlineStatus = () => {
  if (process.client) {
    if (!navigator.onLine) {
      isOffline.value = true
      connectionRestored.value = false
    } else if (isOffline.value) {
      // Don't close immediately, just notify the quiz
      connectionRestored.value = true
    }
  }
}

onMounted(() => {
  shortcutsStore.init()
  aiAnalysisStore.init()
  updateOnlineStatus()
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
})

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
})

useShortcuts({
  searchCallback: () => searchStore.openSearch()
})

const heroImagePath = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200";
const baseUrl = "https://cypass.bj";

useSeoMeta({
  title: 'Souveraineté Numérique & Sécurité',
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | CYPASS` : 'CYPASS - Souveraineté Numérique & Sécurité';
  },
  ogTitle: 'CYPASS - Souveraineté Numérique & Sécurité',
  description: 'L\'infrastructure de confiance protégeant l\'écosystème numérique du Bénin. Certification, veille & audit en temps réel.',
  ogDescription: 'L\'infrastructure de confiance protégeant l\'écosystème numérique du Bénin. Certification, Veille & Audit en temps réel.',
  ogImage: heroImagePath,
  ogUrl: baseUrl,
  ogType: 'website',
  ogLocale: 'fr_FR',
  ogSiteName: 'CYPASS',
  twitterCard: 'summary_large_image',
  twitterTitle: 'CYPASS - Souveraineté Numérique',
  twitterDescription: 'L\'infrastructure de confiance protégeant l\'écosystème numérique du Bénin.',
  twitterImage: heroImagePath,
})

const isStepProgressActive = useState('isStepProgressActive', () => false)

const faviconPath = computed(() => {
  if (isOffline.value) return '/favicon-faill.ico'
  if (isStepProgressActive.value) return '/favicon-load.ico'
  return '/favicon.ico'
})

useHead({
  link: [
    { rel: 'icon', type: 'image/x-icon', href: faviconPath },
    { rel: 'canonical', href: baseUrl }
  ]
});
</script>