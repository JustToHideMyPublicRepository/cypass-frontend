<template>
  <UiBaseModal :show="aiStore.isSettingsOpen" title="Personnaliser le prompt" maxWidth="2xl"
    @close="aiStore.isSettingsOpen = false">
    <div class="space-y-6">
      <div class="p-4 bg-primary/5 rounded-2xl border border-primary/10">
        <p class="text-xs text-hsa font-medium leading-relaxed">
          Modifiez les instructions envoyées à l'IA. Ces réglages sont sauvegardés localement sur votre navigateur.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <!-- Rôle (Full Width) -->
        <div class="space-y-2 md:col-span-2">
          <label class="text-[10px] font-black uppercase tracking-wider text-hsa flex items-center gap-2">
            <IconUserBolt class="w-3 h-3 text-primary" /> Rôle de l'IA
          </label>
          <textarea v-model="aiStore.customRole" rows="2"
            class="w-full bg-ash/30 border-2 border-ash rounded-2xl p-4 text-xs font-medium text-BtW outline-none focus:border-primary/50 transition-all resize-none"></textarea>
        </div>

        <!-- Colonne Gauche: Objectif & Travail -->
        <div class="space-y-5">
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-wider text-hsa flex items-center gap-2">
              <IconTarget class="w-3 h-3 text-primary" /> Objectif de l'analyse
            </label>
            <textarea v-model="aiStore.customObjective" rows="3"
              class="w-full bg-ash/30 border-2 border-ash rounded-2xl p-4 text-xs font-medium text-BtW outline-none focus:border-primary/50 transition-all resize-none"></textarea>
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-wider text-hsa flex items-center gap-2">
              <IconListCheck class="w-3 h-3 text-primary" /> Travail attendu
            </label>
            <textarea v-model="aiStore.customWork" rows="6"
              class="w-full bg-ash/30 border-2 border-ash rounded-2xl p-4 text-xs font-medium text-BtW outline-none focus:border-primary/50 transition-all resize-none"></textarea>
          </div>
        </div>

        <!-- Colonne Droite: Constraints & Format -->
        <div class="space-y-5">
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-wider text-hsa flex items-center gap-2">
              <IconAlertCircle class="w-3 h-3 text-primary" /> Contraintes
            </label>
            <textarea v-model="aiStore.customConstraints" rows="3"
              class="w-full bg-ash/30 border-2 border-ash rounded-2xl p-4 text-xs font-medium text-BtW outline-none focus:border-primary/50 transition-all resize-none"></textarea>
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-wider text-hsa flex items-center gap-2">
              <IconLayoutList class="w-3 h-3 text-primary" /> Format de réponse
            </label>
            <textarea v-model="aiStore.customFormat" rows="6"
              class="w-full bg-ash/30 border-2 border-ash rounded-2xl p-4 text-xs font-medium text-BtW outline-none focus:border-primary/50 transition-all resize-none"></textarea>
          </div>
        </div>
      </div>

      <div class="pt-4 flex justify-end gap-3 border-t border-ash">
        <UiBaseButton variant="ghost" @click="resetPrompt" class="!text-danger hover:!bg-danger/5">
          <IconRotate class="w-4 h-4 mr-2" /> Réinitialiser
        </UiBaseButton>
        <UiBaseButton @click="aiStore.isSettingsOpen = false">
          Enregistrer
        </UiBaseButton>
      </div>
    </div>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { IconTarget, IconListCheck, IconAlertCircle, IconRotate, IconUserBolt, IconLayoutList } from '@tabler/icons-vue'
import { useAiAnalysisStore } from '~/stores/aiAnalysis'

const aiStore = useAiAnalysisStore()

const resetPrompt = () => {
  if (confirm('Voulez-vous vraiment réinitialiser le prompt aux valeurs par défaut ?')) {
    aiStore.customRole = `Tu es un analyste documentaire senior spécialisé en synthèse stratégique et vulgarisation claire. Tu as l’habitude d’analyser des contenus web complexes et de les rendre compréhensibles pour un décideur pressé.`
    aiStore.customObjective = `Lire intégralement la page, comprendre son message et produire :
- un résumé clair et structuré
- une explication pédagogique du rôle de cette page
- une identification des informations clés`
    aiStore.customWork = `1. Résumer le contenu en 10 à 15 lignes maximum.
2. Expliquer :
   - À qui s’adresse cette page
   - Quel problème elle cherche à résoudre
   - Quels types d’assistance elle propose
3. Identifier les sections principales et leur rôle.
4. Reformuler le contenu en langage simple si nécessaire.
5. Conclure par une synthèse en 5 points essentiels.`
    aiStore.customConstraints = `- Ne pas analyser le design.
- Ne pas proposer d’améliorations.
- Se concentrer uniquement sur la compréhension et l’explication du contenu.`
    aiStore.customFormat = `- Résumé global
- Détail des sections
- Explication pédagogique
- Synthèse finale`
  }
}
</script>
