import { defineStore } from 'pinia'

export interface AiOption {
  name: string
  desc: string
  url: string
  logo: string
}

export const useAiAnalysisStore = defineStore('aiAnalysis', {
  state: () => ({
    isModalOpen: false,
    isSettingsOpen: false,
    lastUsedAi: null as string | null,
    preferredAi: null as string | null,
    // Custom prompt part
    customRole: `Tu es un analyste documentaire senior spécialisé en synthèse stratégique et vulgarisation claire. Tu as l’habitude d’analyser des contenus web complexes et de les rendre compréhensibles pour un décideur pressé.`,
    customObjective: `Lire intégralement la page, comprendre son message et produire :
- un résumé clair et structuré
- une explication pédagogique du rôle de cette page
- une identification des informations clés`,
    customWork: `1. Résumer le contenu en 10 à 15 lignes maximum.
2. Expliquer :
   - À qui s’adresse cette page
   - Quel problème elle cherche à résoudre
   - Quels types d’assistance elle propose
3. Identifier les sections principales et leur rôle.
4. Reformuler le contenu en langage simple si nécessaire.
5. Conclure par une synthèse en 5 points essentiels.`,
    customConstraints: `- Ne pas analyser le design.
- Ne pas proposer d’améliorations.
- Se concentrer uniquement sur la compréhension et l’explication du contenu.`,
    customFormat: `- Résumé global
- Détail des sections
- Explication pédagogique
- Synthèse finale`,
  }),

  actions: {
    init() {
      if (import.meta.server) return
      const saved = localStorage.getItem('cps_ai_analysis')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          this.$patch(parsed)
        } catch (e) {
          console.error('Failed to parse ai analysis settings', e)
        }
      }

      // Auto-save on changes
      this.$subscribe(() => {
        this.save()
      })
    },

    save() {
      if (import.meta.server) return
      const { isModalOpen, isSettingsOpen, ...toSave } = this.$state
      localStorage.setItem('cps_ai_analysis', JSON.stringify(toSave))
    },

    setLastUsedAi(name: string) {
      this.lastUsedAi = name
      this.save()
    },

    setPreferredAi(name: string | null) {
      this.preferredAi = name
      this.save()
    },

    toggleModal() {
      this.isModalOpen = !this.isModalOpen
    },

    openModal() {
      this.isModalOpen = true
    },

    closeModal() {
      this.isModalOpen = false
    },

    getGeneratedPrompt(title: string, url: string, routeName: string) {
      return `${this.customRole}

Contexte :
Je te fournis l’URL suivante :
${url}
titre : ${title} (Route: ${routeName})

Il s’agit d’une page de la plateforme CYPASS.
Je veux comprendre rapidement son contenu et son utilité sans devoir tout lire en détail.

Objectif :
${this.customObjective}

Travail attendu :
${this.customWork}

Contraintes :
${this.customConstraints}

Format attendu :
${this.customFormat}`
    },

    triggerAiAnalysis(aiName: string, prompt: string) {
      const aiOptions = [
        { name: 'ChatGPT', url: 'https://chatgpt.com/?q=' },
        { name: 'Claude', url: 'https://claude.ai/new?q=' },
        { name: 'Perplexity', url: 'https://www.perplexity.ai/?q=' }
      ]

      const ai = aiOptions.find(o => o.name === aiName)
      if (ai) {
        const fullUrl = ai.url + encodeURIComponent(prompt)
        window.open(fullUrl, '_blank')
        this.setLastUsedAi(ai.name)
        this.closeModal()
      }
    }
  }
})
