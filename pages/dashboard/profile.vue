<template>
  <div class="space-y-6">
    <MeProfileHeader />

    <!-- Loading State -->
    <div v-if="profilStore.loading && !profilStore.profile" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
import { useAuthStore } from '~/stores/auth'
import { useProfilStore } from '~/stores/profil'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useHead({
  title: 'Mon profil'
})

const authStore = useAuthStore()
const profilStore = useProfilStore()

const user = computed(() => authStore.user)

const form = reactive({
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
  await profilStore.fetchProfile()
  syncFormWithProfile()
})
</script>
