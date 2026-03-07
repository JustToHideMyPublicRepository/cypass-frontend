<template>
  <div class="max-w-3xl mx-auto space-y-8 md:space-y-12 relative z-10 px-4 sm:px-6">
    <RootStatusHero :status="globalStatus" />
    <RootStatusMainCard :status="globalStatus" :last-update="lastUpdate" />
    <RootStatusComponents :components="systemComponents" />
    <RootStatusHistory :incidents="incidents" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { IconCheck, IconAlertTriangle, IconAlertCircle, IconInfoCircle } from '@tabler/icons-vue'

definePageMeta({
  layout: 'guest'
})

// Seeded random generator
const getSeededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

const today = new Date()
const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()

const lastUpdate = ref(today.toLocaleTimeString())

const statusOptions = [
  { label: 'Opérationnel', color: 'text-success', dot: 'bg-success', shadow: '0 0 8px rgba(34,197,94,0.6)', level: 0 },
  { label: 'Performance dégradée', color: 'text-warning', dot: 'bg-warning', shadow: '0 0 8px rgba(249,115,22,0.6)', level: 1 },
  { label: 'Interruption partielle', color: 'text-orange-500', dot: 'bg-orange-500', shadow: '0 0 8px rgba(249,115,22,0.6)', level: 2 },
  { label: 'Incident majeur', color: 'text-danger', dot: 'bg-danger', shadow: '0 0 8px rgba(239,68,68,0.6)', level: 3 },
]

const componentsList = [
  'API Gateway',
  'Base de Données Centrale',
  'Authentification (OAuth2)',
  'Service de Notification',
  'Interface Web (Frontend)',
  'Moteur d\'Analyse IA',
  'API de Sécurité'
]

const systemComponents = computed(() => {
  return componentsList.map((name, index) => {
    const random = getSeededRandom(dateSeed + index)
    let statusIdx = 0
    if (random > 0.95) statusIdx = 3
    else if (random > 0.9) statusIdx = 2
    else if (random > 0.8) statusIdx = 1

    const status = statusOptions[statusIdx]
    return {
      name,
      statusLabel: status.label,
      statusColor: status.color,
      dotColor: status.dot,
      shadow: status.shadow,
      level: status.level
    }
  })
})

const globalStatus = computed(() => {
  const maxLevel = Math.max(...systemComponents.value.map(c => c.level))

  if (maxLevel === 0) {
    return {
      label: 'Système',
      colorClass: 'text-success',
      icon: IconCheck,
      message: 'Tous les systèmes sont opérationnels',
      borderColor: 'border-success',
      shadowColor: 'shadow-success/10',
      bgColor: 'bg-success/20',
      textColor: 'text-success'
    }
  } else if (maxLevel === 1) {
    return {
      label: 'Ralenti',
      colorClass: 'text-warning',
      icon: IconInfoCircle,
      message: 'Certains services sont ralentis',
      borderColor: 'border-warning',
      shadowColor: 'shadow-warning/10',
      bgColor: 'bg-warning/20',
      textColor: 'text-warning'
    }
  } else if (maxLevel === 2) {
    return {
      label: 'Perturbé',
      colorClass: 'text-orange-500',
      icon: IconAlertTriangle,
      message: 'Interruption partielle de service',
      borderColor: 'border-orange-500',
      shadowColor: 'shadow-orange-500/10',
      bgColor: 'bg-orange-500/20',
      textColor: 'text-orange-500'
    }
  } else {
    return {
      label: 'Critique',
      colorClass: 'text-danger',
      icon: IconAlertCircle,
      message: 'Incident majeur en cours',
      borderColor: 'border-danger',
      shadowColor: 'shadow-danger/10',
      bgColor: 'bg-danger/20',
      textColor: 'text-danger'
    }
  }
})

// Mock Incidents History
const incidentDescriptions = [
  { title: 'Maintenance de la base de données', description: 'Mise à jour planifiée des index pour améliorer les performances de recherche.', type: 'Maintenance' },
  { title: 'Optimisation du réseau API', description: 'Ajustement de la configuration du pare-feu pour réduire la latence.', type: 'Optimisation' },
  { title: 'Pic de trafic inhabituel', description: 'Augmentation de la charge traitée avec succès par l\'auto-scaling.', type: 'Performance' },
  { title: 'Mise à jour du certificat SSL', description: 'Renouvellement annuel des certificats de sécurité sur tous les sous-domaines.', type: 'Sécurité' }
]

const incidents = computed(() => {
  const countRandom = getSeededRandom(dateSeed * 2)
  const count = Math.floor(countRandom * 3) // 0 to 2 incidents

  const result = []
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(getSeededRandom(dateSeed + 100 + i) * incidentDescriptions.length)
    const data = incidentDescriptions[idx]

    // Fake date
    const dayOffset = i + 2
    const date = new Date(today)
    date.setDate(today.getDate() - dayOffset)

    result.push({
      id: i,
      date: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }),
      ...data
    })
  }
  return result
})

onMounted(() => {
  lastUpdate.value = new Date().toLocaleTimeString()
})

useHead({
  title: 'Statut de services',
  meta: [
    { name: 'description', content: 'Vérifiez en temps réel l\'état de fonctionnement des services CYPASS.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
