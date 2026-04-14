<template>
  <div
    class="relative border-4 border-dashed border-primary/10 rounded-[2.5rem] p-12 text-center hover:border-primary/40 transition-all cursor-pointer bg-ash/20 hover:bg-primary/5 group overflow-hidden"
    @click="$emit('select-file')">

    <div class="pointer-events-none relative z-10">
      <div
        class="w-20 h-20 bg-WtB rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-ash">
        <IconUpload class="w-10 h-10" />
      </div>
      <p class="text-xl font-black text-BtW tracking-tighter">Cliquez ou glissez un fichier</p>
      <p class="text-[10px] text-hsa mt-2 font-black tracking-widest opacity-60">PDF uniquement • Max 3 Mo
      </p>
    </div>

    <!-- Effet de background subtil au survol -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconUpload } from '@tabler/icons-vue'

defineEmits(['select-file'])
</script>
