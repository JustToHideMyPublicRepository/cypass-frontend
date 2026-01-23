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
          .kbd-wrapper {
             display: flex;
             align-items: center;
             gap: 0.25rem;
             padding: 0.35rem 0.6rem;
             background: color-mix(in srgb, var(--ash) 80%, transparent);
             backdrop-filter: blur(12px);
             border: 1px solid var(--ashAct);
             border-radius: 0.75rem;
             box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
             color: var(--hsa);
          }
          .dark .kbd-wrapper {
             background: color-mix(in srgb, var(--WtB) 70%, transparent);
             border-color: rgba(255, 255, 255, 0.1);
          }
          .kbd-hint {
             display: inline-flex;
             align-items: center;
             justify-content: center;
             padding: 0.2rem 0.4rem;
             background-color: var(--BtW);
             color: var(--WtB);
             border: 1px solid var(--ashAct);
             border-radius: 0.35rem;
             font-size: 0.7rem;
             font-weight: 800;
             box-shadow: 0 2px 0 0 rgba(0, 0, 0, 0.2);
             min-width: 1.4rem;
             font-family: inherit;
             line-height: 1;
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
      }
    },
    unmounted(el) {
      if (el._cleanupTooltip) el._cleanupTooltip()
    }
  })
})
