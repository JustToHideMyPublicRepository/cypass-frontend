<template>
  <div class="space-y-6">
    <MeActivitiesDetailHeader />

    <MeActivitiesDetailStatus v-if="profilStore.loading || profilStore.error" :loading="profilStore.loading"
      :error="profilStore.error" @retry="fetchLog" />

    <div v-else-if="log" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Info -->
      <div class="lg:col-span-1 space-y-6">
        <MeActivitiesDetailInfo :log="log" />
      </div>

      <!-- JSON Terminal -->
      <div class="lg:col-span-2 space-y-6">
        <MeActivitiesDetailTerminal :log="log" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'nuxt/app'
import { useProfilStore } from '~/stores/back/user/profil'

const route = useRoute()
const profilStore = useProfilStore()

const logId = route.params.id as string
const log = computed(() => profilStore.currentLog)

const fetchLog = async () => {
  await profilStore.getUserLogById(logId)
}

onMounted(() => {
  fetchLog()

  // Refresh filter persistence timestamp so it doesn't expire while viewing details
  if (import.meta.client) {
    const saved = sessionStorage.getItem('cps_logs_filters')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        parsed.timestamp = Date.now()
        sessionStorage.setItem('cps_logs_filters', JSON.stringify(parsed))
      } catch (e) { }
    }
  }
})

useHead({
  title: computed(() => log.value ? `Détails Log #${log.value.id.slice(-6)}` : 'Détails du Log'),
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
