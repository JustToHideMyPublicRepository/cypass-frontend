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

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Column 1: Filters & Info -->
        <div class="lg:col-span-3 space-y-6 order-2 lg:order-1">
          <div class="glass-panel p-6 rounded-[2rem] border border-ashAct space-y-6 shadow-sm">
            <h3 class="text-[10px] font-black text-hsa uppercase tracking-[0.2em]">Filtrer les incidents</h3>

            <div class="space-y-4">
              <div class="space-y-1.5">
                <label class="text-[9px] font-black text-hsa uppercase tracking-widest px-1">Type de menace</label>
                <select v-model="filters.type" @change="fetchData"
                  class="w-full h-10 px-4 rounded-xl bg-WtB border border-ash/50 font-bold text-xs outline-none focus:ring-2 focus:ring-primary transition-all appearance-none cursor-pointer">
                  <option value="">Tous les types</option>
                  <option value="phishing">Phishing</option>
                  <option value="ransomware">Ransomware</option>
                  <option value="fake_profile">Faux Profil</option>
                  <option value="harassment">Harcèlement</option>
                </select>
              </div>

              <div class="space-y-1.5">
                <label class="text-[9px] font-black text-hsa uppercase tracking-widest px-1">Gravité</label>
                <select v-model="filters.level" @change="fetchData"
                  class="w-full h-10 px-4 rounded-xl bg-WtB border border-ash/50 font-bold text-xs outline-none focus:ring-2 focus:ring-primary transition-all appearance-none cursor-pointer">
                  <option value="">Toutes les gravités</option>
                  <option value="low">Faible</option>
                  <option value="medium">Moyenne</option>
                  <option value="critical">Critique</option>
                </select>
              </div>
            </div>

            <UiBaseButton variant="ghost" block size="sm" class="!text-[9px] !font-black !uppercase"
              @click="resetFilters">
              Réinitialiser
            </UiBaseButton>
          </div>

          <!-- Info Block Based on Auth -->
          <UiBaseCard class="bg-primary text-white border-none !rounded-[2rem] p-1 shadow-xl shadow-primary/20">
            <div class="bg-primary/20 p-6 rounded-[1.8rem] space-y-4">
              <IconAlertTriangle class="w-8 h-8 text-WtB" />
              <template v-if="authStore.user">
                <h3 class="text-lg text-WtB font-black leading-tight">Bonjour {{ authStore.user.first_name }}</h3>
                <p class="text-[11px] text-ashAct font-bold leading-relaxed">
                  Consultez et suivez vos propres signalements directement dans votre espace personnel.
                </p>
                <NuxtLink to="/dashboard/vigitech">
                  <UiBaseButton variant="secondary" block size="sm"
                    class="mt-2 !bg-ash !text-primary !border-none font-black">
                    Dashboard
                  </UiBaseButton>
                </NuxtLink>
              </template>
              <template v-else>
                <h3 class="text-lg text-WtB font-black leading-tight">Victime d'une attaque ?</h3>
                <p class="text-[11px] text-ashAct font-bold leading-relaxed">
                  Connectez-vous pour signaler officiellement l'incident et recevoir notre assistance.
                </p>
                <NuxtLink to="/auth/login">
                  <UiBaseButton variant="secondary" block size="sm"
                    class="mt-2 !bg-ash !text-primary !border-none font-black">
                    Se connecter
                  </UiBaseButton>
                </NuxtLink>
              </template>
            </div>
          </UiBaseCard>
        </div>

        <!-- Column 2: Feed & Pagination -->
        <div class="lg:col-span-6 space-y-6 order-1 lg:order-2">
          <div v-if="store.loading && !store.publicIncidents.length" class="space-y-6">
            <div v-for="i in 3" :key="i" class="h-32 bg-ash/5 rounded-[2rem] animate-pulse border border-ash/30"></div>
          </div>

          <template v-else-if="store.publicIncidents.length">
            <div class="space-y-4">
              <RootVigitechIncidentCard v-for="incident in store.publicIncidents" :key="incident.id"
                :incident="incident" :detailUrl="`/vigitech/${incident.id}`" />
            </div>

            <!-- Pagination -->
            <div class="flex items-center justify-between pt-6">
              <UiBaseButton variant="ghost" size="sm" :disabled="store.publicPagination.offset === 0"
                @click="changePage(-1)">
                <IconChevronLeft class="w-4 h-4 mr-2" /> Précédent
              </UiBaseButton>
              <div class="text-[10px] font-black text-hsa uppercase tracking-widest">
                Page {{ Math.floor(store.publicPagination.offset / store.publicPagination.limit) + 1 }}
              </div>
              <UiBaseButton variant="ghost" size="sm"
                :disabled="store.publicIncidents.length < store.publicPagination.limit" @click="changePage(1)">
                Suivant
                <IconChevronRight class="w-4 h-4 ml-2" />
              </UiBaseButton>
            </div>
          </template>

          <div v-else class="text-center py-20 glass-panel rounded-[2.5rem] border-2 border-dashed border-ash">
            <IconShieldCheck class="w-12 h-12 text-primary mx-auto mb-4 opacity-20" />
            <h3 class="text-xl font-black text-BtW">Aucun incident</h3>
            <p class="text-xs text-hsa font-bold mt-2">La plateforme est actuellement calme.</p>
          </div>
        </div>

        <!-- Column 3: Weekly Stats -->
        <div class="lg:col-span-3 space-y-6 order-3">
          <div class="space-y-4">
            <h3 class="text-[10px] font-black text-hsa uppercase tracking-[0.2em] px-2">Rapport Hebdomadaire</h3>

            <!-- Stat Cards -->
            <div v-for="stat in stats" :key="stat.label"
              class="p-5 rounded-[1.8rem] border border-ashAct shadow-sm overflow-hidden relative group"
              :class="stat.bg">
              <div class="relative z-10">
                <div class="flex justify-between items-start mb-2">
                  <p
                    class="text-[9px] font-black uppercase tracking-widest text-hsa opacity-80 group-hover:text-BtW transition-colors">
                    {{ stat.label }}</p>
                  <component :is="stat.icon" class="w-4 h-4" :class="stat.iconColor" />
                </div>
                <div class="flex items-end gap-3">
                  <h4 class="text-2xl font-black text-BtW transition-transform group-hover:scale-105 duration-500">{{
                    stat.value
                  }}</h4>
                  <div v-if="stat.trend"
                    class="flex items-center gap-1 mb-1 px-1.5 py-0.5 rounded-full bg-ash/50 text-[8px] font-black">
                    <component :is="stat.trend >= 0 ? IconTrendingUp : IconTrendingDown" class="w-2.5 h-2.5"
                      :class="stat.trend >= 0 ? 'text-success' : 'text-danger'" />
                    <span :class="stat.trend >= 0 ? 'text-success' : 'text-danger'">{{ Math.abs(stat.trend) }}%</span>
                  </div>
                </div>
                <p class="text-[10px] font-bold text-hsa mt-1">{{ stat.sub }}</p>
              </div>
              <div
                class="absolute -right-4 -bottom-4 w-16 h-16 bg-white/5 rounded-full blur-xl group-hover:bg-primary/5 transition-all duration-700">
              </div>
            </div>

            <!-- Small AI Report -->
            <div class="glass-panel p-6 rounded-[2rem] border border-ashAct space-y-4 bg-ash/5">
              <div class="flex items-center gap-2">
                <IconSparkles class="w-4 h-4 text-primary" />
                <span class="text-[10px] font-black uppercase tracking-widest text-BtW">Analyse VigiGPT</span>
              </div>
              <p class="text-[11px] font-medium text-hsa leading-relaxed italic">
                "Cette semaine, nous observons une recrudescence des campagnes de <strong>{{ topThreatType }}</strong>.
                La vigilance est de mise sur les <strong>{{ topTarget }}</strong>."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  IconShieldCheck, IconAlertTriangle, IconChevronLeft, IconChevronRight,
  IconAlertCircle, IconActivity, IconLock, IconTrendingUp, IconTrendingDown, IconSparkles
} from '@tabler/icons-vue'
import { useVigitechStore } from '~/stores/vigitech'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'guest'
})

const store = useVigitechStore()
const authStore = useAuthStore()

const filters = ref({
  type: '',
  level: ''
})

const stats = computed(() => {
  const incidents = store.publicIncidents
  const phishing = incidents.filter(i => i.type === 'phishing').length
  const critical = incidents.filter(i => i.threat_level === 'critical').length

  return [
    {
      label: 'Menaces Actives',
      value: store.publicPagination.total,
      icon: IconActivity,
      iconColor: 'text-primary',
      bg: 'bg-primary/5',
      sub: 'Total signalements validés'
    },
    {
      label: 'Phishing',
      value: phishing,
      icon: IconAlertCircle,
      iconColor: 'text-warning',
      bg: 'bg-warning/5',
      trend: 12,
      sub: 'Type le plus fréquent'
    },
    {
      label: 'Critiques',
      value: critical,
      icon: IconLock,
      iconColor: 'text-danger',
      bg: 'bg-danger/5',
      trend: -5,
      sub: 'Urgence immédiate'
    }
  ]
})

const topThreatType = computed(() => {
  const typeCounts: Record<string, number> = {}
  store.publicIncidents.forEach(i => {
    typeCounts[i.type] = (typeCounts[i.type] || 0) + 1
  })
  const sorted = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])
  return sorted[0]?.[0] || 'menaces diverses'
})

const topTarget = computed(() => 'réseaux sociaux au Bénin')

const fetchData = () => {
  const params: any = {
    limit: store.publicPagination.limit,
    offset: store.publicPagination.offset
  }
  if (filters.value.type) params.type = filters.value.type
  if (filters.value.level) params.level = filters.value.level
  store.fetchPublicIncidents(params)
}

const changePage = (delta: number) => {
  const newOffset = store.publicPagination.offset + (delta * store.publicPagination.limit)
  if (newOffset >= 0) {
    store.publicPagination.offset = newOffset
    fetchData()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const resetFilters = () => {
  filters.value = { type: '', level: '' }
  store.publicPagination.offset = 0
  fetchData()
}

onMounted(fetchData)

useHead({
  title: 'Veille cyber communautaire'
})
</script>
