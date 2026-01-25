<template>
  <div class="space-y-4">
    <div v-for="(step, index) in steps" :key="step.id" class="relative">
      <!-- Line between steps -->
      <div v-if="index < steps.length - 1" 
        class="absolute left-[15px] top-8 w-[2px] h-[calc(100%-8px)] transition-colors duration-500"
        :class="step.status === 'completed' ? 'bg-success' : 'bg-ash'">
      </div>

      <div class="flex items-start gap-4 group">
        <!-- Step Icon/Indicator -->
        <div class="relative z-10 flex-shrink-0 mt-1">
          <div class="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500"
            :class="statusClasses[step.status]">
            <template v-if="step.status === 'completed'">
              <IconCheck class="w-5 h-5" />
            </template>
            <template v-else-if="step.status === 'loading'">
              <div class="w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin"></div>
            </template>
            <template v-else-if="step.status === 'error'">
              <IconX class="w-5 h-5" />
            </template>
            <span v-else class="text-xs font-bold">{{ index + 1 }}</span>
          </div>
        </div>

        <!-- Step Content -->
        <div class="flex-1 pb-4">
          <h4 class="text-sm font-bold transition-colors duration-300"
            :class="step.status === 'pending' ? 'text-hsa/50' : 'text-BtW'">
            {{ step.label }}
          </h4>
          <p class="text-xs text-hsa leading-tight mt-0.5" 
            :class="step.status === 'pending' ? 'opacity-40' : 'opacity-100'">
            {{ step.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconCheck, IconX } from '@tabler/icons-vue'
import type { Step } from '~/utils/docsentry'

defineProps<{
  steps: Step[]
}>()

const statusClasses = {
  pending: 'bg-WtB border-ash text-hsa/30',
  loading: 'bg-primary/5 border-primary text-primary shadow-[0_0_10px_rgba(var(--color-primary),0.2)]',
  completed: 'bg-success border-success text-WtB',
  error: 'bg-danger/5 border-danger text-danger'
}
</script>
