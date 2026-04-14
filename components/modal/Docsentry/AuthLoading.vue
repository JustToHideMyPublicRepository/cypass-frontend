<template>
  <div class="py-4 animate-fade-in">
    <div class="mb-6 p-6 bg-primary/5 rounded-[2rem] border-2 border-primary/10 shadow-xl shadow-primary/5">
      <p class="text-xs font-black text-primary tracking-[0.2em] mb-6 flex items-center gap-3">
        <span class="relative flex h-3 w-3">
          <UiLogoLoader size="sm" />
        </span>
        Certification en cours sur la Blockchain
      </p>
      <UtilsStepProgress :steps="activeSteps" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Step } from '~/utils/docsentry'

defineProps<{
  activeSteps: Step[]
}>()
</script>
