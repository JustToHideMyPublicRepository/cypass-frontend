<template>
  <div class="space-y-6">
    <!-- Security Info Card -->
    <div
      class="p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-ashAct/5 to-transparent border border-primary/10 relative overflow-hidden group">
      <div
        class="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700">
      </div>
      <IconShieldCheck class="w-12 h-12 text-primary/30 mb-4" />
      <h5 class="text-sm font-black text-BtW mb-3 uppercase tracking-widest leading-none">Conseils de sécurité</h5>
      <p class="text-xs text-hsa leading-relaxed mb-4">
        La double authentification (MFA) ajoute une couche de protection essentielle. Même si votre mot de passe est
        compromis, votre compte reste sécurisé.
      </p>

      <ul class="space-y-3">
        <li v-for="item in advice" :key="item" class="flex items-start gap-2">
          <IconCheck class="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
          <span class="text-[10px] font-bold text-hsa tracking-tighter leading-tight">{{ item }}</span>
        </li>
      </ul>
    </div>

    <!-- Danger Zone Integration -->
    <div
      class="p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] bg-danger/[0.03] border border-danger/10 group transition-all hover:bg-danger/[0.05]">
      <div class="flex items-start gap-3 mb-4">
        <div class="p-2 bg-danger/10 rounded-xl group-hover:bg-danger/20 transition-colors">
          <IconTrash class="w-5 h-5 text-danger" />
        </div>
        <div>
          <h5 class="text-xs font-black text-danger uppercase tracking-widest leading-none">Zone critique</h5>
          <p class="text-[10px] text-hsa font-medium mt-1">Actions irréversibles sur votre compte.</p>
        </div>
      </div>

      <p class="text-[10px] text-hsa/70 leading-relaxed mb-4">
        La suppression de votre compte entraînera la perte définitive de toutes vos données, certificats et historiques.
      </p>

      <UiBaseButton variant="ghost"
        class="w-full !justify-center !py-2.5 !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest !bg-danger/5 hover:!bg-danger/10 !text-danger border border-danger/10 transition-all shadow-sm"
        @click="showDeleteModal = true">
        Supprimer le compte
      </UiBaseButton>
    </div>

    <!-- Account Delete Modal -->
    <ModalSettingDelete :show="showDeleteModal" @close="showDeleteModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconShieldCheck, IconCheck, IconTrash } from '@tabler/icons-vue'

const showDeleteModal = ref(false)

const advice = [
  'Utilisez une application d\'authentification pour plus de sécurité.',
  'Ne partagez jamais vos codes de validation reçus par email.',
  'Gardez vos codes de secours dans un endroit sûr et privé.'
]
</script>
