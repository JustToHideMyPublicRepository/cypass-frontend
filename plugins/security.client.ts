import { defineNuxtPlugin, useRouter } from '#app'

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  const showWarning = () => {
    const headerStyle = 'color: #ff0000; font-size: 3rem; font-weight: 900; text-shadow: 2px 2px 0px black; font-family: system-ui, sans-serif;'
    const subHeaderStyle = 'color: #0072FF; font-size: 1.5rem; font-weight: bold; font-family: system-ui, sans-serif;'
    const textStyle = 'color: #323C4F; font-size: 1.2rem; line-height: 1.5; font-family: system-ui, sans-serif;'
    const dangerStyle = 'color: #ff0000; font-size: 1.2rem; font-weight: bold; font-family: system-ui, sans-serif;'
    const codeStyle = 'background: #f3f4f6; color: #ff0000; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-weight: bold;'

    console.log('%cATTENTION : ALERTE SÉCURITÉ CYPASS', headerStyle)
    console.log('%cNe copiez rien ici si vous ne savez pas ce que vous faites !', subHeaderStyle)
    console.log(
      '%cSi quelqu\'un vous a demandé de copier-coller du code ici, il s\'agit d\'une tentative de %cvole de vos informations personnelles ou de votre compte%c.',
      textStyle,
      dangerStyle,
      textStyle
    )
    console.log(
      '%c⚠️ ATTENTION : Le navigateur peut vous demander de taper %callow pasting%c ou %cautoriser le collage%c. C\'EST UN PIÈGE ! Ne le faites jamais sous l\'influence d\'un tiers.',
      textStyle,
      codeStyle,
      textStyle,
      codeStyle,
      textStyle
    )
    console.log('%cFermez cette fenêtre pour rester en sécurité.', textStyle)
  }

  // Anti-Paste / Anti-Debugging Deterrent
  const startAntiPasteDeterrent = () => {
    setInterval(() => {
      (function (i) {
        // @ts-ignore
        (function (a) { return (function (a) { return (function (a) { (function () { i.constructor('debugger')() }).call(a) })(a) })(a) })(window)
      })(eval)
    }, 1000)
  }

  // Show immediately
  showWarning()

  // Production-only aggressive deterrent
  if (process.env.NODE_ENV === 'production') {
    startAntiPasteDeterrent()
  }

  // Persistent protection: Override clear
  if (window.console && console.clear) {
    const originalClear = console.clear
    console.clear = function () {
      originalClear.apply(console)
      showWarning()
    }
  }

  // Hook into route changes to keep the warning visible
  const router = useRouter()
  router.afterEach(() => {
    setTimeout(showWarning, 500)
  })
})
