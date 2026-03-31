<template>
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
</template>

<script setup lang="ts">
import { IconShieldCheck, IconCheck } from '@tabler/icons-vue'

const advice = [
  'Utilisez une application d\'authentification pour plus de sécurité.',
  'Ne partagez jamais vos codes de validation reçus par email.',
  'Gardez vos codes de secours dans un endroit sûr et privé.'
]
</script>
