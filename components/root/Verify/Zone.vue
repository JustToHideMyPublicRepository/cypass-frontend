<template>
  <div class="glass-panel p-8 md:p-12 rounded-[40px] border border-ashAct shadow-2xl relative group">
    <!-- Mode Switcher -->
    <div v-if="!result && !loading" class="flex justify-center mb-8">
      <div class="flex p-1 bg-ash/50 rounded-xl border border-ash">
        <button @click="$emit('update:verifyMode', 'file')"
          class="px-4 py-2 text-sm font-bold rounded-lg transition-all"
          :class="verifyMode === 'file' ? 'bg-WtB text-primary shadow-sm' : 'text-hsa hover:text-BtW'">
          Fichier PDF
        </button>
        <button @click="$emit('update:verifyMode', 'hash')"
          class="px-4 py-2 text-sm font-bold rounded-lg transition-all"
          :class="verifyMode === 'hash' ? 'bg-WtB text-primary shadow-sm' : 'text-hsa hover:text-BtW'">
          Empreinte (Hash)
        </button>
      </div>
    </div>

    <!-- Interactive Dropzone -->
    <div v-if="!file && verifyMode === 'file' && !result"
      class="border-2 border-dashed border-primary/20 rounded-3xl p-12 text-center hover:border-primary/50 transition-all cursor-pointer bg-WtB/50 hover:bg-primary/5 group"
      @click="$emit('trigger-file')">
      <div
        class="w-20 h-20 bg-WtB rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary shadow-xl border border-ash group-hover:scale-110 transition-transform duration-500">
        <IconRosetteDiscountCheck class="w-10 h-10" />
      </div>
      <h3 class="text-xl font-bold text-BtW mb-2">Sélectionnez le document PDF</h3>
      <p class="text-sm text-hsa">Glissez-déposez le fichier ici ou cliquez pour parcourir</p>
    </div>

    <!-- Hash Input Zone -->
    <div v-else-if="verifyMode === 'hash' && !result" class="max-w-md mx-auto space-y-4 py-8">
      <div class="space-y-2 text-left">
        <label class="text-xs font-black text-hsa uppercase tracking-widest px-1">Code SHA-256 du document</label>
        <div class="relative">
          <IconHash class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa" />
          <input :value="hashInput" @input="$emit('update:hashInput', ($event.target as HTMLInputElement).value)"
            type="text"
            class="w-full h-12 pl-12 pr-4 py-4 rounded-2xl bg-WtB border border-ash focus:ring-2 focus:ring-primary outline-none transition-all font-mono text-sm"
            placeholder="Entrez l'empreinte numérique...">
        </div>
      </div>
      <UiBaseButton block size="lg" :disabled="!hashInput || hashInput.length < 10" @click="$emit('verify-hash')">
        Vérifier l'empreinte
      </UiBaseButton>
    </div>

    <div v-if="(file || result || (loading && verifyMode === 'hash'))" class="space-y-8">
      <!-- Selected File Header (Only for file mode) -->
      <div v-if="file && !result"
        class="flex items-center gap-4 p-4 bg-ash/20 rounded-2xl border border-ash animate-fade-in">
        <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          <IconFileText class="w-6 h-6" />
        </div>
        <div class="flex-1 text-left min-w-0">
          <p class="font-bold text-BtW truncate">{{ file.name }}</p>
          <p class="text-xs text-hsa">{{ (file.size / 1024 / 1024).toFixed(2) }} MB</p>
        </div>
        <button @click="$emit('reset')" class="text-hsa hover:text-danger p-2 transition-colors">
          <IconX class="w-5 h-5" />
        </button>
      </div>

      <!-- Loading State (Progress Steps) -->
      <div v-if="loading && !result" class="py-12 animate-fade-in max-w-sm mx-auto">
        <div class="mb-8 p-6 bg-primary/5 rounded-[32px] border border-primary/10 text-left">
          <p class="text-xs font-black text-primary uppercase tracking-widest mb-6 flex items-center gap-2">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Analyse Cryptographique
          </p>
          <UtilsStepProgress :steps="activeSteps" />
        </div>
      </div>

      <RootVerifyResult v-if="result" :result="result" :error="error" @reset="$emit('reset')" />

      <div v-if="!loading && !result && file" class="flex justify-center pt-4">
        <UiBaseButton size="lg" class="px-12" @click="$emit('verify-file')">Vérifier le document</UiBaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconRosetteDiscountCheck, IconHash, IconFileText, IconX } from '@tabler/icons-vue'
import type { Step } from '~/utils/docsentry'

defineProps<{
  verifyMode: 'file' | 'hash'
  hashInput: string
  file: File | null
  loading: boolean
  result: any
  error: string | null
  activeSteps: Step[]
}>()

defineEmits(['update:verifyMode', 'update:hashInput', 'trigger-file', 'verify-hash', 'verify-file', 'reset'])
</script>
