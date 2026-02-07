<template>
  <UiBaseModal :show="show" @close="$emit('close')" title="Documentation expert" max-width="2xl">
    <div class="space-y-6">
      <!-- Section Overview -->
      <div class="p-4 rounded-2xl bg-primary/5 border border-primary/10">
        <h3 class="text-BtW font-bold flex items-center gap-2 mb-2">
          <IconBolt class="w-5 h-5 text-primary" />
          Fonctionnement technique
        </h3>
        <p class="text-hsa text-sm leading-relaxed">
          Le système de raccourcis de CYPASS utilise un moteur dynamique basé sur le localStorage.
          Toutes vos modifications sont sauvegardées localement dans votre navigateur et ne sont pas partagées entre vos
          appareils, sauf si vous utilisez la fonction d'exportation/importation.
        </p>
      </div>

      <!-- Section Personalization -->
      <div class="grid md:grid-cols-2 gap-4">
        <div class="p-4 rounded-2xl bg-WtB border border-ash">
          <h4 class="text-BtW font-bold text-sm mb-2 flex items-center gap-2">
            <IconPencil class="w-4 h-4 text-primary" />
            Personnalisation
          </h4>
          <ul class="text-hsa text-[13px] space-y-2 list-disc pl-4">
            <li>Enregistrement en temps réel des combinaisons.</li>
            <li>Support des modificateurs (Ctrl, Shift, Alt).</li>
            <li>Détection automatique des conflits entre actions.</li>
            <li>Style distinctif pour les raccourcis modifiés.</li>
          </ul>
        </div>

        <div class="p-4 rounded-2xl bg-WtB border border-ash">
          <h4 class="text-BtW font-bold text-sm mb-2 flex items-center gap-2">
            <IconFileCode class="w-4 h-4 text-primary" />
            Stockage & Portabilité
          </h4>
          <ul class="text-hsa text-[13px] space-y-2 list-disc pl-4">
            <li>Sauvegarde : <code
                class="bg-ash px-1 rounded text-[11px] font-code">localStorage['shortcuts-storage']</code></li>
            <li>Export : Fichier JSON structuré.</li>
            <li>Import : Restauration instantanée de la configuration.</li>
            <li>Bouton Reset : Retour aux valeurs d'usine.</li>
          </ul>
        </div>
      </div>

      <!-- Section Navigation Modes -->
      <div class="space-y-4">
        <h4 class="text-BtW font-black text-xs uppercase tracking-widest opacity-50">Modes de Navigation</h4>
        <div class="grid gap-3">
          <div
            class="flex items-start gap-3 p-3 rounded-xl hover:bg-ash/30 transition-colors border border-transparent hover:border-ash">
            <kbd class="kbd-hint !text-[10px] mt-0.5">ALT</kbd>
            <div>
              <p class="text-BtW font-bold text-sm italic">Mode Collant (Sticky)</p>
              <p class="text-hsa text-xs">Affiche les indices visuels sur tous les liens. Tapez la séquence pour
                naviguer.</p>
            </div>
          </div>
          <div
            class="flex items-start gap-3 p-3 rounded-xl hover:bg-ash/30 transition-colors border border-transparent hover:border-ash">
            <kbd class="kbd-hint !text-[10px] mt-0.5">SHIFT</kbd>
            <div>
              <p class="text-BtW font-bold text-sm italic">Mode Rapide</p>
              <p class="text-hsa text-xs">Maintenez Shift et tapez une touche pour naviguer instantanément sans menu.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="flex items-center gap-2 text-[10px] font-bold text-hsa/60 justify-center pt-2">
        <IconInfoCircle class="w-3.5 h-3.5" />
        <span>CYPASS Engine v2.0 - Keyboard Shortcut Matrix</span>
      </div>
    </div>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { IconBolt, IconPencil, IconFileCode, IconInfoCircle } from '@tabler/icons-vue'

defineProps<{
  show: boolean
}>()

defineEmits(['close'])
</script>
