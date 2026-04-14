<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 sm:px-0">
    <h1 class="text-2xl md:text-3xl font-black text-BtW">Notifications</h1>
    <div class="flex gap-2">
      <UiBaseButton v-if="unreadCount > 0" @click="$emit('mark-all-read')" variant="ghost"
        class="flex-1 sm:flex-none !px-4 !py-2 !rounded-xl !bg-primary/10 !text-primary hover:!bg-primary/20 transition-all !font-bold !text-[10px] md:!text-xs uppercase tracking-widest border border-primary/20 !h-auto">
        Tout marquer comme lu
      </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  unreadCount: number
}>()

defineEmits(['mark-all-read'])
</script>
