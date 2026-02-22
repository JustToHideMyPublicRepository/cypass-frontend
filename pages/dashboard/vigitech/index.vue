<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-black text-BtW tracking-tight">VigiTech</h1>
        <p class="text-hsa font-bold">Vos signalements et veille cybernétique</p>
      </div>
      <UiBaseButton variant="primary" size="lg" @click="showCreateModal = true"
        class="!rounded-2xl shadow-xl shadow-primary/20">
        <IconAlertCircle class="w-5 h-5 mr-2" /> Signaler un Incident
      </UiBaseButton>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Feed -->
      <div class="lg:col-span-3 space-y-6">
        <div v-if="store.loading && !store.userIncidents.length" class="space-y-6">
          <UiBaseCard v-for="i in 3" :key="i" class="animate-pulse">
            <div class="h-24 bg-ash/10 rounded-xl"></div>
          </UiBaseCard>
        </div>

        <template v-else-if="store.userIncidents.length">
          <RootVigitechIncidentCard v-for="incident in store.userIncidents" :key="incident.id" :incident="incident"
            showFooter :detailUrl="`/dashboard/vigitech/${incident.id}`" />
        </template>

        <div v-else class="text-center py-20 px-6 glass-panel rounded-[2rem] border-2 border-dashed border-ash">
          <div class="w-16 h-16 bg-ash/10 rounded-2xl flex items-center justify-center text-hsa mx-auto mb-4">
            <IconShieldCheck class="w-8 h-8 opacity-20" />
          </div>
          <h3 class="text-lg font-black text-BtW">Aucun incident signalé</h3>
          <p class="text-hsa text-sm mt-2 max-w-sm mx-auto">
            Vous n'avez pas encore soumis de signalement. Cliquez sur le bouton ci-dessus pour rapporter un incident.
          </p>
        </div>
      </div>

      <!-- Sidebar Widgets -->
      <div class="space-y-6">
        <UiBaseCard title="Sources Surveillées" class="!rounded-[2rem]">
          <ul class="space-y-3 text-[11px] font-bold uppercase tracking-wider">
            <li class="flex justify-between items-center text-hsa">
              <span>Traffic Réseau</span>
              <span class="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            </li>
            <li class="flex justify-between items-center text-hsa">
              <span>Logs Système</span>
              <span class="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            </li>
            <li class="flex justify-between items-center text-hsa">
              <span>Feeds CERT-BJ</span>
              <span class="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            </li>
            <li class="flex justify-between items-center text-hsa">
              <span>Dark Web Monitor</span>
              <span class="w-2 h-2 rounded-full bg-warning"></span>
            </li>
          </ul>
        </UiBaseCard>

        <UiBaseCard
          class="bg-primary text-white border-none !rounded-[2rem] shadow-xl shadow-primary/20 overflow-hidden relative group">
          <div
            class="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700">
          </div>
          <h3 class="font-black mb-2 flex items-center gap-2 relative z-10">
            <IconBroadcast class="w-5 h-5 text-white/90" /> Mode Veille
          </h3>
          <p class="text-xs text-white/80 mb-6 leading-relaxed relative z-10">
            Analyse continue des menaces ciblant l'infrastructure nationale.
          </p>
          <div class="w-full bg-white/20 rounded-full h-1.5 mb-2 overflow-hidden relative z-10">
            <div class="bg-white h-1.5 rounded-full w-2/3 animate-[pulse_2s_infinite]"></div>
          </div>
          <div class="text-[10px] font-black uppercase tracking-widest text-white/70 text-right relative z-10">
            Analyse Active...
          </div>
        </UiBaseCard>
      </div>
    </div>

    <!-- Create Incident Modal -->
    <ModalVigitechCreateIncident :show="showCreateModal" @close="showCreateModal = false"
      @success="onIncidentCreated" />
  </div>
</template>

<script setup lang="ts">
import { IconBroadcast, IconAlertCircle, IconShieldCheck } from '@tabler/icons-vue'
import { useVigitechStore } from '~/stores/vigitech'

definePageMeta({
  layout: 'default'
})

const store = useVigitechStore()
const showCreateModal = ref(false)

const onIncidentCreated = () => {
  // Logic after successful creation is handled in the store (fetchUserIncidents)
}

onMounted(() => {
  store.fetchUserIncidents()
})

useHead({
  title: 'VigiTech | Dashboard'
})
</script>
