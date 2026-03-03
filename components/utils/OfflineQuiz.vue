<template>
  <div class="fixed inset-0 z-[9999] bg-bgClr flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto">
    <!-- Background Decoration -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] rounded-full"></div>
    </div>

    <div class="w-full max-w-2xl relative z-10 flex flex-col gap-8">
      <UtilsOfflineQuizHeader />

      <UtilsOfflineQuizStats :score="score" :high-score="highScore" />

      <Transition name="fade-slide" mode="out-in">
        <div v-if="!gameState.isFinished && sessionQuestions.length > 0" :key="currentQuestionIndex">
          <UtilsOfflineQuizCard :question="currentQuestion" :current-index="currentQuestionIndex"
            :total-questions="sessionQuestions.length" :shuffled-options="gameState.shuffledOptions"
            :selected-index="gameState.selectedIndex" :show-feedback="gameState.showFeedback"
            :is-last-question="isLastQuestion" @select="handleAnswer" @next="nextQuestion" />
        </div>

        <div v-else :key="'results'">
          <UtilsOfflineQuizResults :score="score" :total-questions="sessionQuestions.length" @reset="resetQuiz" />
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

interface Question {
  text: string
  options: string[]
  correctIndex: number
  explanation: string
}

const allQuestions: Question[] = [
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
  },
  {
    text: "Que signifie l'acronyme RGPD ?",
    options: [
      "Règlement Général sur la Protection des Données",
      "Réseau Global de Protection Digitale",
      "Registre des Grands Protocoles de Défense",
      "Règlement de Gestion des Particuliers et des Données"
    ],
    correctIndex: 0,
    explanation: "Le RGPD est le cadre juridique européen qui protège la vie privée et les données personnelles des citoyens."
  },
  {
    text: "Quelle est la première action à faire en cas de vol de votre téléphone ?",
    options: [
      "Appeler la police",
      "Acheter un nouveau téléphone",
      "Bloquer votre carte SIM et vos comptes à distance",
      "Envoyer un SMS au voleur"
    ],
    correctIndex: 2,
    explanation: "La priorité est de sécuriser l'accès à vos données bancaires, emails et réseaux sociaux en bloquant les accès distants."
  },
  {
    text: "Quel est le but principal d'un pare-feu (firewall) ?",
    options: [
      "Éteindre les incendies de serveurs",
      "Améliorer la vitesse de téléchargement",
      "Filtrer le trafic entrant et sortant pour bloquer les menaces",
      "Nettoyer les virus sur le disque dur"
    ],
    correctIndex: 2,
    explanation: "Un pare-feu surveille et contrôle le trafic réseau entrant et sortant selon des règles de sécurité établies."
  },
  {
    text: "Que signifie 'le HTTPS' (petit cadenas) dans la barre d'adresse ?",
    options: [
      "Le site est hébergé en France",
      "La connexion entre vous et le site est cryptée",
      "Le site appartient obligatoirement au gouvernement",
      "Le site est protégé contre tous les virus"
    ],
    correctIndex: 1,
    explanation: "HTTPS garantit que les informations échangées ne peuvent pas être interceptées 'en clair' par un pirate sur le réseau."
  },
  {
    text: "Qu'est-ce qu'une attaque 'Zero-Day' ?",
    options: [
      "Une attaque qui dure 24 heures",
      "Une attaque pendant les jours fériés",
      "Une attaque exploitant une faille inconnue du fabricant",
      "Une attaque sans aucune conséquence"
    ],
    correctIndex: 2,
    explanation: "Une faille Zero-Day est une vulnérabilité que le développeur n'a pas encore découverte, et donc pour laquelle aucun correctif n'existe encore."
  }
]

// Utilities
const shuffleArray = <T>(array: T[]): T[] => {
  const newArr = [...array]
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]]
  }
  return newArr
}

const score = ref(0)
const highScore = ref(0)
const currentQuestionIndex = ref(0)
const sessionQuestions = ref<Question[]>([])

const gameState = reactive({
  selectedIndex: null as number | null,
  showFeedback: false,
  isFinished: false,
  shuffledOptions: [] as { text: string; originalIndex: number }[]
})

const currentQuestion = computed(() => sessionQuestions.value[currentQuestionIndex.value])
const isLastQuestion = computed(() => currentQuestionIndex.value === sessionQuestions.value.length - 1)

const initializeGame = () => {
  // Select 5 random questions
  sessionQuestions.value = shuffleArray(allQuestions).slice(0, 5)
  currentQuestionIndex.value = 0
  score.value = 0
  prepareQuestion()
}

const prepareQuestion = () => {
  if (!currentQuestion.value) return

  // Shuffle options and keep track of original index to verify answer
  const optionsWithIndex = currentQuestion.value.options.map((opt, idx) => ({
    text: opt,
    originalIndex: idx
  }))

  gameState.shuffledOptions = shuffleArray(optionsWithIndex)
  gameState.selectedIndex = null
  gameState.showFeedback = false
}

onMounted(() => {
  if (process.client) {
    const stored = localStorage.getItem('cps_quiz_high_score')
    if (stored) highScore.value = parseInt(stored)
  }
  initializeGame()
})

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
    gameState.isFinished = true
    if (score.value > highScore.value) {
      highScore.value = score.value
      if (process.client) {
        localStorage.setItem('cps_quiz_high_score', String(score.value))
      }
    }
  } else {
    currentQuestionIndex.value++
    prepareQuestion()
  }
}

const resetQuiz = () => {
  gameState.isFinished = false
  initializeGame()
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
