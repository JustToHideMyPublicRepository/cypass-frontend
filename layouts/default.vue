<template>
  <div class="flex min-h-screen bg-bgClr transition-colors duration-300">
    <!-- Barre latérale -->
    <LytDefaultSidebar :isOpen="isOpen" :isCollapsed="isCollapsed" @logout="handleLogout"
      @toggle-collapse="isCollapsed = !isCollapsed" @close="isOpen = false" />

    <!-- Superposition pour mobile -->
    <div v-if="isOpen" @click="isOpen = false" class="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"></div>

    <!-- Zone de contenu principale -->
    <div class="flex-1 flex flex-col min-w-0 h-screen overflow-hidden transition-all duration-300">
      <!-- Barre supérieure -->
      <LytDefaultHeader :user="user" @toggle-menu="isOpen = !isOpen" @logout="handleLogout" />

      <!-- Contenu de la page -->
      <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-hide">
        <div class="max-w-7xl mx-auto">
          <slot />
        </div>
      </main>

      <!-- Pied de page Dashboard -->
      <LytDefaultFooter class="shrink-0" />
    </div>
    <!-- Modale de déconnexion -->
    <ModalGlobalLogout :show="authStore.isLogoutModalOpen" @close="authStore.closeLogoutModal()"
      @confirm="confirmLogout" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useProfilStore } from '~/stores/profil'
import { useToastStore } from '~/stores/toast'

const isOpen = ref(false)
const isCollapsed = ref(false)
const authStore = useAuthStore()
const profilStore = useProfilStore()
const toastStore = useToastStore()

onMounted(async () => {
  const storedState = localStorage.getItem('cps_sidebar')
  if (storedState) {
    isCollapsed.value = storedState === 'true'
  }

  if (authStore.user && !profilStore.profile) {
    await profilStore.fetchProfile()
  }
})

watch(isCollapsed, (newVal) => {
  localStorage.setItem('cps_sidebar', String(newVal))
})

const user = computed(() => authStore.user)

const handleLogout = () => {
  authStore.openLogoutModal()
}

const confirmLogout = () => {
  authStore.closeLogoutModal()
  authStore.logout()
  toastStore.showToast('success', 'Déconnexion', authStore.message || 'À bientôt.')
}
</script>
