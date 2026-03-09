<template>
  <div class="space-y-6">
    <MeProfileHeader />

    <!-- Loading State -->
    <div v-if="profilStore.loading && !profilStore.profile" class="flex items-center justify-center py-12">
      <UiLogoLoader size="xl" />
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: User Card & Stats -->
      <div class="space-y-6">
        <MeProfileSidebar :user="user" :status="profilStore.profile?.status || 'active'" />
        <MeProfileStats :statistics="profilStore.statistics" />
      </div>

      <!-- Right Column: Personal Info & Security -->
      <div class="lg:col-span-2 space-y-6">
        <MeProfilePersonalInfo v-model="form" :email-verified="!!profilStore.profile?.email_verified" />
        <MeProfileSecurity />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '~/stores/back/user/auth'
import { useProfilStore } from '~/stores/back/user/profil'

useHead({
  title: 'Mon profil',
  meta: [
    { name: 'description', content: 'Gérez vos informations personnelles et vos paramètres de sécurité.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const authStore = useAuthStore()
const profilStore = useProfilStore()

const user = computed(() => authStore.user)

let form = reactive({
  first_name: '',
  last_name: '',
  email: '',
  organization_name: ''
})

const syncFormWithProfile = () => {
  if (profilStore.profile) {
    form.first_name = profilStore.profile.first_name
    form.last_name = profilStore.profile.last_name
    form.email = profilStore.profile.email
    form.organization_name = profilStore.profile.organization_name || '-'
  }
}

watch(() => profilStore.profile, syncFormWithProfile, { deep: true })

onMounted(async () => {
  await profilStore.getProfile()
  syncFormWithProfile()
})
</script>
