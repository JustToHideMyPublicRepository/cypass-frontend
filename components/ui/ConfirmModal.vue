<template>
  <UiBaseModal :show="show" :max-width="maxWidth" @close="$emit('cancel')" class="!p-0">
    <div class="py-4 md:py-6 text-center space-y-8 animate-fade-up">
      <!-- Icône d'alerte ou personnalisée -->
      <div v-if="icon && (typeof icon === 'object' || typeof icon === 'function')"
        :class="['w-20 h-20 rounded-[2rem] mx-auto flex items-center justify-center mb-4 transition-all shadow-lg', iconBgClass]">
        <component :is="icon" class="w-10 h-10" />
      </div>

      <!-- Titre et Message publicitaire -->
      <div class="space-y-3 px-6">
        <h3 class="text-2xl font-black text-BtW tracking-tight uppercase leading-tight">{{ title }}</h3>
        <p v-if="message" class="text-sm md:text-base text-hsa font-medium leading-relaxed">
          {{ message }}
        </p>
      </div>

      <!-- Actions de confirmation -->
      <div class="flex flex-col sm:flex-row gap-4 px-6 pb-2">
        <UiBaseButton variant="ghost" class="flex-1 order-2 sm:order-1 !rounded-2xl font-bold py-4 h-auto border-none"
          @click="$emit('cancel')" type="button">
          {{ cancelText }}
        </UiBaseButton>
        <UiBaseButton :variant="variant" class="flex-1 order-1 sm:order-2 !rounded-2xl font-black py-4 h-auto shadow-lg"
          :loading="loading" @click="$emit('confirm')">
          {{ confirmText }}
        </UiBaseButton>
      </div>
    </div>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { computed, markRaw } from 'vue'
import { IconAlertTriangle } from '@tabler/icons-vue'

// Propriétés de la modal de confirmation
const props = withDefaults(defineProps<{
  show: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  icon?: any
  maxWidth?: string
}>(), {
  title: 'Confirmation',
  message: 'Êtes-vous sûr de vouloir effectuer cette action ?',
  confirmText: 'Confirmer',
  cancelText: 'Annuler',
  loading: false,
  variant: 'primary',
  icon: () => markRaw(IconAlertTriangle),
  maxWidth: 'sm'
})

// Événements émis
defineEmits(['confirm', 'cancel'])

// Calcul de la classe d'arrière-plan de l'icône selon la variante
const iconBgClass = computed(() => {
  switch (props.variant) {
    case 'danger': return 'bg-danger/10 text-danger shadow-danger/10'
    case 'secondary': return 'bg-hsa/10 text-hsa shadow-hsa/10'
    default: return 'bg-primary/10 text-primary shadow-primary/10'
  }
})
</script>
