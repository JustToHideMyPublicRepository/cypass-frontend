import { ref, onMounted } from 'vue'

export const useCookieConsent = () => {
  const CONSENT_KEY = 'cps_cookie_consent'
  const hasConsent = ref(true) // Default to hidden to avoid flash
  const isAccepted = ref(false)

  // Avoid using useGtag() directly here to prevent SSR issues or premature init
  // We'll use it inside the client-side logic

  const loadConsent = () => {
    if (process.client) {
      const stored = localStorage.getItem(CONSENT_KEY)
      if (stored !== null) {
        isAccepted.value = stored === 'true'

        if (isAccepted.value) {
          initializeGtag()
        }
      } else {
        // No choice made yet, show the banner
        hasConsent.value = false
      }
    }
  }

  const acceptConsent = () => {
    if (process.client) {
      localStorage.setItem(CONSENT_KEY, 'true')
      hasConsent.value = true
      isAccepted.value = true
      initializeGtag()
    }
  }

  const declineConsent = () => {
    if (process.client) {
      localStorage.setItem(CONSENT_KEY, 'false')
      hasConsent.value = true
      isAccepted.value = false
    }
  }

  const initializeGtag = () => {
    if (process.client) {
      const { initialize } = useGtag()
      initialize()
    }
  }

  return {
    hasConsent,
    isAccepted,
    loadConsent,
    acceptConsent,
    declineConsent
  }
}
