<template>
  <div class="relative pb-20 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto space-y-16">
      <RootSupportHeader ref="headerComp" v-model:searchQuery="searchQuery" />
      <RootSupportCategories :categories="categories" />
      <RootSupportFaqTeaser />
      <RootSupportDevelopers />
      <RootSupportFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconUserCircle, IconShieldLock, IconTerminal2 } from '@tabler/icons-vue'

const headerComp = ref<any>(null)
const searchQuery = ref('')

useShortcuts({
  searchCallback: () => headerComp.value?.focus()
})

definePageMeta({
  layout: 'guest'
})

const categories = [
  {
    title: 'Compte & Profil',
    desc: 'Gestion de votre identité, mise à jour des informations et paramètres de compte.',
    icon: IconUserCircle,
    colorClass: 'bg-primary/10 text-primary'
  },
  {
    title: 'Sécurité & Accès',
    desc: 'Double authentification, réinitialisation de mot de passe et historique de connexion.',
    icon: IconShieldLock,
    colorClass: 'bg-success/10 text-success'
  },
  {
    title: 'Développeurs & API',
    desc: 'Accédez directement à la section technique ci-dessous.',
    icon: IconTerminal2,
    colorClass: 'bg-secondary/10 text-secondary'
  }
]

useHead({
  title: 'Centre d\'aide'
})
</script>
