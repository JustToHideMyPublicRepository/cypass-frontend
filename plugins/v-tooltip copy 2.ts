import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
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
             background: color-mix(in srgb, var(--color-ash) 80%, transparent);
             backdrop-filter: blur(12px);
             border: 1px solid var(--color-ashAct);
             border-radius: 0.75rem;
             box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
             color: var(--color-hsa);
          }
          .shortcuts-hover-enabled .kbd-wrapper {
             display: flex;
          }

          .kbd-hint {
             display: inline-flex;
             align-items: center;
             justify-content: center;
             padding: 0.2rem 0.4rem;
             background-color: var(--color-BtW);
             color: var(--color-WtB);
             border: 1px solid var(--color-ash);
             border-radius: 0.35rem;
             font-size: 0.7rem;
             font-weight: 800;
             box-shadow: 0 2px 0 0 var(--color-hsa);
             min-width: 1.4rem;
             font-family: inherit;
             line-height: 1;
          }

          /* Alt Mode Hints */
          .alt-shortcut-hint {
            position: absolute;
            bottom: -1px;
            right: 5px;
            z-index: 50;
            pointer-events: none;
            opacity: 0;
            transform: scale(0.5);
            transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
            
            /* KBD Style from shortcuts.vue */
            padding: 0.15rem 0.3rem;
            background-color: var(--color-BtW);
            color: var(--color-WtB);
            border: 1px solid var(--color-ash);
            border-radius: 0.25rem;
            font-size: 0.5rem;
            font-weight: 700;
            box-shadow: 0 2px 0 0 var(--color-hsa);
            min-width: 1.2rem;
            display: none; /* Hidden by default */
            align-items: center;
            justify-content: center;
            white-space: nowrap;
            line-height: 1;
          }
          /* Only show if Alt mode is active AND setting is enabled */
          .shortcuts-alt-enabled.alt-mode-active .alt-shortcut-hint {
            opacity: 1;
            transform: scale(1);
            display: flex;
          }
          /* ALSO show if Button Hints setting is explicitly enabled */
          .shortcuts-button-hints-enabled .alt-shortcut-hint {
            opacity: 1;
            transform: scale(1);
            display: flex;
          }
          /* Filter dimmed hints */
          .alt-shortcut-hint.dimmed {
            opacity: 0.1 !important;
            transform: scale(0.8);
            filter: grayscale(1);
          }
          
          /* Active Keys Highlight */
          .alt-shortcut-hint .key {
            transition: color 0.1s ease;
          }
          .alt-shortcut-hint .key.active {
            color: var(--color-primary);
            text-shadow: 0 0 5px color-mix(in srgb, var(--color-primary) 40%, transparent);
            transform: scale(1.2);
            display: inline-block;
          }
          .alt-shortcut-hint .sep {
            opacity: 0.5;
            margin: 0 1px;
            font-weight: 400;
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
        const keys = matches.map((m: string) => m.replace(/class="kbd-hint">|<\/span>/g, ''))

        // Filter out common modifiers if we want to show only the action keys
        // (Assuming Alt replaces Shift/Ctrl in this context)
        const contentKeys = keys.filter((k: string) => !['Shift', 'Ctrl', 'Alt', 'Cmd', 'Control'].includes(k))

        if (contentKeys.length > 0) {
          const hint = document.createElement('div')
          hint.className = 'alt-shortcut-hint'

          // Detect if this is a button hint (based on element class or tag)
          if (el.classList.contains('btn') || el.tagName === 'BUTTON') {
            hint.classList.add('is-button-hint')
          }

          // Store the full sequence for filtering logic (e.g. "l,m")
          hint.dataset.seq = contentKeys.map((k: string) => k.toLowerCase()).join(',')

          // Generate structured HTML: <span class="key" data-key="l">L</span> ...
          const html = contentKeys
            .map((k: string) => `<span class="key" data-key="${k.toLowerCase()}">${k}</span>`)
            .join('<span class="sep">+</span>')

          hint.innerHTML = html

          // Ensure parent is positioned
          const style = window.getComputedStyle(el)
          if (style.position === 'static') {
            el.style.position = 'relative'
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
