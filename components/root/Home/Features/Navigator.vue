<template>
  <div class="flex items-center gap-5 md:gap-7">
    <button
      v-for="(item, i) in items"
      :key="i"
      @click="$emit('select', i)"
      :class="[
        'relative text-sm md:text-base font-semibold transition-all duration-400 cursor-pointer pb-1',
        i === active
          ? theme === 'green'
            ? 'text-success opacity-100'
            : 'text-primary opacity-100'
          : 'text-hsa opacity-40 hover:opacity-70'
      ]"
      :aria-label="`Aller au module ${item.title}`"
    >
      {{ item.title }}
      <!-- Underline -->
      <span
        :class="[
          'absolute bottom-0 left-0 h-0.5 rounded-full transition-all duration-500',
          i === active
            ? theme === 'green'
              ? 'bg-success w-full'
              : 'bg-primary w-full'
            : 'w-0'
        ]"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
interface NavItem {
  title: string
}

defineProps<{
  items: NavItem[]
  active: number
  theme: 'green' | 'blue'
}>()

defineEmits<{
  select: [index: number]
}>()
</script>
