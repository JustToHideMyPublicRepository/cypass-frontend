<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-BtW">Mon Profil</h1>
        <p class="text-hsa">Gérez vos informations personnelles et de sécurité.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: User Card -->
      <div class="space-y-6">
        <UiBaseCard class="text-center py-8">
          <div class="relative w-32 h-32 mx-auto mb-4">
            <div class="w-full h-full rounded-full overflow-hidden border-4 border-ash bg-ash">
              <img :src="user?.avatar || 'https://i.pravatar.cc/300'" alt="Avatar" class="w-full h-full object-cover" />
            </div>
            <button
              class="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors">
              <IconCamera class="w-5 h-5" />
            </button>
          </div>
          <h2 class="text-xl font-bold text-BtW">{{ user?.name || 'Utilisateur' }}</h2>
          <p class="text-hsa mb-4">{{ user?.role || 'Administrateur' }}</p>
          <div class="flex justify-center gap-2">
            <UiStatusBadge status="Active" />
          </div>
        </UiBaseCard>

        <!-- Completion Widget -->
        <UiBaseCard title="Complétude du profil">
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-BtW">Progression</span>
              <span class="text-primary font-bold">85%</span>
            </div>
            <div class="w-full bg-ash rounded-full h-2 overflow-hidden">
              <div class="bg-primary h-full rounded-full" style="width: 85%"></div>
            </div>
            <p class="text-xs text-hsa mt-2">Ajoutez votre numéro de téléphone pour atteindre 100%.</p>
          </div>
        </UiBaseCard>
      </div>

      <!-- Right Column: Forms -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Personal Info -->
        <UiBaseCard title="Informations Personnelles">
          <form @submit.prevent="updateProfile" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-xs font-bold text-hsa uppercase">Prénom</label>
                <input type="text" v-model="form.firstName"
                  class="w-full px-4 py-2.5 rounded-lg bg-ash border border-ashAct focus:ring-2 focus:ring-primary outline-none text-BtW" />
              </div>
              <div class="space-y-1">
                <label class="text-xs font-bold text-hsa uppercase">Nom</label>
                <input type="text" v-model="form.lastName"
                  class="w-full px-4 py-2.5 rounded-lg bg-ash border border-ashAct focus:ring-2 focus:ring-primary outline-none text-BtW" />
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-bold text-hsa uppercase">Email</label>
              <div class="relative">
                <IconMail class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa" />
                <input type="email" v-model="form.email"
                  class="w-full pl-10 pr-4 py-2.5 rounded-lg bg-ash border border-ashAct focus:ring-2 focus:ring-primary outline-none text-BtW" />
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-bold text-hsa uppercase">Mots de passe actuel</label>
              <div class="relative">
                <IconLock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa" />
                <input type="password" placeholder="Pour confirmer les changements"
                  class="w-full pl-10 pr-4 py-2.5 rounded-lg bg-ash border border-ashAct focus:ring-2 focus:ring-primary outline-none text-BtW" />
              </div>
            </div>

            <div class="pt-4 flex justify-end">
              <UiBaseButton type="submit" :loading="loading">
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
              <input type="checkbox" class="sr-only peer" checked>
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
import { ref, reactive, computed } from 'vue'
import { IconCamera, IconMail, IconLock } from '@tabler/icons-vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useHead({
  title: 'Mon Profil'
})

const cypassData = useCypassData()
const user = computed(() => cypassData.currentUser)

const loading = ref(false)
const form = reactive({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@cypass.bj',
  phone: ''
})

const updateProfile = async () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    // Mock success
  }, 1000)
}
</script>
