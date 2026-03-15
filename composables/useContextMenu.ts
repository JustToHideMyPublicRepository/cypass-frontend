import { ref, reactive, nextTick } from 'vue'

export interface ContextMenuItem {
  label: string
  icon?: any
  action: () => any
  variant?: 'danger' | 'default' | string
}

export interface ContextMenuMetadata {
  title?: string
  infos?: { label: string; value: string }[]
}

const isOpen = ref(false)
const position = reactive({ x: 0, y: 0 })
const items = ref<ContextMenuItem[]>([])
const metadata = ref<ContextMenuMetadata | null>(null)

export const useContextMenu = () => {
  const showMenu = (event: MouseEvent, menuItems: ContextMenuItem[], menuMetadata: ContextMenuMetadata | null = null) => {
    event.preventDefault()
    
    // Close existing menu first
    isOpen.value = false
    
    // Set position
    position.x = event.clientX
    position.y = event.clientY
    
    // Set content
    items.value = menuItems
    metadata.value = menuMetadata
    
    // Open next tick to allow re-render if needed
    nextTick(() => {
      isOpen.value = true
    })
  }

  const closeMenu = () => {
    isOpen.value = false
  }

  return {
    isOpen,
    position,
    items,
    metadata,
    showMenu,
    closeMenu
  }
}
