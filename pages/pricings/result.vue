<template>
  <div class="min-h-screen bg-WtB flex flex-col items-center justify-center p-6 relative overflow-hidden">
    <!-- Background Decor -->
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] rounded-full"></div>
    </div>

    <div class="w-full max-w-lg relative z-10">
      <UiBaseCard class="p-8 md:p-12 text-center shadow-2xl backdrop-blur-xl border-ash/50 rounded-3xl">
        <!-- Status Icon -->
        <div class="mb-8 flex justify-center">
          <div :class="[
            'w-24 h-24 rounded-3xl flex items-center justify-center shadow-inner transform transition-all duration-700 hover:rotate-6 hover:scale-110',
            statusConfig.iconBg
          ]">
            <component :is="statusConfig.icon" class="w-12 h-12" :class="statusConfig.iconColor" />
          </div>
        </div>

        <!-- Content -->
        <h1 class="text-3xl md:text-4xl font-black text-BtW mb-4 tracking-tight leading-tight">
          {{ statusConfig.title }}
        </h1>
        <p class="text-sm md:text-base text-hsa font-medium mb-8 leading-relaxed">
          {{ statusConfig.description }}
        </p>

        <!-- Details (Optional) -->
        <div v-if="transactionId || errorMessage"
          class="mb-8 p-4 bg-ash/30 rounded-2xl border border-ash/50 text-xs text-hsa mono text-left">
          <p v-if="transactionId"><span class="font-bold opacity-60 uppercase mr-2">ID Transaction:</span> {{
            transactionId }}</p>
          <p v-if="errorMessage" class="mt-1"><span class="font-bold opacity-60 uppercase mr-2">Message:</span> {{
            errorMessage }}</p>
        </div>

        <!-- Actions -->
        <div class="flex flex-col gap-3">
          <UiBaseButton :to="statusConfig.primaryAction.to" :variant="statusConfig.primaryAction.variant"
            class="!rounded-2xl !py-4 font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20">
            {{ statusConfig.primaryAction.label }}
          </UiBaseButton>
          <UiBaseButton v-if="statusConfig.secondaryAction" :to="statusConfig.secondaryAction.to" variant="ghost"
            class="!rounded-2xl !py-4 font-black uppercase tracking-widest text-[10px] text-hsa hover:!bg-ash/50">
            {{ statusConfig.secondaryAction.label }}
          </UiBaseButton>
        </div>
      </UiBaseCard>
    </div>

    <div class="mt-8 text-[10px] font-black text-hsa uppercase tracking-[0.3em] opacity-40">
      CYPASS Security & Trust Platform
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, markRaw } from 'vue'
import { useRoute } from '#imports'
import { IconCircleCheck, IconX, IconInfoCircle, IconAlertTriangle } from '@tabler/icons-vue'
import { useProfilStore } from '~/stores/back/user/profil'

definePageMeta({
  layout: 'guest',
})

const route = useRoute()
const profilStore = useProfilStore()

const status = computed(() => (route.query.status as string) || 'error')
const transactionId = computed(() => route.query.id as string)
const errorMessage = computed(() => route.query.message as string)

interface StatusAction {
  label: string
  to: string
  variant: 'primary' | 'secondary' | 'accent' | 'danger' | 'warning' | 'ghost'
}

interface StatusItem {
  title: string
  description: string
  icon: any
  iconColor: string
  iconBg: string
  primaryAction: StatusAction
  secondaryAction: { label: string; to: string } | null
}

const statusConfig = computed<StatusItem>(() => {
  switch (status.value) {
    case 'approved':
      return {
        title: 'Paiement réussi !',
        description: 'Félicitations ! Votre compte a été crédité avec succès. Vous pouvez maintenant profiter pleinement de vos nouveaux services.',
        icon: markRaw(IconCircleCheck),
        iconColor: 'text-success',
        iconBg: 'bg-success/10 border-2 border-success/20',
        primaryAction: { label: 'Détails de la facturation', to: `/dashboard/billing/${transactionId.value}`, variant: 'primary' },
        secondaryAction: { label: 'Voir mon historique', to: '/dashboard/billing' }
      }
    case 'declined':
      return {
        title: 'Paiement refusé',
        description: 'La transaction a été refusée. Veuillez vérifier vos informations de paiement et réessayer.',
        icon: markRaw(IconX),
        iconColor: 'text-danger',
        iconBg: 'bg-danger/10 border-2 border-danger/20',
        primaryAction: { label: 'Réessayer le paiement', to: '/pricings', variant: 'primary' },
        secondaryAction: { label: 'Besoin d\'aide ?', to: '/support' }
      }
    case 'canceled':
      return {
        title: 'Paiement annulé',
        description: 'Vous avez annulé la transaction. Si c\'était une erreur, vous pouvez reprendre le processus à tout moment.',
        icon: markRaw(IconInfoCircle),
        iconColor: 'text-warning',
        iconBg: 'bg-warning/10 border-2 border-warning/20',
        primaryAction: { label: 'Retour aux tarifs', to: '/pricings', variant: 'secondary' },
        secondaryAction: null
      }
    case 'missing_id':
    case 'error':
    default:
      return {
        title: 'Heu... Erreur !',
        description: 'Une erreur inattendue est survenue lors de la communication avec le service de paiement. Ne vous inquiétez pas, rien n\'a été débité.',
        icon: markRaw(IconAlertTriangle),
        iconColor: 'text-warning',
        iconBg: 'bg-warning/10 border-2 border-warning/20',
        primaryAction: { label: 'Retour aux tarifs', to: '/pricings', variant: 'secondary' },
        secondaryAction: { label: 'Contacter le support', to: '/support' }
      }
  }
})

onMounted(async () => {
  if (status.value === 'approved') {
    // Refresh user profile to update credits
    await profilStore.getProfile()
  }
})
</script>

<style scoped>
@keyframes float {
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-10px);
  }

  100% {
    transform: translateY(0px);
  }
}

.mono {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}
</style>
