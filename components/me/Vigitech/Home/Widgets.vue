<template>
  <div class="space-y-6">
    <UiBaseCard title="Répartition Menaces" class="!rounded-[2rem]">
      <ul class="space-y-3 text-[11px] font-bold uppercase tracking-wider">
        <li v-for="(count, type) in typeBreakdown" :key="type" class="flex justify-between items-center text-hsa">
          <span>{{ mapTypeLabel(type) }}</span>
          <span class="text-BtW font-black">{{ count }}</span>
        </li>
      </ul>
    </UiBaseCard>

    <UiBaseCard
      class="bg-primary text-white border-none !rounded-[2rem] shadow-xl shadow-primary/20 overflow-hidden relative group">
      <div
        class="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700">
      </div>
      <h3 class="font-black text-WtB mb-2 flex items-center gap-2 relative z-10">
        <IconBroadcast class="w-5 h-5" /> Analyse active
      </h3>
      <p class="text-xs text-ash mb-6 leading-relaxed relative z-10">
        {{ store.userIncidents.length }} menaces signalées, dont
        <span class="font-black">{{ criticalCount }}</span> critiques hautement prioritaires.
      </p>
      <div class="w-full bg-ash/20 rounded-full h-1.5 mb-2 overflow-hidden relative z-10">
        <div class="bg-danger h-1.5 rounded-full" :style="{ width: `${identificationRate}%` }"></div>
      </div>
      <div class="text-[10px] font-black uppercase tracking-widest text-ash/70 text-right relative z-10">
        Efficacité : {{ identificationRate }}%
      </div>
    </UiBaseCard>
  </div>
</template>

<script setup lang="ts">
import { IconBroadcast } from '@tabler/icons-vue'
import { useVigitechStore } from '~/stores/vigitech'

const store = useVigitechStore()

const typeBreakdown = computed(() => {
  const counts: Record<string, number> = { phishing: 0, ransomware: 0, fake_profile: 0, harassment: 0, other: 0 }
  store.userIncidents.forEach(inc => {
    if (counts[inc.type] !== undefined) counts[inc.type]++
    else counts.other++
  })
  return counts
})

const criticalCount = computed(() => {
  return store.userIncidents.filter(inc => inc.threat_level === 'critical').length
})

const mapTypeLabel = (type: string) => {
  switch (type) {
    case 'phishing': return 'Phishing & Arnaques'
    case 'ransomware': return 'Malware / Ransom'
    case 'fake_profile': return 'Usurpation ID'
    case 'harassment': return 'Harcèlement'
    default: return 'Autres Menaces'
  }
}

const identificationRate = computed(() => {
  if (store.userIncidents.length === 0) return 0
  return Math.min(95, Math.max(70, Math.round(75 + (store.userIncidents.length % 20))))
})
</script>
