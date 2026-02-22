<template>
  <div class="relative min-h-[80vh] flex flex-col items-center justify-center px-4">
    <div class="max-w-7xl mx-auto px-6">
      <!-- Header -->
      <div class="max-w-3xl mb-12 md:mb-20">
        <h1 class="text-4xl md:text-6xl font-black text-BtW tracking-tighter mb-6">
          Vigi<span class="text-primary">Tech</span>
        </h1>
        <p class="text-lg md:text-xl text-hsa leading-relaxed">
          Veille communautaire sur la cybersécurité. Consultez les derniers incidents signalés et apprenez à vous
          protéger contre les menaces émergentes au Bénin.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <!-- Content -->
        <div class="lg:col-span-3 space-y-8">
          <div v-if="store.loading && !store.publicIncidents.length" class="space-y-8">
            <div v-for="i in 3" :key="i" class="h-40 bg-ash/5 rounded-[2.5rem] animate-pulse border border-ash"></div>
          </div>

          <template v-else-if="store.publicIncidents.length">
            <RootVigitechIncidentCard v-for="incident in store.publicIncidents" :key="incident.id" :incident="incident"
              :detailUrl="`/vigitech/${incident.id}`" />
          </template>

          <div v-else class="text-center py-32 glass-panel rounded-[3rem] border-2 border-dashed border-ash">
            <IconShieldCheck class="w-16 h-16 text-primary mx-auto mb-6 opacity-20" />
            <h3 class="text-2xl font-black text-BtW">Aucun incident public</h3>
            <p class="text-hsa font-bold mt-2">La plateforme est actuellement calme. Restez vigilants !</p>
          </div>
        </div>

        <!-- Sidebar / Filters -->
        <div class="space-y-8">
          <div class="glass-panel p-8 rounded-[2.5rem] border border-ashAct space-y-6">
            <h3 class="text-xs font-black text-hsa uppercase tracking-[0.2em] mb-4">Filtrer les incidents</h3>

            <div class="space-y-4">
              <div class="space-y-1.5">
                <label class="text-[10px] font-black text-hsa uppercase tracking-widest px-1">Type de menace</label>
                <select v-model="filters.type" @change="fetchData"
                  class="w-full h-11 px-4 rounded-xl bg-ash/10 border border-ash/50 font-bold text-sm outline-none focus:ring-2 focus:ring-primary appearance-none">
                  <option value="">Tous les types</option>
                  <option value="phishing">Phishing</option>
                  <option value="ransomware">Ransomware</option>
                  <option value="fake_profile">Faux Profil</option>
                  <option value="harassment">Harcèlement</option>
                </select>
              </div>

              <div class="space-y-1.5">
                <label class="text-[10px] font-black text-hsa uppercase tracking-widest px-1">Gravité</label>
                <select v-model="filters.level" @change="fetchData"
                  class="w-full h-11 px-4 rounded-xl bg-ash/10 border border-ash/50 font-bold text-sm outline-none focus:ring-2 focus:ring-primary appearance-none">
                  <option value="">Toutes les gravités</option>
                  <option value="low">Faible</option>
                  <option value="medium">Moyenne</option>
                  <option value="critical">Critique</option>
                </select>
              </div>
            </div>

            <UiBaseButton variant="ghost" block class="!text-[10px] !font-black !uppercase" @click="resetFilters">
              Réinitialiser
            </UiBaseButton>
          </div>

          <UiBaseCard class="bg-primary text-white border-none !rounded-[2.5rem] p-1 shadow-2xl shadow-primary/30">
            <div class="bg-primary/20 p-8 rounded-[2.2rem] space-y-4">
              <IconAlertTriangle class="w-10 h-10 text-white/90" />
              <h3 class="text-xl font-black leading-tight">Vous êtes victime d'une cyber-attaque ?</h3>
              <p class="text-sm text-white/80 font-bold leading-relaxed">
                Connectez-vous à votre espace personnel pour signaler officiellement l'incident et recevoir l'assistance
                de nos
                services.
              </p>
              <NuxtLink to="/auth/login">
                <UiBaseButton variant="secondary" block class="mt-4 !bg-white !text-primary !border-none">
                  Se Connecter
                </UiBaseButton>
              </NuxtLink>
            </div>
          </UiBaseCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconShieldCheck, IconAlertTriangle } from '@tabler/icons-vue'
import { useVigitechStore } from '~/stores/vigitech'

definePageMeta({
  layout: 'guest'
})

const store = useVigitechStore()
const filters = ref({
  type: '',
  level: ''
})

const fetchData = () => {
  const params: any = {}
  if (filters.value.type) params.type = filters.value.type
  if (filters.value.level) params.level = filters.value.level
  store.fetchPublicIncidents(params)
}

const resetFilters = () => {
  filters.value = { type: '', level: '' }
  fetchData()
}

onMounted(fetchData)

useHead({
  title: 'Veille cyber communautaire'
})
</script>
