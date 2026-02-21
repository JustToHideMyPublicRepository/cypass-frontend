<template>
  <div class="min-h-screen bg-gradient-premium text-textClr font-body">
    <VitePwaManifest />
    <UiGlobalDropZone />
    <NuxtLayout>
      <NuxtPage />
      <UtilsGlobalHelp />
      <UiAppToast :model-value="toastStore.show" @update:model-value="val => toastStore.show = val"
        :type="toastStore.type" :title="toastStore.title" :message="toastStore.message"
        :duration="toastStore.duration" />
      <ModalGlobalSearch />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from '@/stores/toast'
import { useShortcutsStore } from '@/stores/shortcuts'
import { useSearchStore } from '@/stores/search'

const toastStore = useToastStore()
const shortcutsStore = useShortcutsStore()
const searchStore = useSearchStore()

onMounted(() => {
  shortcutsStore.init()
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

useHead({
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'canonical', href: baseUrl }
  ]
});
</script>