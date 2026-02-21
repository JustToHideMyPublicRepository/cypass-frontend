<template>
  <div class="relative pb-8">
    <!-- Contenu principal des développeurs -->
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

      <div class="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
        <div class="space-y-6 animate-fade-right">
          <span class="badge badge-primary">Pour les Développeurs</span>
          <h1 class="text-3xl md:text-5xl font-black text-BtW tracking-tight leading-tight">
            Intégrez la confiance <br />
            <span class="text-primary">dans vos apps</span>
          </h1>
          <p class="text-base md:text-lg text-hsa leading-relaxed font-light">
            Accédez à nos API REST sécurisées pour automatiser la vérification d'identité, la signature de documents et
            la consultation des registres officiels.
          </p>

          <div class="flex flex-col sm:flex-row gap-3 pt-2">
            <UiBaseButton to="/support#developers" class="w-full sm:w-auto px-6 py-3">Lire la Documentation
            </UiBaseButton>
            <UiBaseButton variant="secondary" @click="handleApiKey" class="w-full sm:w-auto px-6 py-3">Obtenir une Clé
              API</UiBaseButton>
          </div>
        </div>

        <div class="relative animate-fade-left">
          <div class="absolute inset-0 bg-blue-500 blur-[80px] md:blur-[100px] opacity-10 rounded-full"></div>
          <UiAppFrame type="terminal" title="bash" :glass="true" rounded="rounded-2xl" padding="p-4 md:p-6"
            class="font-code text-[11px] md:text-sm text-slate-300 bg-slate-900 border-slate-800"
            body-class="space-y-1.5 md:space-y-2">
            <p><span class="text-purple-400">curl</span> -X POST https://api.cypass.bj/v1/sign \</p>
            <p class="pl-4">-H <span class="text-green-400">"Authorization: Bearer YOUR_API_KEY"</span> \</p>
            <p class="pl-4">-H <span class="text-green-400">"Content-Type: application/json"</span> \</p>
            <p class="pl-4">-d <span class="text-orange-300">'{</span></p>
            <p class="pl-8 text-orange-300">"file_hash": "a7f9...9b2",</p>
            <p class="pl-8 text-orange-300">"signatory": "user_123"</p>
            <p class="pl-4 text-orange-300">}'</p>
            <p class="mt-4 text-green-500"># Réponse : 200 OK</p>
            <p class="text-slate-400">{ "status": "signed", "timestamp": "2024-01-15T10:00:00Z" }</p>
          </UiAppFrame>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from '~/stores/toast'

// Configuration de la page
definePageMeta({
  layout: 'guest'
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
  title: 'Développeurs'
})
</script>
