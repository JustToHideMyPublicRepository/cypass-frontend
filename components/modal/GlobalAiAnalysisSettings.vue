<template>
  <UiBaseModal :show="aiStore.isSettingsOpen" title="Personnaliser le prompt" maxWidth="2xl"
    @close="aiStore.isSettingsOpen = false">
    <div class="space-y-6">
      <div class="p-4 bg-primary/5 rounded-2xl border border-primary/10">
        <p class="text-xs text-hsa font-medium leading-relaxed">
          Modifiez les instructions envoyées à l'IA. Ces réglages sont sauvegardés localement sur votre navigateur.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 overflow-y-auto no-scrollbar pr-1">
        <!-- Section: Identité de l'IA -->
        <div class="md:col-span-12 space-y-3">
          <div class="flex items-center gap-2 px-1">
            <IconUserBolt class="w-4 h-4 text-primary" />
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-hsa">Identité & Expertise</span>
          </div>
          <div class="group/field relative">
            <textarea v-model="aiStore.customRole" rows="2"
              class="w-full bg-ash/20 border-2 border-ash rounded-2xl p-4 text-xs font-semibold text-BtW outline-none focus:border-primary/40 focus:bg-WtB transition-all resize-none shadow-sm"
              placeholder="Ex: Expert en cybersécurité..."></textarea>
            <div
              class="absolute bottom-3 right-3 text-[9px] text-hsa/40 font-mono opacity-0 group-focus-within/field:opacity-100 transition-opacity">
              rôle_ia</div>
          </div>
        </div>

        <!-- Section: Objectifs -->
        <div class="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <!-- Objectif Principal -->
          <div class="space-y-3">
            <div class="flex items-center gap-2 px-1">
              <IconTarget class="w-4 h-4 text-primary" />
              <span class="text-[10px] font-black uppercase tracking-[0.2em] text-hsa">Objectif Principal</span>
            </div>
            <textarea v-model="aiStore.customObjective" rows="4"
              class="w-full bg-ash/20 border-2 border-ash rounded-2xl p-4 text-xs font-semibold text-BtW outline-none focus:border-primary/40 focus:bg-WtB transition-all resize-none shadow-sm"></textarea>
          </div>

          <!-- Contraintes -->
          <div class="space-y-3">
            <div class="flex items-center gap-2 px-1">
              <IconAlertCircle class="w-4 h-4 text-danger/70" />
              <span class="text-[10px] font-black uppercase tracking-[0.2em] text-hsa">Limites & Contraintes</span>
            </div>
            <textarea v-model="aiStore.customConstraints" rows="4"
              class="w-full bg-ash/20 border-2 border-ash rounded-2xl p-4 text-xs font-semibold text-BtW outline-none focus:border-danger/30 focus:bg-WtB transition-all resize-none shadow-sm"></textarea>
          </div>
        </div>

        <!-- Section: Structure du résultat -->
        <div class="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <!-- Méthodologie -->
          <div class="space-y-3">
            <div class="flex items-center gap-2 px-1">
              <IconListCheck class="w-4 h-4 text-primary" />
              <span class="text-[10px] font-black uppercase tracking-[0.2em] text-hsa">Méthodologie (Work)</span>
            </div>
            <textarea v-model="aiStore.customWork" rows="7"
              class="w-full bg-ash/20 border-2 border-ash rounded-2xl p-4 text-xs font-semibold text-BtW outline-none focus:border-primary/40 focus:bg-WtB transition-all resize-none shadow-sm"></textarea>
          </div>

          <!-- Format de sortie -->
          <div class="space-y-3">
            <div class="flex items-center gap-2 px-1">
              <IconLayoutList class="w-4 h-4 text-primary" />
              <span class="text-[10px] font-black uppercase tracking-[0.2em] text-hsa">Format de Sortie</span>
            </div>
            <textarea v-model="aiStore.customFormat" rows="7"
              class="w-full bg-ash/20 border-2 border-ash rounded-2xl p-4 text-xs font-semibold text-BtW outline-none focus:border-primary/40 focus:bg-WtB transition-all resize-none shadow-sm"></textarea>
          </div>
        </div>
      </div>

      <div class="pt-4 flex justify-end gap-3">
        <UiBaseButton variant="ghost" @click="showResetConfirm = true" class="!text-danger hover:!bg-danger/5">
          <IconRotate class="w-4 h-4 mr-2" /> Réinitialiser
        </UiBaseButton>
        <UiBaseButton @click="aiStore.isSettingsOpen = false">
          Enregistrer
        </UiBaseButton>
      </div>
    </div>

    <!-- Confirm Reset Modal -->
    <UiConfirmModal :show="showResetConfirm" title="Réinitialiser le prompt ?"
      message="Cette action restaurera les instructions par défaut. Vos personnalisations actuelles seront perdues."
      confirmText="Réinitialiser" variant="danger" @confirm="handleReset" @cancel="showResetConfirm = false" />
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconTarget, IconListCheck, IconAlertCircle, IconRotate, IconUserBolt, IconLayoutList } from '@tabler/icons-vue'
import { useAiAnalysisStore } from '~/stores/aiAnalysis'

const aiStore = useAiAnalysisStore()
const showResetConfirm = ref(false)

const handleReset = () => {
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
  showResetConfirm.value = false
}
</script>
