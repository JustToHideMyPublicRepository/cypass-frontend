<template>
  <div v-if="!isDismissed" class="z-[9999]"
    :class="gameState.status === 'invitation' ? 'fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-full max-w-sm px-4 sm:px-0' : 'fixed inset-0 bg-bgClr flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto'">

    <!-- Full Screen Quiz View -->
    <template v-if="gameState.status !== 'invitation'">
      <!-- Theme Toggle -->
      <div class="absolute top-6 right-6 z-50">
        <UiThemeToggle />
      </div>

      <!-- Background Decoration -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] rounded-full">
        </div>
      </div>

      <div class="w-full max-w-2xl relative z-10 flex flex-col gap-8">
        <UtilsOfflineQuizHeader class="mt-24 pt-24" />

        <UtilsOfflineQuizStats />

        <Transition name="fade-slide" mode="out-in">
          <div v-if="gameState.status === 'idle'" :key="'start'">
            <UtilsOfflineQuizStart />
          </div>

          <div v-else-if="gameState.status === 'playing' && sessionQuestions.length > 0" :key="currentQuestionIndex">
            <UtilsOfflineQuizCard />
          </div>

          <div v-else :key="'results'">
            <UtilsOfflineQuizResults />
          </div>
        </Transition>

        <UtilsOfflineQuizStatus :connection-restored="!!connectionRestored" />
      </div>
    </template>

    <UtilsOfflineQuizInvitation :show="gameState.status === 'invitation'" @play="gameState.status = 'idle'"
      @reload="reloadPage" @close="isDismissed = true" />
  </div>
</template>


<script setup lang="ts">
import { ref, reactive, computed, onMounted, provide, onUnmounted } from 'vue'
import { offlineQuestions, type Question } from '~/utils/offlineQuizQuestions'

const props = defineProps<{
  connectionRestored?: boolean
}>()

const isDismissed = ref(false)

const reloadPage = () => {
  if (process.client) {
    window.location.reload()
  }
}

const score = ref(0)
const highScore = ref(0)
const currentQuestionIndex = ref(0)
const sessionQuestions = ref<Question[]>([])
const timer = ref(0)
let timerInterval: any = null

const gameState = reactive({
  status: 'invitation' as 'invitation' | 'idle' | 'playing' | 'finished',
  mode: 'normal' as 'normal' | 'time-attack',
  selectedIndex: null as number | null,
  showFeedback: false,
  shuffledOptions: [] as { text: string; originalIndex: number }[]
})

// Utilities
const shuffleArray = <T>(array: T[]): T[] => {
  const newArr = [...array]
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]]
  }
  return newArr
}

const currentQuestion = computed(() => sessionQuestions.value[currentQuestionIndex.value])
const isLastQuestion = computed(() => currentQuestionIndex.value === sessionQuestions.value.length - 1)

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

const endGame = () => {
  stopTimer()
  gameState.status = 'finished'
  if (score.value > highScore.value) {
    highScore.value = score.value
    if (process.client) {
      localStorage.setItem('cps_quiz_high_score', String(score.value))
    }
  }
}

const startTimer = () => {
  timer.value = 60 // 60 seconds for the whole quiz
  clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    if (timer.value > 0) {
      timer.value--
    } else {
      endGame()
    }
  }, 1000)
}

const prepareQuestion = () => {
  if (!currentQuestion.value) return

  const optionsWithIndex = currentQuestion.value.options.map((opt, idx) => ({
    text: opt,
    originalIndex: idx
  }))

  gameState.shuffledOptions = shuffleArray(optionsWithIndex)
  gameState.selectedIndex = null
  gameState.showFeedback = false
}

const initializeGame = (mode: 'normal' | 'time-attack' = 'normal') => {
  gameState.mode = mode
  gameState.status = 'playing'
  sessionQuestions.value = shuffleArray(offlineQuestions).slice(0, 5)
  currentQuestionIndex.value = 0
  score.value = 0

  if (mode === 'time-attack') {
    startTimer()
  }

  prepareQuestion()
}

const handleAnswer = (shuffledIdx: number) => {
  if (gameState.showFeedback) return

  const selectedOption = gameState.shuffledOptions[shuffledIdx]
  gameState.selectedIndex = shuffledIdx
  gameState.showFeedback = true

  if (selectedOption.originalIndex === currentQuestion.value.correctIndex) {
    score.value += 10
  }
}

const nextQuestion = () => {
  if (isLastQuestion.value) {
    endGame()
  } else {
    currentQuestionIndex.value++
    prepareQuestion()
  }
}

const resetQuiz = () => {
  gameState.status = 'idle'
  stopTimer()
}

// Provide context to sub-components
provide('quiz-state', {
  score,
  highScore,
  currentQuestionIndex,
  sessionQuestions,
  gameState,
  currentQuestion,
  isLastQuestion,
  timer,
  handleAnswer,
  nextQuestion,
  resetQuiz,
  initializeGame
})

onMounted(() => {
  if (process.client) {
    const stored = localStorage.getItem('cps_quiz_high_score')
    if (stored) highScore.value = parseInt(stored)
  }
})

onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
