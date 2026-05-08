<template>
  <div class="relative pb-8">
    <!-- Contenu principal des développeurs -->
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

      <div class="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
        <div class="space-y-6 animate-fade-right">
          <span class="badge badge-primary">Pour les Développeurs</span>
          <h2> Intégrez la confiance <br /> <span class="text-primary">dans vos apps</span> </h2>
          <p>
            Accédez à nos API REST sécurisées pour automatiser la vérification d'identité, la signature de documents et
            la consultation des registres officiels.
          </p>

          <div class="flex flex-col sm:flex-row gap-3 pt-2">
            <UiBaseButton to="/support/tech" class="w-full sm:w-auto px-6 py-3">
              Lire la Documentation
            </UiBaseButton>
            <UiBaseButton variant="secondary" @click="handleApiKey" class="w-full sm:w-auto px-6 py-3">
              Obtenir une Clé API
            </UiBaseButton>
          </div>
        </div>

        <div class="relative animate-fade-left">
          <div class="absolute inset-0 bg-blue-500 blur-[80px] md:blur-[100px] opacity-10 rounded-full"></div>
          <UiAppFrame type="terminal" title="bash" :glass="true" rounded="rounded-2xl" padding="p-4 md:p-6"
            class="font-code text-[11px] md:text-sm bg-slate-900 text-slate-300  border-BtW"
            body-class="space-y-1.5 md:space-y-2">
            <p>
              <span class="text-danger">curl</span> -X POST https://api.cypass.bj/v1/sign \
            </p>
            <p class="pl-4">-H <span class="text-success">"Authorization: Bearer YOUR_API_KEY"</span> \</p>
            <p class="pl-4">-H <span class="text-success">"Content-Type: application/json"</span> \</p>
            <p class="pl-4">-d <span class="text-warning">'{</span></p>
            <p class="pl-8 text-warning">"file_hash": "a7f9...9b2",</p>
            <p class="pl-8 text-warning">"signatory": "user_123"</p>
            <p class="pl-4 text-warning">}'</p>
            <p class="mt-4 text-success"># Réponse : 200 OK</p>
            <p>{ "status": "signed", "timestamp": "{{ apiTimestamp }}" }</p>
          </UiAppFrame>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from '~/stores/front/toast'
import { getRandomPastDate } from '~/utils/date'

// Configuration de la page
definePageMeta({
  layout: 'guest'
})

const apiTimestamp = computed(() => {
  return getRandomPastDate(5, 21).toISOString()
})

const toastStore = useToastStore()

/**
 * Gère la demande de clé API
 * Affiche une notification d'information car la fonctionnalité est en cours de développement
 */
const handleApiKey = () => {
  toastStore.showToast('info', 'Bientôt disponible', 'La génération automatique de clés API sera disponible dans la prochaine mise à jour.', 4000)
}

// Métadonnées SEO
useHead({
  title: 'Développeurs',
  meta: [
    { name: 'description', content: 'Ressources et API pour les développeurs souhaitant intégrer les services de confiance CYPASS.' },
    { name: 'robots', content: 'index, follow' }
  ]
})
</script>
