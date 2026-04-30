import { IconUser, IconBriefcase, IconBuildingSkyscraper, IconActivity } from '@tabler/icons-vue'

export const PLAN_CONFIG = {
  'free': {
    label: 'Individuel',
    badgeClass: 'bg-ash text-hsa',
    borderClass: '',
    credits: 5
  },
  'starter': {
    label: 'Starter',
    badgeClass: 'bg-secondary/10 text-secondary',
    borderClass: 'p-[2px] bg-gradient-to-tr from-secondary to-warning',
    credits: 100
  },
  'business': {
    label: 'Business',
    badgeClass: 'bg-primary/10 text-primary',
    borderClass: 'p-[2px] bg-gradient-to-tr from-primary to-success',
    credits: 500
  },
  'entreprise': {
    label: 'Entreprise',
    badgeClass: 'bg-success/10 text-success',
    borderClass: 'p-[2px] bg-gradient-to-tr from-success to-danger',
    credits: 1000000 // Illimité
  }
} as const

export const getPlanInfo = (name: string | undefined) => {
  const normalized = name?.toLowerCase() || 'free'
  if (normalized.includes('starter')) return PLAN_CONFIG.starter
  if (normalized.includes('business')) return PLAN_CONFIG.business
  if (normalized.includes('entreprise')) return PLAN_CONFIG.entreprise
  return PLAN_CONFIG.free
}

export const getPlanBorderClass = (name: string | undefined) => {
  return getPlanInfo(name).borderClass
}

export const getPlanBadgeClass = (name: string | undefined) => {
  return getPlanInfo(name).badgeClass
}

export const pricingTiers = [
  {
    name: 'Individuel',
    slug: 'free',
    subtitle: 'Gratuit',
    credits: 5,
    price: '0 FCFA',
    description: 'Protection essentielle pour découvrir CYPASS et sécuriser vos premiers documents.',
    icon: IconUser,
    bgClass: 'bg-primary/5',
    features: [
      '5 crédits de certification offerts',
      'Accès VigiTech Community',
      'Signalement d\'incidents',
      'Profil public certifié',
      'Vérification QR Camera'
    ],
    cta: 'Démarrer gratuitement',
    link: '/dashboard',
    featured: false
  },
  {
    name: 'Pack Starter',
    slug: 'starter',
    subtitle: '100 crédits',
    credits: 100,
    price: '10K FCFA',
    description: 'Idéal pour les consultants et indépendants ayant un flux régulier de documents.',
    icon: IconBriefcase,
    bgClass: 'bg-secondary/5',
    features: [
      '100 certifications CYPASS',
      'Prix : 100 FCFA / unité',
      'Validité illimitée des crédits',
      'Rapports de sécurité hebdo',
      'Badges de confiance Pro',
      'Support prioritaire (e-mail)'
    ],
    cta: 'Acheter',
    featured: true
  },
  {
    name: 'Pack Business',
    slug: 'business',
    subtitle: '500 crédits',
    credits: 500,
    price: '40K FCFA',
    description: 'Conçu pour les TPE/PME souhaitant une gestion de confiance à grande échelle.',
    icon: IconBuildingSkyscraper,
    bgClass: 'bg-danger/5',
    features: [
      '500 certifications CYPASS',
      'Prix : 80 FCFA / unité',
      'Validité illimitée des crédits',
      'Tableau de bord premium',
      'Support prioritaire (WhatsApp)',
      'Accès API limité'
    ],
    cta: 'Acheter',
    featured: false
  },
  {
    name: 'Entreprise',
    slug: 'entreprise',
    subtitle: 'Sur mesure',
    credits: 1000000,
    price: 'Contact',
    description: 'Infrastructure dédiée et volume illimité pour les grandes institutions.',
    icon: IconActivity,
    bgClass: 'bg-primary/10',
    features: [
      'Volume de crédits illimité',
      'Accès complet API & SDK',
      'Intégration Marque Blanche',
      'Formation cybersécurité',
      'SLA Garanti 99.9%',
      'Account Manager dédié'
    ],
    cta: 'Nous contacter',
    link: '/contact',
    featured: false
  }
]

export const pricingComparison = [
  {
    feature: 'Certification DocSentry',
    tooltip: 'La technologie DocSentry permet d\'ancrer vos documents sur la blockchain pour garantir leur intégrité.',
    basic: true,
    starter: true,
    business: true,
    ent: true
  },
  {
    feature: 'Vérification QR camera',
    tooltip: 'Le scanner intégré permet de vérifier n\'importe quel document certifié CYPASS via l\'appareil photo.',
    basic: true,
    starter: true,
    business: true,
    ent: true
  },
  {
    feature: 'Accès VigiTech community',
    tooltip: 'Participez au réseau mondial de signalement et de veille sur les menaces numériques.',
    basic: true,
    starter: true,
    business: true,
    ent: true
  },
  {
    feature: 'Badges de confiance',
    tooltip: 'Affichez votre statut de certification sur votre site ou signature d\'e-mail.',
    basic: false,
    starter: true,
    business: true,
    ent: true
  },
  {
    feature: 'Rapports hebdomadaires',
    tooltip: 'Analyses détaillées de votre posture de sécurité envoyées chaque lundi.',
    basic: false,
    starter: true,
    business: true,
    ent: true
  },
  {
    feature: 'Support prioritaire',
    tooltip: 'Réponse garantie sous 4 heures pour toutes vos demandes techniques.',
    basic: false,
    starter: false,
    business: true,
    ent: true
  },
  {
    feature: 'Accès API document',
    tooltip: 'Automatisez la certification et la vérification au sein de vos propres logiciels.',
    basic: false,
    starter: false,
    business: true,
    ent: true
  },
  {
    feature: 'Intégration marque blanche',
    tooltip: 'Utilisez CYPASS avec votre propre logo et charte graphique sur un domaine dédié.',
    basic: false,
    starter: false,
    business: false,
    ent: true
  }
]
