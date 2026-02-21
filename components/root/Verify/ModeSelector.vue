<template>
  <div class="flex justify-center mb-6 md:mb-8">
    <div class="flex p-1 bg-ash/50 rounded-xl border border-ash gap-1 md:gap-4 backdrop-blur-md">
      <UiBaseButton @click="$emit('update:modelValue', 'file')" variant="ghost"
        class="!px-3 md:!px-4 !py-1.5 md:!py-2 !text-[10px] md:!text-sm !font-black md:!font-bold !rounded-lg transition-all !h-auto !tracking-widest md:!tracking-normal"
        :class="modelValue === 'file' ? '!bg-WtB !text-primary shadow-sm' : 'text-hsa hover:!text-BtW'">
        Fichier
      </UiBaseButton>
      <UiBaseButton @click="$emit('update:modelValue', 'hash')" variant="ghost"
        class="!px-3 md:!px-4 !py-1.5 md:!py-2 !text-[10px] md:!text-sm !font-black md:!font-bold !rounded-lg transition-all !h-auto !tracking-widest md:!tracking-normal"
        :class="modelValue === 'hash' ? '!bg-WtB !text-primary shadow-sm' : 'text-hsa hover:!text-BtW'">
        Hash
      </UiBaseButton>
      <UiBaseButton @click="$emit('update:modelValue', 'qr')" variant="ghost"
        class="!px-3 md:!px-4 !py-1.5 md:!py-2 !text-[10px] md:!text-sm !font-black md:!font-bold !rounded-lg transition-all !h-auto !tracking-widest md:!tracking-normal"
        :class="modelValue === 'qr' ? '!bg-WtB !text-primary shadow-sm' : 'text-hsa hover:!text-BtW'">
        Code QR
      </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: 'file' | 'hash' | 'qr'
}>()

defineEmits(['update:modelValue'])
</script>
