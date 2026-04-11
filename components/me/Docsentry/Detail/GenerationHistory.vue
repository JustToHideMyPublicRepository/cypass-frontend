<template>
  <UiBaseCard v-if="generations && generations.length > 0">
    <button @click="isOpen = !isOpen"
      class="w-full flex items-center justify-between group">
      <div class="flex items-center gap-3">
        <div class="p-2 rounded-lg bg-primary/10 text-primary">
          <IconHistory class="w-5 h-5" />
        </div>
        <div class="text-left">
          <h3 class="font-bold text-BtW text-sm">Historique des générations</h3>
          <p class="text-[10px] text-hsa font-bold uppercase tracking-widest mt-0.5">
            {{ count }} génération{{ count > 1 ? 's' : '' }} effectuée{{ count > 1 ? 's' : '' }}
          </p>
        </div>
      </div>
      <IconChevronDown
        class="w-5 h-5 text-hsa transition-transform duration-300"
        :class="{ 'rotate-180': isOpen }" />
    </button>

    <Transition name="slide">
      <div v-if="isOpen" class="mt-4 space-y-3">
        <div v-for="(gen, index) in generations" :key="index"
          class="rounded-xl border border-ashAct/50 overflow-hidden">
          <button @click="toggleGroup(index)"
            class="w-full flex items-center justify-between p-3 bg-ash/30 hover:bg-ash/50 transition-colors">
            <div class="flex items-center gap-3">
              <span class="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-black">
                {{ index + 1 }}
              </span>
              <div class="text-left">
                <p class="text-xs font-bold text-BtW">
                  {{ gen.recipients_count }} destinataire{{ gen.recipients_count > 1 ? 's' : '' }}
                </p>
                <p class="text-[10px] text-hsa font-medium">
                  {{ formatGenerationDate(gen.generated_at) }}
                </p>
              </div>
            </div>
            <IconChevronDown
              class="w-4 h-4 text-hsa transition-transform duration-200"
              :class="{ 'rotate-180': openGroups.includes(index) }" />
          </button>

          <Transition name="slide">
            <div v-if="openGroups.includes(index)" class="px-3 pb-3 pt-2">
              <div class="flex flex-wrap gap-1.5">
                <span v-for="(recipient, rIndex) in gen.recipients" :key="rIndex"
                  class="px-2.5 py-1 text-[10px] font-bold bg-primary/5 text-primary border border-primary/15 rounded-lg">
                  {{ recipient }}
                </span>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconHistory, IconChevronDown } from '@tabler/icons-vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { MultiVersionGeneration } from '~/types/docsentry'

defineProps<{
  generations: MultiVersionGeneration[]
  count: number
}>()

const isOpen = ref(false)
const openGroups = ref<number[]>([])

const toggleGroup = (index: number) => {
  const i = openGroups.value.indexOf(index)
  if (i >= 0) {
    openGroups.value.splice(i, 1)
  } else {
    openGroups.value.push(index)
  }
}

const formatGenerationDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr)
    return format(date, "d MMM yyyy 'à' HH:mm", { locale: fr })
  } catch {
    return dateStr
  }
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
}
.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>
