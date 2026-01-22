<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-BtW">Mon Profil</h1>
        <p class="text-hsa">Gérez vos informations personnelles et de sécurité.</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="profilStore.loading && !profilStore.profile" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: User Card -->
      <div class="space-y-6">
        <UiBaseCard class="text-center py-8">
          <div class="relative w-32 h-32 mx-auto mb-4">
            <div class="w-full h-full rounded-full overflow-hidden border-4 border-ash bg-ash">
              <img :src="`https://api.dicebear.com/9.x/icons/svg?seed=${user?.name || 'User'}`" alt="Avatar"
                class="w-full h-full object-cover" />
            </div>
            <button
              class="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors">
              <IconCamera class="w-5 h-5" />
            </button>
          </div>
          <h2 class="text-xl font-bold text-BtW">{{ user?.name || 'Utilisateur' }}</h2>
          <p class="text-hsa mb-2">{{ user?.role === 'admin' ? 'Administrateur' : 'Utilisateur' }}</p>
          <p class="text-xs text-hsa mb-4">Membre depuis {{ formatDate(user?.created_at) }}</p>
          <div class="flex justify-center gap-2">
            <UiStatusBadge status="Active" />
          </div>
        </UiBaseCard>

        <!-- Statistics Widgets -->
        <div class="space-y-4">
          <UiBaseCard>
            <div class="flex items-center gap-4">
              <div class="p-3 bg-primary/10 rounded-xl">
                <IconFileCertificate class="w-6 h-6 text-primary" />
              </div>
              <div>
                <p class="text-xs font-bold text-hsa uppercase">Documents</p>
                <h4 class="text-xl font-bold">{{ profilStore.statistics?.total_documents || 0 }}</h4>
              </div>
            </div>
          </UiBaseCard>

          <UiBaseCard>
            <div class="flex items-center gap-4">
              <div class="p-3 bg-danger/10 rounded-xl">
                <IconAlertTriangle class="w-6 h-6 text-danger" />
              </div>
              <div>
                <p class="text-xs font-bold text-hsa uppercase">Incidents</p>
                <h4 class="text-xl font-bold">{{ profilStore.statistics?.total_incidents || 0 }}</h4>
              </div>
            </div>
          </UiBaseCard>
        </div>
      </div>

      <!-- Right Column: Forms -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Personal Info -->
        <UiBaseCard title="Informations Personnelles">
          <form @submit.prevent="updateProfile" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-xs font-bold text-hsa uppercase">Prénom</label>
                <input type="text" v-model="form.prenom"
                  class="w-full px-4 py-2.5 rounded-lg bg-ash border border-ashAct focus:ring-2 focus:ring-primary outline-none text-BtW" />
              </div>
              <div class="space-y-1">
                <label class="text-xs font-bold text-hsa uppercase">Nom</label>
                <input type="text" v-model="form.nom"
                  class="w-full px-4 py-2.5 rounded-lg bg-ash border border-ashAct focus:ring-2 focus:ring-primary outline-none text-BtW" />
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-bold text-hsa uppercase">Email</label>
              <div class="relative">
                <IconMail class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa" />
                <input type="email" v-model="form.email" disabled
                  class="w-full pl-10 pr-4 py-2.5 rounded-lg bg-ash/50 border border-ashAct text-hsa cursor-not-allowed outline-none" />
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-bold text-hsa uppercase">Organisation</label>
              <input type="text" v-model="form.organisation" disabled
                class="w-full px-4 py-2.5 rounded-lg bg-ash/50 border border-ashAct text-hsa cursor-not-allowed outline-none" />
            </div>

            <div class="pt-4 flex justify-end">
              <UiBaseButton type="submit" :loading="profilStore.loading">
                Enregistrer les modifications
              </UiBaseButton>
            </div>
          </form>
        </UiBaseCard>

        <!-- Security -->
        <UiBaseCard title="Sécurité" class="border-l-4 border-l-warning">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-bold text-BtW">Double Authentification (2FA)</h3>
              <p class="text-sm text-hsa">Sécurisez votre compte avec une étape supplémentaire.</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" class="sr-only peer">
              <div
                class="w-11 h-6 bg-ash peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary">
              </div>
            </label>
          </div>
        </UiBaseCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { IconCamera, IconMail, IconLock, IconFileCertificate, IconAlertTriangle } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/auth'
import { useProfilStore } from '~/stores/profil'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useHead({
  title: 'Mon Profil'
})

const authStore = useAuthStore()
const profilStore = useProfilStore()

const user = computed(() => authStore.user)

const form = reactive({
  nom: '',
  prenom: '',
  email: '',
  organisation: ''
})

onMounted(async () => {
  await profilStore.fetchProfile()
  if (profilStore.profile) {
    // Simple split logic: first word as prenom, rest as nom
    const nameParts = profilStore.profile.name.split(' ')
    form.prenom = nameParts[0]
    form.nom = nameParts.slice(1).join(' ')

    form.email = profilStore.profile.email
    form.organisation = profilStore.profile.organization_name || 'N/A'
  }
})

const updateProfile = async () => {
  // Logic for updating profile can be added to profilStore later
  console.log('Update profile:', form)
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '...'
  return format(new Date(dateString), 'd MMMM yyyy', { locale: fr })
}
</script>
