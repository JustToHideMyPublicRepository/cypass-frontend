<template>
  <UiAppFrame type="card" class="transform-gpu transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:scale-[1.04] hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] shadow-[0_10px_30px_rgba(0,0,0,0.15)] group"
    :glass="true">
    <template #headerActions>
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-successAct animate-pulse"></span>
        <span class="text-[10px] font-bold text-hsa uppercase tracking-widest">Validé</span>
      </div>
    </template>
    <div class="p-3 md:p-4 min-h-[300px] md:min-h-[350px] flex items-center justify-center relative overflow-hidden">
      <!-- Glow interne discret -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(var(--color-success),0.05),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      <div class="relative z-10 w-full max-w-sm bg-WtB shadow-2xl rounded-xl overflow-hidden border border-ash/50 backdrop-blur-xl group-hover:border-ash transition-colors duration-500">
        <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent/0 pointer-events-none"></div>
        <div class="h-1.5 md:h-2 bg-gradient-to-r from-secondary via-primary to-success bg-[length:200%_auto] animate-shimmer"></div>
        <div class="p-6 md:p-8 text-center relative">
          <div
            class="w-16 h-16 md:w-20 md:h-20 mx-auto bg-success/10 rounded-full flex items-center justify-center text-success mb-4 md:mb-6 relative">
            <IconCertificate class="w-8 h-8 md:w-10 md:h-10 relative z-10" />
            <div class="absolute inset-0 rounded-full border-2 border-success/50 animate-ping opacity-20">
            </div>
          </div>
          <h4 class="font-serif text-xl md:text-2xl font-bold mb-2">
            Certifié Conforme</h4>
          <p class="text-[10px] md:text-xs text-hsa mb-4 md:mb-6 uppercase tracking-wider">République du Bénin
          </p>
          <div class="text-[9px] md:text-[10px] font-code text-ashAct border-t border-ash pt-4">
            SHA-256: 8f3a...29b1
          </div>
        </div>
      </div>
    </div>
  </UiAppFrame>
</template>

<script setup lang="ts">
import { IconCertificate } from '@tabler/icons-vue'
</script>
