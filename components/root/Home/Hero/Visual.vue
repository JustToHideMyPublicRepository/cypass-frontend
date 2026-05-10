<template>
  <!-- Iframe -->
  <div
    class="relative w-full perspective-1000 animate-fade-left mt-8 lg:mt-0 flex justify-center lg:block overflow-visible lg:col-span-2">
    <div
      class="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-primary to-secondary rounded-full blur-[80px] opacity-40 animate-pulse-slow">
    </div>

    <UiAppFrame type="browser" url="https://verify.cypass.bj/" :glass="true" rounded="rounded-3xl" padding="p-0"
      class="w-full max-w-[calc(100vw-32px)] lg:w-fit z-20 shadow-2xl lg:mx-0 lg:translate-x-32 xl:translate-x-32 transition-transform duration-700 ease-out">
      <div
        class="bg-bgClr p-4 md:p-6 rounded-b-2xl h-auto md:h-[450px] relative overflow-hidden w-full lg:w-[500px] xl:w-[600px] max-w-full">
        <!-- Grille décorative -->
        <div class="absolute inset-0 bg-[url('https://heropatterns.com/img/patterns/circuit-board.png')] opacity-5">
        </div>

        <!-- Fake Verify UI -->
        <div class="p-5 sm:p-8 rounded-3xl bg-success/5 border border-success/20 relative z-10 shadow-lg text-left">
          <div class="absolute top-0 right-0 p-6 opacity-10">
            <IconRosetteDiscountCheck class="w-16 h-16 md:w-24 md:h-24 text-success" />
          </div>
          <div class="flex items-center gap-2 md:gap-3 text-success mb-6 relative z-10">
            <IconRosetteDiscountCheck class="w-6 h-6 md:w-8 md:h-8" />
            <span class="text-base md:text-xl font-black italic">DOCUMENT AUTHENTIQUE</span>
          </div>

          <div class="p-4 bg-primary/10 rounded-2xl border border-primary/20 mb-6">
            <p class="text-[10px] text-hsa uppercase font-black tracking-widest mb-1">Document Certifié</p>
            <p class="text-lg md:text-xl font-black text-BtW truncate">Contrat-Partenariat-2026.pdf</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-4 bg-WtB/50 rounded-2xl border border-ash/50 space-y-1">
              <p class="text-[10px] text-hsa uppercase font-black">Émetteur du Document</p>
              <p class="font-bold text-BtW">CYPASS</p>
            </div>
            <div class="p-4 bg-WtB/50 rounded-2xl border border-ash/50 space-y-1">
              <p class="text-[10px] text-hsa uppercase font-black">Date d'Exécution</p>
              <p class="font-bold text-BtW">Aujourd'hui, 09:41</p>
            </div>
          </div>

          <div class="space-y-2 mb-6">
            <p class="text-[10px] text-hsa uppercase font-black tracking-widest px-1">
              Empreinte Numérique (SHA-256)</p>
            <div
              class="flex items-center gap-2 p-3 bg-ash/30 rounded-xl border border-ash/50 font-code text-[10px] text-hsa opacity-80 break-all">
              <IconFingerprint class="w-4 h-4 text-primary shrink-0" />
              e3b0c44298fc1c149afbf4c8996fb924...
            </div>
          </div>

          <div class="flex justify-center pt-2 pb-2">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=cypass-verify"
              class="w-20 h-20 rounded-lg mix-blend-multiply opacity-80" alt="QR Code" />
          </div>
        </div>
      </div>
    </UiAppFrame>
  </div>
</template>

<script setup lang="ts">
import { IconRosetteDiscountCheck, IconFingerprint } from '@tabler/icons-vue'
</script>
