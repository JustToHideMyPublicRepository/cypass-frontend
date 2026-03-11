<template>
  <div class="contents">
    <!-- Desktop -->
    <div @click="searchStore.openSearch()"
      class="hidden md:flex items-center flex-1 max-w-md relative cursor-pointer group animate-fade-in luminous-container"
      :class="customClass">

      <!-- Luminous Border Effect -->
      <div class="luminous-border"></div>

      <div class="search-inner">
        <IconSearch
          class="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-hsa group-hover:text-primary transition-colors z-10" />
        <input type="text" :value="route.query.q" :placeholder="currentPlaceholder" readonly
          class="w-full pl-10 pr-4 py-2 rounded-xl bg-ash/50 border border-ashAct group-hover:border-primary/30 group-hover:bg-ash transition-all text-sm text-BtW placeholder-slate-400 cursor-pointer relative z-0" />

        <div class="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 z-10">
          <kbd class="kbd-tip">Ctrl</kbd>
          <span class="text-[10px] text-hsa">+</span>
          <kbd class="kbd-tip">Shift</kbd>
          <span class="text-[10px] text-hsa">+</span>
          <kbd class="kbd-tip">K</kbd>
        </div>
      </div>
    </div>

    <!-- Mobile -->
    <button @click="searchStore.openSearch()"
      class="md:hidden p-2 rounded-lg text-hsa hover:bg-ash hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20">
      <IconSearch class="w-6 h-6" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { IconSearch } from '@tabler/icons-vue'
import { useSearchStore } from '~/stores/front/search'
import { useRoute } from 'vue-router'
import { searchPlaceholders, PLACEHOLDER_INTERVAL } from '~/utils/search'

defineProps<{ customClass?: string }>()

const searchStore = useSearchStore()
const route = useRoute()

const currentPlaceholder = ref(searchPlaceholders[0])
let placeholderInterval: any = null

onMounted(() => {
  let index = 0
  placeholderInterval = setInterval(() => {
    index = (index + 1) % searchPlaceholders.length
    currentPlaceholder.value = searchPlaceholders[index]
  }, PLACEHOLDER_INTERVAL)
})

onUnmounted(() => {
  if (placeholderInterval) clearInterval(placeholderInterval)
})
</script>

<style scoped>
.luminous-container {
  position: relative;
  border-radius: 0.75rem;
  padding: 1px;
}

.search-inner {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  border-radius: 0.75rem;
  overflow: hidden;
  z-index: 10;
}

.luminous-border {
  position: absolute;
  inset: 0;
  border-radius: 0.75rem;
  padding: 1.5px;
  background: transparent;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0.6;
  transition: all 0.5s ease;
  overflow: hidden;
  filter: drop-shadow(0 0 4px rgb(var(--color-BtW) / 0.5));
}

.group:hover .luminous-border {
  opacity: 1;
  filter: drop-shadow(0 0 10px rgb(var(--color-primary) / 0.8));
}

.luminous-border::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 250%;
  aspect-ratio: 1;
  translate: -50% -50%;
  background: conic-gradient(from 0deg, transparent 0 320deg, rgb(var(--color-BtW) / 1) 360deg);
  animation: rotate 4s linear infinite;
}

.group:hover .luminous-border::before {
  background: conic-gradient(from 0deg, transparent 0 320deg, rgb(var(--color-primary) / 1) 360deg);
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

kbd {
  font-family: inherit;
}
</style>
