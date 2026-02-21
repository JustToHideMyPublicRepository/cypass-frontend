// Types pour les éléments de la FAQ
export interface FaqItem {
  question: string
  answer: string
  category?: string
}

// Interface pour regrouper les questions par catégorie
export interface FaqCategory {
  title: string
  items: FaqItem[]
}

/**
 * Données des catégories de la FAQ avec leurs questions respectives.
 */
export const faqCategories: FaqCategory[] = [
  {
    title: 'Général',
    items: [
      {
        question: 'Qu\'est-ce que CYPASS ?',
        answer: 'CYPASS est l\'infrastructure nationale de confiance numérique du Bénin. Elle permet l\'authentification sécurisée, la signature électronique et l\'échange de documents certifiés pour les citoyens et les entreprises.',
        category: 'Général'
      },
      {
        question: 'Est-ce un service gratuit ?',
        answer: 'L\'accès aux services de base (identité numérique, consultation) est gratuit pour tous les citoyens. Certains services avancés pour les entreprises peuvent être soumis à tarification.',
        category: 'Services'
      }
    ]
  },
  {
    title: 'Compte & Sécurité',
    items: [
      {
        question: 'Comment créer un compte ?',
        answer: 'Vous avez besoin de votre Numéro Personnel d\'Identification (NPI) figurant sur votre carte CIP ou biométrique. Cliquez sur "Connexion" puis suivez la procédure d\'enrôlement.',
        category: 'Compte'
      },
      {
        question: 'J\'ai oublié mon mot de passe',
        answer: 'Rendez-vous sur la page de connexion et cliquez sur "Mot de passe oublié". Un lien de réinitialisation vous sera envoyé par email ou SMS sécurisé.',
        category: 'Sécurité'
      },
      {
        question: 'Mes données sont-elles protégées ?',
        answer: 'Oui, CYPASS est conforme à la loi sur le numérique en République du Bénin et certifié ISO 27001. Vos données sont chiffrées de bout en bout et hébergées exclusivement sur le territoire national.',
        category: 'Confidentialité'
      }
    ]
  },
  {
    title: 'Technique',
    items: [
      {
        question: 'Comment intégrer CYPASS à mon application ?',
        answer: 'Consultez notre documentation développeur pour accéder aux API OAuth2 et OpenID Connect. Des SDK sont disponibles pour les langages les plus courants.',
        category: 'Intégration'
      },
      {
        question: 'Quels sont les standards supportés ?',
        answer: 'Nous supportons eIDAS, PAdES pour les signatures PDF, et les standards X.509 pour les certificats électroniques.',
        category: 'Standards'
      }
    ]
  }
]

/**
 * Liste des questions populaires affichées sur la page d'accueil.
 */
export const popularFaqItems: FaqItem[] = [
  ...faqCategories[0].items,
  ...faqCategories[1].items.slice(0, 2)
]
