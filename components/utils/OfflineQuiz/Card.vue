<template>
  <div class="space-y-6">
    <div class="card relative overflow-hidden group">
      <div class="absolute top-0 left-0 w-full h-1 bg-ashAct/20">
        <div class="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out"
          :style="{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }"></div>
      </div>

      <div class="pt-4">
        <span class="text-xs font-bold text-primary mb-2 block">Question {{ currentIndex + 1 }} / {{
          totalQuestions }}</span>
        <h2 class="text-xl font-bold text-hsaAct leading-snug">
          {{ question.text }}
        </h2>
      </div>

      <div class="grid gap-3 mt-8">
        <button v-for="(option, index) in shuffledOptions" :key="index" @click="$emit('select', index)"
          :disabled="showFeedback"
          class="w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group/opt"
          :class="[
            showFeedback
              ? option.originalIndex === question.correctIndex
                ? 'border-success bg-success/10 text-successAct'
                : index === selectedIndex
                  ? 'border-danger bg-danger/10 text-dangerAct'
                  : 'border-ash text-textClr/40'
              : 'border-ash hover:border-primary/50 hover:bg-primary/5 text-hsa'
          ]">
          <span class="font-medium">{{ option.text }}</span>
          <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all" :class="[
            showFeedback
              ? option.originalIndex === question.correctIndex
                ? 'border-success bg-success text-white'
                : index === selectedIndex
                  ? 'border-danger bg-danger text-white'
                  : 'border-ashAct'
              : 'border-ashAct group-hover/opt:border-primary'
          ]">
            <IconCheck v-if="showFeedback && option.originalIndex === question.correctIndex" class="w-4 h-4" />
            <IconX v-else-if="showFeedback && index === selectedIndex" class="w-4 h-4" />
          </div>
        </button>
      </div>

      <!-- Feedback Message -->
      <Transition name="fade">
        <div v-if="showFeedback" class="mt-6 p-4 rounded-xl bg-ash/50 border border-ashAct text-sm text-textClr italic">
          <span class="font-bold text-hsaAct not-italic">Le saviez-vous ?</span><br>
          {{ question.explanation }}
        </div>
      </Transition>
    </div>

    <div v-if="showFeedback" class="flex justify-center mt-6">
      <button @click="$emit('next')" class="btn btn-primary min-w-[200px] group">
        {{ isLastQuestion ? 'Voir les résultats' : 'Question suivante' }}
        <IconArrowRight class="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconCheck, IconX, IconArrowRight } from '@tabler/icons-vue'

interface Question {
  text: string
  options: string[]
  correctIndex: number
  explanation: string
}

interface ShuffledOption {
  text: string
  originalIndex: number
}

defineProps<{
  question: Question
  currentIndex: number
  totalQuestions: number
  shuffledOptions: ShuffledOption[]
  selectedIndex: number | null
  showFeedback: boolean
  isLastQuestion: boolean
}>()

defineEmits(['select', 'next'])
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
