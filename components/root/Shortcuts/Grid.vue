<template>
  <div>
    <div v-if="categories.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-start">
      <div v-for="category in categories" :key="category.title" class="animate-fade-up">
        <h2 class="flex items-center gap-2 md:gap-3 text-base md:text-lg font-bold mb-4 md:mb-6 text-BtW">
          <span class="w-1.5 h-5 md:w-2 md:h-6 bg-primary rounded-full"></span>
          {{ category.title }}
        </h2>

        <div class="space-y-2.5 md:space-y-3">
          <div v-for="s in getVisibleItems(category)" :key="s.label"
            class="flex items-center justify-between p-3.5 md:p-4 rounded-xl md:rounded-2xl bg-WtB border border-ash hover:border-primary/30 hover:shadow-md transition-all group">
            <div class="flex items-center gap-2">
              <span class="text-BtW font-medium text-xs md:text-sm">{{ s.label }}</span>
              <!-- Badge personnalisé -->
              <span v-if="hasCustom(s.id)"
                class="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary flex items-center justify-center"
                title="Personnalisé par l'utilisateur">
                <IconKeyboardShow class="w-2.5 h-2.5" />
              </span>
            </div>
            <div class="flex items-center gap-3">
              <!-- Affichage des touches -->
              <div class="flex items-center gap-1">
                <template v-if="recordingId === s.id">
                  <span
                    class="text-[10px] font-black animate-pulse text-primary uppercase tracking-widest flex items-center gap-1">
                    <span v-if="currentModifiers" class="opacity-70">{{ currentModifiers }} +</span>
                    {{ currentCombo.length > 0 ? currentCombo.join(' + ') : (currentModifiers ? '...' : 'Appuyez...') }}
                  </span>
                </template>
                <template v-else>
                  <template v-if="s.modifier">
                    <template v-for="(m, midx) in s.modifier.split('+')" :key="'mod-' + midx">
                      <kbd class="kbd-hint">{{ m.trim() }}</kbd>
                      <span class="text-hsa text-[9px] md:text-[10px]">+</span>
                    </template>
                  </template>
                  <template v-for="(k, index) in s.keys" :key="index">
                    <kbd class="kbd-hint">{{ k === 'enter' ? '↵' : k }}</kbd>
                    <span v-if="(index as number) < s.keys.length - 1"
                      class="text-hsa text-[9px] md:text-[10px]">+</span>
                  </template>
                </template>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <template v-if="recordingId === s.id">
                  <button @click.stop="stopRecording(true, s.id)"
                    class="p-1.5 rounded-lg bg-success/20 text-success hover:bg-success/30 transition-colors">
                    <IconCheck class="w-3.5 h-3.5" />
                  </button>
                  <button @click.stop="stopRecording(false)"
                    class="p-1.5 rounded-lg bg-danger/20 text-danger hover:bg-danger/30 transition-colors">
                    <IconX class="w-3.5 h-3.5" />
                  </button>
                </template>
                <template v-else>
                  <button @click.stop="startRecording(s.id)"
                    class="p-1.5 rounded-lg hover:bg-ash transition-colors text-hsa hover:text-primary"
                    title="Modifier">
                    <IconPencil class="w-3.5 h-3.5" />
                  </button>
                  <button v-if="hasCustom(s.id)" @click.stop="store.resetShortcut(s.id)"
                    class="p-1.5 rounded-lg hover:bg-ash transition-colors text-hsa hover:text-warning"
                    title="Réinitialiser">
                    <IconRotate class="w-3.5 h-3.5" />
                  </button>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- Bouton de bascule -->
        <div v-if="category.items.length > 3" class="mt-3 md:mt-4">
          <UiBaseButton @click="toggleCategory(category.title)" variant="ghost"
            class="!flex !items-center !gap-2 !text-[11px] md:!text-xs !font-bold text-hsa hover:!text-primary transition-colors !px-3 md:!px-4 !py-1.5 md:!py-2 !rounded-xl hover:!bg-ash !h-auto">
            <component :is="isExpanded(category.title) ? IconChevronUp : IconChevronDown"
              class="w-3.5 h-3.5 md:w-4 md:h-4" />
            {{ isExpanded(category.title) ? 'Voir moins' : `Voir plus (${category.items.length - 3} de plus)` }}
          </UiBaseButton>
        </div>
      </div>
    </div>

    <!-- État Vide -->
    <div v-else class="py-12 md:py-20 text-center animate-fade-in">
      <div class="w-12 h-12 md:w-16 md:h-16 rounded-full bg-ash flex items-center justify-center mx-auto mb-4 text-hsa">
        <IconSearchOff class="w-6 h-6 md:w-8 md:h-8" />
      </div>
      <p class="text-hsa text-sm md:text-base">Aucun raccourci ne correspond à votre recherche.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { IconSearchOff, IconChevronDown, IconChevronUp, IconPencil, IconRotate, IconCheck, IconX, IconKeyboardShow } from '@tabler/icons-vue'
import { useShortcutsStore } from '~/stores/shortcuts'
import { useToastStore } from '~/stores/toast'

const store = useShortcutsStore()
const toast = useToastStore()

defineProps<{
  categories: {
    title: string
    items: any[]
  }[]
}>()

const expandedCategories = ref<Set<string>>(new Set())

const toggleCategory = (title: string) => {
  if (expandedCategories.value.has(title)) {
    expandedCategories.value.delete(title)
  } else {
    expandedCategories.value.add(title)
  }
}

const isExpanded = (title: string) => expandedCategories.value.has(title)

const getVisibleItems = (category: any) => {
  if (isExpanded(category.title)) return category.items
  return category.items.slice(0, 3)
}

// Logic de réassignation
const recordingId = ref<string | null>(null)
const currentCombo = ref<string[]>([])
const currentModifiers = ref<string | null>(null)

const startRecording = (id: string) => {
  recordingId.value = id
  currentCombo.value = []
  currentModifiers.value = null
  window.addEventListener('keydown', handleGlobalKeydown)
}

const stopRecording = (save: boolean, id?: string) => {
  if (save && id && currentCombo.value.length > 0) {
    // Conflits
    const newKeys = currentCombo.value.map(k => k.toLowerCase()).join(',')
    const newMod = currentModifiers.value

    const conflict = Object.entries(store.mergedShortcuts).find(([sid, s]) => {
      if (sid === id) return false
      const sKeys = s.keys.map(k => k.toLowerCase()).join(',')
      return sKeys === newKeys && s.modifier === newMod
    })

    if (conflict) {
      toast.showToast('error', 'Conflit de raccourci', `Action annulée : ce raccourci est déjà utilisé par "${conflict[1].label}"`)
      recordingId.value = null
      currentCombo.value = []
      currentModifiers.value = null
      window.removeEventListener('keydown', handleGlobalKeydown)
      return // BLOCK SAVE
    }

    store.updateShortcut(id, currentCombo.value, currentModifiers.value || undefined)
    toast.showToast('success', 'Raccourci mis à jour', 'Le nouveau raccourci a été enregistré.')
  }
  recordingId.value = null
  currentCombo.value = []
  currentModifiers.value = null
  window.removeEventListener('keydown', handleGlobalKeydown)
}

const handleGlobalKeydown = (e: KeyboardEvent) => {
  e.preventDefault()
  e.stopPropagation()

  if (e.key === 'Escape') {
    stopRecording(false)
    return
  }

  // Blacklist invalid/dangerous keys
  const blacklist = [
    'Backspace', 'CapsLock', 'Tab', 'NumLock', 'ScrollLock', 'Pause', 'Insert',
    'Home', 'End', 'PageUp', 'PageDown', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6',
    'F7', 'F8', 'F9', 'F10', 'F11', 'F12'
  ]
  if (blacklist.includes(e.key)) {
    toast.showToast('warning', 'Touche invalide', `La touche ${e.key} ne peut pas être utilisée comme raccourci.`)
    return
  }

  // Handle modifiers
  const mods = []
  if (e.ctrlKey || e.metaKey) mods.push('Ctrl')
  if (e.shiftKey) mods.push('Shift')
  if (e.altKey) mods.push('Alt')

  currentModifiers.value = mods.length > 0 ? mods.join(' + ') : null

  // Ignore individual modifier key presses but still update UI
  if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) return

  const key = e.key === ' ' ? 'Espace' : e.key.toLowerCase()
  if (!currentCombo.value.includes(key)) {
    currentCombo.value.push(key)
  }
}

const hasCustom = (id: string) => !!store.customShortcuts[id]

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>
