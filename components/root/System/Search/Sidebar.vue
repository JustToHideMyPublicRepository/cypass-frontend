<template>
  <aside class="space-y-6">
    <!-- Barre latérale de filtrage par catégorie -->
    <UiBaseCard title="Filtrer par catégorie">
      <div class="space-y-2">
        <button @click="$emit('update:activeFilter', 'all')"
          class="w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all text-sm font-medium"
          :class="activeFilter === 'all' ? 'bg-primary text-WtB' : 'text-BtW hover:bg-ash'">
          <span>Tous</span>
          <span class="text-[10px] opacity-70">{{ totalCount }}</span>
        </button>
        <button v-for="(count, cat) in categoryCounts" :key="cat" @click="$emit('update:activeFilter', cat)"
          class="w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all text-sm font-medium"
          :class="activeFilter === cat ? 'bg-primary text-WtB' : 'text-BtW hover:bg-ash'">
          <span>{{ cat }}</span>
          <span class="text-[10px] opacity-70">{{ count }}</span>
        </button>
      </div>
    </UiBaseCard>
  </aside>
</template>

<script setup lang="ts">
defineProps<{
  activeFilter: string
  totalCount: number
  categoryCounts: Record<string, number>
}>()

defineEmits(['update:activeFilter'])
</script>
