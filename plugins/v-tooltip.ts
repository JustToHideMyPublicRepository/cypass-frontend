import { defineNuxtPlugin, useRouter } from '#app'
import { useShortcutsStore } from '~/stores/shortcuts'
import { getLinkTooltip } from '~/data/shortcuts'

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()

  // Global cleanup on route change
  router.afterEach(() => {
    if (import.meta.client) {
      const tooltip = document.getElementById('global-shortcut-tooltip')
      if (tooltip) tooltip.classList.remove('visible')
    }
  })

  // Shared update logic
  const updateTooltip = (el: any, binding: any) => {
    if (!binding.value) return

    const store = useShortcutsStore()

    // Resolve content: if it's a shortcut ID or path, get the dynamic tooltip
    let content = binding.value
    const isShortcut = store.mergedShortcuts[content] || Object.values(store.mergedShortcuts).find(s => s.path === content)

    if (isShortcut) {
      content = getLinkTooltip(content, store.mergedShortcuts)
    }

    // Capture the calculated content for reference
    el._tooltipContent = content

    // Extract shortcut keys if present in content
    const matches = content.match(/class="kbd-hint">([^<]+)<\/span>/g)

    // Cleanup existing hint if any
    const existingHint = el.querySelector('.alt-shortcut-hint')
    if (existingHint) existingHint.remove()

    if (matches && matches.length > 0) {
      const allKeys = matches.map((m: string) => m.replace(/class="kbd-hint">|<\/span>/g, ''))
      const hasAnyModifier = allKeys.some((k: string) => ['Shift', 'Ctrl', 'Alt', 'Cmd', 'Control', 'Option', 'Command', 'Opt'].includes(k))
      const hasComplexModifiers = allKeys.some((k: string) => ['Ctrl', 'Cmd', 'Control', 'Meta', 'Command'].includes(k))
      const displayKeys = allKeys

      if (displayKeys.length > 0) {
        const hint = document.createElement('div')
        hint.className = 'alt-shortcut-hint'
        if (hasComplexModifiers) hint.classList.add('has-complex-mods')
        if ((el.classList.contains('btn') || el.tagName === 'BUTTON') && !hasAnyModifier) {
          hint.classList.add('is-button-hint')
        }

        const contentKeys = allKeys.filter((k: string) => !['Shift', 'Ctrl', 'Alt', 'Cmd', 'Control', 'Option', 'Command'].includes(k))
        hint.dataset.seq = contentKeys.map((k: string) => k.toLowerCase()).join(',')

        const html = displayKeys
          .map((k: string) => {
            const isModifier = ['Shift', 'Ctrl', 'Alt', 'Cmd', 'Control', 'Option', 'Command'].includes(k)
            return `<span class="key ${isModifier ? 'is-mod opacity-60' : ''}" data-key="${k.toLowerCase()}">${k}</span>`
          })
          .join('<span class="sep">+</span>')

        hint.innerHTML = html
        const style = window.getComputedStyle(el)
        if (style.position === 'static') el.style.position = 'relative'
        if (style.overflow === 'hidden') el.style.overflow = 'visible'
        el.appendChild(hint)
      }
    }
  }

  nuxtApp.vueApp.directive('tooltip', {
    mounted(el, binding) {
      // Inject styles once
      if (!document.getElementById('shortcut-tooltip-styles')) {
        const style = document.createElement('style')
        style.id = 'shortcut-tooltip-styles'
        style.textContent = `
          .shortcut-tooltip { position: fixed; background: transparent; padding: 0; pointer-events: none; z-index: 9999; opacity: 0; transform: translateY(4px) scale(0.95); transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1); }
          .shortcut-tooltip.visible { opacity: 1; transform: translateY(0) scale(1); }
          .kbd-wrapper { display: none; align-items: center; gap: 0.25rem; padding: 0.35rem 0.6rem; background: color-mix(in srgb, rgb(var(--color-ash)) 80%, transparent); backdrop-filter: blur(12px); border: 1px solid rgb(var(--color-ashAct)); border-radius: 0.75rem; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); color: rgb(var(--color-hsa)); }
          .shortcuts-hover-enabled .kbd-wrapper { display: flex; }
          .kbd-hint { display: inline-flex; align-items: center; justify-content: center; padding: 0.2rem 0.45rem; background-color: rgb(var(--color-BtW)); color: rgb(var(--color-WtB)); border: 1px solid rgb(var(--color-ash)); border-radius: 0.4rem; font-size: 0.65rem; font-weight: 800; box-shadow: 0 2px 0 0 rgb(var(--color-hsa)); min-width: 1.4rem; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; line-height: 1; text-transform: uppercase; }
          .alt-shortcut-hint { position: absolute; top: -5px; right: 5px; z-index: 50; pointer-events: none; opacity: 0; transform: scale(0.5); transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); padding: 0.2rem 0.4rem; background-color: rgb(var(--color-BtW)); color: rgb(var(--color-WtB)); border: 1px solid rgb(var(--color-ash)); border-radius: 0.35rem; font-size: 0.55rem; font-weight: 800; box-shadow: 0 2px 0 0 rgb(var(--color-hsa)); min-width: 1.2rem; display: none; align-items: center; justify-content: center; white-space: nowrap; line-height: 1; text-transform: uppercase; }
          .shortcuts-alt-enabled.alt-mode-active .alt-shortcut-hint:not(.is-button-hint):not(.has-complex-mods) { opacity: 1; transform: scale(1); display: flex; }
          .shortcuts-button-hints-enabled .alt-shortcut-hint.is-button-hint, .shortcuts-alt-enabled.alt-mode-active .alt-shortcut-hint.is-button-hint { opacity: 1; transform: scale(1); display: flex; }
          .alt-shortcut-hint.dimmed { opacity: 0.1 !important; transform: scale(0.85); filter: grayscale(1); }
          .alt-shortcut-hint .key.active { color: rgb(var(--color-primary)) !important; background: color-mix(in srgb, rgb(var(--color-primary)) 20%, transparent); box-shadow: 0 0 15px color-mix(in srgb, rgb(var(--color-primary)) 40%, transparent); transform: scale(1.35); border-radius: 4px; padding: 0 4px; display: inline-block; font-weight: 900; }
          .alt-shortcut-hint .key.is-mod { font-size: 0.8em; font-weight: 500; opacity: 0.7; }
          .alt-shortcut-hint .sep { opacity: 0.5; margin: 0 2px; font-weight: 300; }
        `
        document.head.appendChild(style)
      }

      // Shared tooltip element
      if (!document.getElementById('global-shortcut-tooltip')) {
        const tooltipEl = document.createElement('div')
        tooltipEl.id = 'global-shortcut-tooltip'
        tooltipEl.className = 'shortcut-tooltip'
        document.body.appendChild(tooltipEl)
      }

      updateTooltip(el, binding)

      const handleMouseEnter = () => {
        const tooltip = document.getElementById('global-shortcut-tooltip')
        if (!tooltip) return
        tooltip.innerHTML = el._tooltipContent
        tooltip.classList.add('visible')

        const rect = el.getBoundingClientRect()
        const tooltipRect = tooltip.getBoundingClientRect()
        let top = rect.bottom + 8
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2)
        if (left < 8) left = 8
        if (left + tooltipRect.width > window.innerWidth - 8) left = window.innerWidth - tooltipRect.width - 8
        if (top + tooltipRect.height > window.innerHeight - 8) top = rect.top - tooltipRect.height - 8
        tooltip.style.top = `${top}px`
        tooltip.style.left = `${left}px`
      }

      const handleMouseLeave = () => {
        const tooltip = document.getElementById('global-shortcut-tooltip')
        if (tooltip) tooltip.classList.remove('visible')
      }

      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
      el.addEventListener('click', handleMouseLeave)

      el._cleanupTooltip = () => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
        el.removeEventListener('click', handleMouseLeave)
      }
    },
    updated(el, binding) {
      updateTooltip(el, binding)
    },
    unmounted(el) {
      if (el._cleanupTooltip) el._cleanupTooltip()
    }
  })
})
