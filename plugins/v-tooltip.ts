import { defineNuxtPlugin, useRouter } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()

  // Global cleanup on route change
  router.afterEach(() => {
    if (import.meta.client) {
      const tooltip = document.getElementById('global-shortcut-tooltip')
      if (tooltip) tooltip.classList.remove('visible')
    }
  })

  nuxtApp.vueApp.directive('tooltip', {
    getSSRProps() {
      return {}
    },
    mounted(el, binding) {
      if (!binding.value) return

      // Inject styles once if not already present
      if (!document.getElementById('shortcut-tooltip-styles')) {
        const style = document.createElement('style')
        style.id = 'shortcut-tooltip-styles'
        style.textContent = `
          .shortcut-tooltip {
            position: fixed;
            background: transparent;
            padding: 0;
            pointer-events: none;
            z-index: 9999;
            opacity: 0;
            transform: translateY(4px) scale(0.95);
            transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .shortcut-tooltip.visible {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          
          /* Visibility based on settings */
          .kbd-wrapper {
             display: none; /* Hidden by default if not enabled */
             align-items: center;
             gap: 0.25rem;
             padding: 0.35rem 0.6rem;
             background: color-mix(in srgb, rgb(var(--color-ash)) 80%, transparent);
             backdrop-filter: blur(12px);
             border: 1px solid rgb(var(--color-ashAct));
             border-radius: 0.75rem;
             box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
             color: rgb(var(--color-hsa));
          }
          .shortcuts-hover-enabled .kbd-wrapper {
             display: flex;
          }

          .kbd-hint {
             display: inline-flex;
             align-items: center;
             justify-content: center;
             padding: 0.2rem 0.45rem;
             background-color: rgb(var(--color-BtW));
             color: rgb(var(--color-WtB));
             border: 1px solid rgb(var(--color-ash));
             border-radius: 0.4rem;
             font-size: 0.65rem;
             font-weight: 800;
             box-shadow: 0 2px 0 0 rgb(var(--color-hsa));
             min-width: 1.4rem;
             font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
             line-height: 1;
             text-transform: uppercase;
          }

          /* Alt Mode Hints */
          .alt-shortcut-hint {
            position: absolute;
            top: -5px;
            right: 5px;
            z-index: 50;
            pointer-events: none;
            opacity: 0;
            transform: scale(0.5);
            transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
            
            /* KBD Style */
            padding: 0.2rem 0.4rem;
            background-color: rgb(var(--color-BtW));
            color: rgb(var(--color-WtB));
            border: 1px solid rgb(var(--color-ash));
            border-radius: 0.35rem;
            font-size: 0.55rem;
            font-weight: 800;
            box-shadow: 0 2px 0 0 rgb(var(--color-hsa));
            min-width: 1.2rem;
            display: none; /* Hidden by default */
            align-items: center;
            justify-content: center;
            white-space: nowrap;
            line-height: 1;
            text-transform: uppercase;
          }
          /* Only show Navigation hints if Alt mode is active AND it has NO complex modifiers (Ctrl/Cmd) */
          .shortcuts-alt-enabled.alt-mode-active .alt-shortcut-hint:not(.is-button-hint):not(.has-complex-mods) {
            opacity: 1;
            transform: scale(1);
            display: flex;
          }
          /* Show Button hints if Alt mode is active OR if Button Hints setting is enabled */
          .shortcuts-button-hints-enabled .alt-shortcut-hint.is-button-hint,
          .shortcuts-alt-enabled.alt-mode-active .alt-shortcut-hint.is-button-hint {
            opacity: 1;
            transform: scale(1);
            display: flex;
          }
          /* Filter dimmed hints */
          .alt-shortcut-hint.dimmed {
            opacity: 0.1 !important;
            transform: scale(0.85);
            filter: grayscale(1);
          }
          
          /* Active Keys Highlight (Sequencing) */
          .alt-shortcut-hint .key {
            transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          .alt-shortcut-hint .key.active {
            color: rgb(var(--color-primary)) !important;
            background: color-mix(in srgb, rgb(var(--color-primary)) 20%, transparent);
            box-shadow: 0 0 15px color-mix(in srgb, rgb(var(--color-primary)) 40%, transparent);
            transform: scale(1.35);
            border-radius: 4px;
            padding: 0 4px;
            display: inline-block;
            font-weight: 900;
          }
          .alt-shortcut-hint .key.is-mod {
            font-size: 0.8em;
            font-weight: 500;
            opacity: 0.7;
          }
          .alt-shortcut-hint .sep {
            opacity: 0.5;
            margin: 0 2px;
            font-weight: 300;
          }
        `
        document.head.appendChild(style)
      }

      // Shared tooltip element
      let tooltipEl = document.getElementById('global-shortcut-tooltip')
      if (!tooltipEl) {
        tooltipEl = document.createElement('div')
        tooltipEl.id = 'global-shortcut-tooltip'
        tooltipEl.className = 'shortcut-tooltip'
        document.body.appendChild(tooltipEl)
      }

      // Extract shortcut keys if present in binding value
      const matches = binding.value.match(/class="kbd-hint">([^<]+)<\/span>/g)
      if (matches && matches.length > 0) {
        // Extract content from all matches
        const allKeys = matches.map((m: string) => m.replace(/class="kbd-hint">|<\/span>/g, ''))

        // Detect ANY modifiers (including Shift) to exclude from permanent button hints
        const hasAnyModifier = allKeys.some((k: string) =>
          ['Shift', 'Ctrl', 'Alt', 'Cmd', 'Control', 'Option', 'Command', 'Opt'].includes(k)
        )

        // Detect complex combinations (Ctrl, Cmd, Meta) to hide them in sequential ALT mode
        const hasComplexModifiers = allKeys.some((k: string) =>
          ['Ctrl', 'Cmd', 'Control', 'Meta', 'Command'].includes(k)
        )

        // Show ALL keys in the hint for clarity, even in ALT mode
        const displayKeys = allKeys

        if (displayKeys.length > 0) {
          const hint = document.createElement('div')
          hint.className = 'alt-shortcut-hint'

          if (hasComplexModifiers) {
            hint.classList.add('has-complex-mods')
          }

          // ONLY mark as "permanent button hint" if:
          // 1. It's a button
          // 2. It DOES NOT have ANY modifiers (it's a direct contextual key like Y, N, Enter)
          if ((el.classList.contains('btn') || el.tagName === 'BUTTON') && !hasAnyModifier) {
            hint.classList.add('is-button-hint')
          }

          // Store the sequence keys for highlighting (exclude modifiers from the tracker)
          const contentKeys = allKeys.filter((k: string) => !['Shift', 'Ctrl', 'Alt', 'Cmd', 'Control', 'Option', 'Command'].includes(k))
          hint.dataset.seq = contentKeys.map((k: string) => k.toLowerCase()).join(',')

          // Generate structured HTML: <span class="key" data-key="l">L</span> ...
          const html = displayKeys
            .map((k: string) => {
              const isModifier = ['Shift', 'Ctrl', 'Alt', 'Cmd', 'Control', 'Option', 'Command'].includes(k)
              return `<span class="key ${isModifier ? 'is-mod opacity-60' : ''}" data-key="${k.toLowerCase()}">${k}</span>`
            })
            .join('<span class="sep">+</span>')

          hint.innerHTML = html

          // Ensure parent is positioned and allows overflow
          const style = window.getComputedStyle(el)
          if (style.position === 'static') {
            el.style.position = 'relative'
          }

          // Disable overflow hidden to allow floating hints to be seen
          if (style.overflow === 'hidden') {
            el.style.overflow = 'visible'
          }

          el.appendChild(hint)
        }
      }

      const handleMouseEnter = () => {
        const tooltip = document.getElementById('global-shortcut-tooltip')
        if (!tooltip) return
        tooltip.innerHTML = binding.value
        tooltip.classList.add('visible')

        const rect = el.getBoundingClientRect()
        const tooltipRect = tooltip.getBoundingClientRect()

        let top = rect.bottom + 8
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2)

        if (left < 8) left = 8
        if (left + tooltipRect.width > window.innerWidth - 8) {
          left = window.innerWidth - tooltipRect.width - 8
        }
        if (top + tooltipRect.height > window.innerHeight - 8) {
          top = rect.top - tooltipRect.height - 8
        }

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

        const hint = el.querySelector('.alt-shortcut-hint')
        if (hint) hint.remove()
      }
    },
    unmounted(el) {
      if (el._cleanupTooltip) el._cleanupTooltip()
    }
  })
})
