<template>
  <div class="fixed inset-0 z-[9999] bg-bgClr flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto">
    <!-- Background Decoration -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] rounded-full"></div>
    </div>

    <div class="w-full max-w-2xl relative z-10 flex flex-col gap-8">
      <!-- Header -->
      <div class="text-center space-y-2">
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-2">
          <IconWifiOff class="w-4 h-4" />
          Connexion perdue
        </div>
        <h1 class="text-3xl sm:text-4xl font-heading font-extrabold text-hsaAct lg:text-5xl">
          CYPASS <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Quiz</span>
        </h1>
        <p class="text-textClr/70 max-w-md mx-auto">
          La connexion est interrompue. Profitez-en pour tester vos connaissances en cybersécurité !
        </p>
      </div>

      <!-- Stats Bar -->
      <div class="flex items-center justify-between gap-4 p-4 rounded-2xl bg-WtB border border-ash shadow-sm">
        <div class="flex flex-col">
          <span class="text-[10px] uppercase font-bold text-textClr/50 tracking-widest">Score Actuel</span>
          <span class="text-2xl font-heading font-black text-primary">{{ score }}</span>
        </div>
        <div class="h-10 w-[1px] bg-ash"></div>
        <div class="flex flex-col items-end">
          <span class="text-[10px] uppercase font-bold text-textClr/50 tracking-widest">Meilleur Record</span>
          <span class="text-2xl font-heading font-black text-secondary">{{ highScore }}</span>
        </div>
      </div>

      <!-- Quiz Content -->
      <Transition name="fade-slide" mode="out-in">
        <div v-if="!gameState.isFinished" :key="currentQuestionIndex" class="space-y-6">
          <div class="card relative overflow-hidden group">
            <div class="absolute top-0 left-0 w-full h-1 bg-ashAct/20">
              <div class="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out"
                :style="{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }"></div>
            </div>

            <div class="pt-4">
              <span class="text-xs font-bold text-primary mb-2 block">Question {{ currentQuestionIndex + 1 }} / {{
                questions.length }}</span>
              <h2 class="text-xl font-bold text-hsaAct leading-snug">
                {{ currentQuestion.text }}
              </h2>
            </div>

            <div class="grid gap-3 mt-8">
              <button v-for="(option, index) in currentQuestion.options" :key="index" @click="handleAnswer(index)"
                :disabled="gameState.showFeedback"
                class="w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group/opt"
                :class="[
                  gameState.showFeedback
                    ? index === currentQuestion.correctIndex
                      ? 'border-success bg-success/10 text-successAct'
                      : index === gameState.selectedIndex
                        ? 'border-danger bg-danger/10 text-dangerAct'
                        : 'border-ash text-textClr/40'
                    : 'border-ash hover:border-primary/50 hover:bg-primary/5 text-hsa'
                ]">
                <span class="font-medium">{{ option }}</span>
                <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all" :class="[
                  gameState.showFeedback
                    ? index === currentQuestion.correctIndex
                      ? 'border-success bg-success text-white'
                      : index === gameState.selectedIndex
                        ? 'border-danger bg-danger text-white'
                        : 'border-ashAct'
                    : 'border-ashAct group-hover/opt:border-primary'
                ]">
                  <IconCheck v-if="gameState.showFeedback && index === currentQuestion.correctIndex" class="w-4 h-4" />
                  <IconX v-else-if="gameState.showFeedback && index === gameState.selectedIndex" class="w-4 h-4" />
                </div>
              </button>
            </div>

            <!-- Feedback Message -->
            <Transition name="fade">
              <div v-if="gameState.showFeedback"
                class="mt-6 p-4 rounded-xl bg-ash/50 border border-ashAct text-sm text-textClr italic">
                <span class="font-bold text-hsaAct not-italic">Le saviez-vous ?</span><br>
                {{ currentQuestion.explanation }}
              </div>
            </Transition>
          </div>

          <div v-if="gameState.showFeedback" class="flex justify-center mt-6">
            <button @click="nextQuestion" class="btn btn-primary min-w-[200px] group">
              {{ isLastQuestion ? 'Voir les résultats' : 'Question suivante' }}
              <IconArrowRight class="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        <!-- End Screen -->
        <div v-else class="card text-center space-y-8 animate-fade-in">
          <div class="relative inline-block">
            <div class="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
            <div
              class="relative w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center mx-auto shadow-xl transform rotate-3">
              <IconTrophy class="w-12 h-12 text-white" />
            </div>
          </div>

          <div class="space-y-2">
            <h2 class="text-3xl font-black text-hsaAct">Félicitations !</h2>
            <p class="text-textClr/70">Vous avez terminé le CYPASS Quiz.</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 rounded-2xl bg-ash/30 border border-ashAct">
              <span class="block text-[10px] uppercase font-bold text-textClr/50 mb-1">Score Final</span>
              <span class="text-3xl font-black text-primary">{{ score }}</span>
            </div>
            <div class="p-4 rounded-2xl bg-ash/30 border border-ashAct">
              <span class="block text-[10px] uppercase font-bold text-textClr/50 mb-1">Questions</span>
              <span class="text-3xl font-black text-secondary">{{ score / 10 }}/{{ questions.length }}</span>
            </div>
          </div>

          <button @click="resetQuiz" class="btn btn-secondary w-full">
            Rejouer pour s'améliorer
          </button>
        </div>
      </Transition>

      <!-- Connection Status indicator at bottom -->
      <div class="text-center mt-4">
        <div class="inline-flex items-center gap-2 text-textClr/40 text-xs font-medium">
          <div class="w-2 h-2 rounded-full bg-warning border border-warning/50 animate-pulse"></div>
          En attente de rétablissement du réseau...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { IconWifiOff, IconCheck, IconX, IconArrowRight, IconTrophy } from '@tabler/icons-vue'

interface Question {
  text: string
  options: string[]
  correctIndex: number
  explanation: string
}

const questions: Question[] = [
  {
    text: "Quelle est la méthode la plus sûre pour protéger vos comptes en ligne ?",
    options: [
      "Utiliser le même mot de passe partout",
      "Activer l'authentification à deux facteurs (2FA)",
      "Changer de mot de passe tous les ans",
      "Ne jamais se déconnecter"
    ],
    correctIndex: 1,
    explanation: "La 2FA ajoute une couche de sécurité cruciale : même si un pirate trouve votre mot de passe, il ne pourra pas accéder à votre compte sans le second code."
  },
  {
    text: "Vous recevez un email alarmant d'une banque vous demandant de cliquer sur un lien pour 'vérifier votre identité'. De quoi s'agit-il ?",
    options: [
      "Une procédure de sécurité standard",
      "Une mise à jour système",
      "Une tentative de phishing (hameçonnage)",
      "Un cadeau d'anniversaire"
    ],
    correctIndex: 2,
    explanation: "Les banques ne demandent jamais d'identifiants par email. Vérifiez toujours l'adresse de l'expéditeur et ne cliquez jamais sur des liens suspects."
  },
  {
    text: "Qu'est-ce qu'un Ransomware (rançongiciel) ?",
    options: [
      "Un logiciel qui accélère votre PC",
      "Un virus qui crypte vos fichiers et demande de l'argent",
      "Un programme de nettoyage de disque",
      "Un type de carte réseau"
    ],
    correctIndex: 1,
    explanation: "Le ransomware prend vos données en otage. La meilleure protection est d'avoir des sauvegardes régulières hors ligne."
  },
  {
    text: "Pourquoi est-il risqué d'utiliser un Wi-Fi public gratuit sans VPN ?",
    options: [
      "La connexion est trop lente",
      "Vos données peuvent être interceptées par d'autres utilisateurs",
      "Cela décharge la batterie plus vite",
      "Le Wi-Fi public est payant en réalité"
    ],
    correctIndex: 1,
    explanation: "Sur un réseau ouvert, les pirates peuvent 'écouter' votre trafic. Un VPN encrypte vos données, les rendant illisibles pour les tiers."
  },
  {
    text: "Quelle caractéristique définit un mot de passe robuste ?",
    options: [
      "Le nom de votre animal de compagnie",
      "Au moins 12 caractères mixant lettres, chiffres et symboles",
      "Votre date de naissance",
      "Le mot 'Azerty123'"
    ],
    correctIndex: 1,
    explanation: "La complexité et la longueur augmentent exponentiellement le temps nécessaire à un ordinateur pour deviner votre mot de passe par 'force brute'."
  }
]

const score = ref(0)
const highScore = ref(0)
const currentQuestionIndex = ref(0)

const gameState = reactive({
  selectedIndex: null as number | null,
  showFeedback: false,
  isFinished: false
})

const currentQuestion = computed(() => questions[currentQuestionIndex.value])
const isLastQuestion = computed(() => currentQuestionIndex.value === questions.length - 1)

onMounted(() => {
  if (process.client) {
    const stored = localStorage.getItem('cps_quiz_high_score')
    if (stored) highScore.value = parseInt(stored)
  }
})

const handleAnswer = (index: number) => {
  if (gameState.showFeedback) return

  gameState.selectedIndex = index
  gameState.showFeedback = true

  if (index === currentQuestion.value.correctIndex) {
    score.value += 10
  }
}

const nextQuestion = () => {
  if (isLastQuestion.value) {
    gameState.isFinished = true
    if (score.value > highScore.value) {
      highScore.value = score.value
      if (process.client) {
        localStorage.setItem('cps_quiz_high_score', String(score.value))
      }
    }
  } else {
    currentQuestionIndex.value++
    gameState.selectedIndex = null
    gameState.showFeedback = false
  }
}

const resetQuiz = () => {
  score.value = 0
  currentQuestionIndex.value = 0
  gameState.selectedIndex = null
  gameState.showFeedback = false
  gameState.isFinished = false
}
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
