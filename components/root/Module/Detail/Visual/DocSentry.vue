<template>
  <UiAppFrame type="card" :glass="true"
    class="shadow-2xl shadow-green-500/10 md:transform md:rotate-y-[-5deg] md:rotate-x-[5deg] md:hover:rotate-0 transition-transform duration-700">
    <div
      class="h-[400px] md:h-[500px] bg-bgClr flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-1.5 md:h-2 bg-gradient-to-r from-green-400 to-emerald-600"></div>

      <div
        class="w-full max-w-sm bg-WtB rounded-lg shadow-xl border border-ash p-6 md:p-8 text-center relative z-10 translate-y-2">
        <div
          class="w-16 h-16 md:w-24 md:h-24 mx-auto bg-success/10 rounded-full flex items-center justify-center text-success mb-4 md:mb-6 relative">
          <IconCertificate class="w-8 h-8 md:w-12 md:h-12" />
          <div class="absolute inset-0 border-4 border-success/20 rounded-full animate-ping-slow"></div>
        </div>

        <div
          class="inline-block px-3 py-1 bg-success/20 text-success text-[9px] md:text-[10px] font-bold uppercase tracking-widest rounded-full mb-3 md:mb-4">
          Document Certifié
        </div>

        <h3 class="font-serif text-base md:text-2xl font-bold mb-1 md:mb-2 truncate">Contrat_Cadre_v2.pdf</h3>
        <p class="text-[9px] md:text-xs text-slate-500 mb-6 md:mb-8">Signé numériquement le 16 Jan 2024</p>

        <div class="text-left space-y-2 md:space-y-3 text-[10px] md:text-xs border-t border-ash pt-4 md:pt-6">
          <div class="flex justify-between">
            <span class="text-slate-500">Signataire</span>
            <span class="font-bold text-BtW">Ministère de l'Économie</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Algorithme</span>
            <span class="font-code text-BtW">SHA-256 / RSA-4096</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Empreinte</span>
            <span class="font-code truncate w-24 md:w-32">8f3a...29b1</span>
          </div>
        </div>
      </div>

      <!-- Motif de Fond -->
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5">
      </div>
    </div>
  </UiAppFrame>
</template>

<script setup lang="ts">
import { IconCertificate } from '@tabler/icons-vue'
</script>
