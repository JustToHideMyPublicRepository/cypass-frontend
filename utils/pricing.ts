import { markRaw } from 'vue'
import { IconUser, IconBriefcase, IconBuildingSkyscraper, IconActivity, IconQrcode, IconRosetteDiscountCheck, IconArchive, IconRadar, IconCode, IconApi, IconServer } from '@tabler/icons-vue'

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
    credits: 80
  },
  'business': {
    label: 'Business',
    badgeClass: 'bg-primary/10 text-primary',
    borderClass: 'p-[2px] bg-gradient-to-tr from-primary to-success',
    credits: 400
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
    description: 'Découvrez CYPASS et certifiez vos premiers documents sans engagement.',
    icon: markRaw(IconUser),
    bgClass: 'bg-primary/5',
    features: [
      '5 crédits offerts à l\'inscription',
      '1 crédit par certification simple',
      '2 crédits par certification enrichie',
      'Crédits sans date d\'expiration',
      'Accès VigiTech community',
      'Signalement d\'incidents',
      'Vérification QR camera'
    ],
    cta: 'Démarrer gratuitement',
    link: '/dashboard',
    featured: false
  },
  {
    name: 'Pack Starter',
    slug: 'starter',
    subtitle: '100 crédits',
    credits: 80,
    price: '10K FCFA',
    description: 'Idéal pour les consultants et indépendants ayant un flux régulier de documents.',
    icon: markRaw(IconBriefcase),
    bgClass: 'bg-secondary/5',
    features: [
      'Tout dans Individuel',
      'Rapports de sécurité hebdo',
      'Support prioritaire (e-mail)'
    ],
    cta: 'Acheter',
    featured: true
  },
  {
    name: 'Pack Business',
    slug: 'business',
    subtitle: '500 crédits',
    credits: 400,
    price: '40K FCFA',
    description: 'Conçu pour les TPE/PME souhaitant une gestion de confiance à grande échelle.',
    icon: markRaw(IconBuildingSkyscraper),
    bgClass: 'bg-danger/5',
    features: [
      'Tout dans Starter',
      'Crédits sans date d\'expiration',
      'Tableau de bord premium',
      'Support prioritaire (WhatsApp)',
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
    icon: markRaw(IconActivity),
    bgClass: 'bg-primary/10',
    features: [
      'Crédits illimités (volume négocié)',
      'Certification Simple & Enrichie incluses',
      'Accès complet API & SDK',
      'Intégration Marque Blanche',
      'Formation cybersécurité équipe',
      'SLA garanti 99,9 %',
      'Account Manager dédié'
    ],
    cta: 'Nous contacter',
    link: '/contact',
    featured: false
  }
]

export const basicComparison = [
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

export const addonComparison = [
  {
    feature: 'Configuration visuelle du QR',
    tooltip: 'Personnalisez les couleurs, le logo, la taille',
    qr: true,
    verified: false,
    archive: false,
    pro: false
  },
  {
    feature: 'Badge public certifié',
    tooltip: 'Affiche un badge de confiance visible par tous.',
    qr: false,
    verified: true,
    archive: false,
    pro: false
  },
  {
    feature: 'Signalements officiels',
    tooltip: 'ous connaîtrez l\'utilisateur qui vous signale au lieu d\'un bagde d\'anonymat.',
    qr: false,
    verified: true,
    archive: false,
    pro: false
  },
  {
    feature: 'Alertes avant publication',
    tooltip: 'Recevez les détections de fuites ou incidents en avant première.',
    qr: false,
    verified: false,
    archive: false,
    pro: true
  },
  {
    feature: 'Exportation groupée (ZIP)',
    tooltip: 'Téléchargez vos rapports ou certificats en masse.',
    qr: false,
    verified: false,
    archive: true,
    pro: true
  }
]

export const apiComparison = [
  {
    feature: 'Environnement de requêtes',
    tooltip: 'Sandbox permet de tester sans engager de frais, Production est pour les flux réels.',
    free: 'Sandbox',
    starter: 'Production',
    ent: 'Dédié'
  },
  {
    feature: 'Rate limit (Appels/min)',
    tooltip: 'Nombre de requêtes maximum autorisées par minute.',
    free: '10 / min',
    starter: '60 / min',
    ent: 'Personnalisé'
  },
  {
    feature: 'Webhooks de réception',
    tooltip: 'Notifications asynchrones envoyées vers vos propres serveurs.',
    free: false,
    starter: true,
    ent: true
  },
  {
    feature: 'Dashboard analytique temps réel',
    tooltip: 'Statistiques sur les endpoints utilisés et coûts générés.',
    free: false,
    starter: true,
    ent: true
  },
  {
    feature: 'Authentification mTLS',
    tooltip: 'Niveau de sécurité maximal exigeant un certificat matériel ou IP whitelisting.',
    free: false,
    starter: false,
    ent: true
  },
  {
    feature: 'Support technique',
    tooltip: 'Niveau d\'assistance associé à l\'intégration.',
    free: 'Documentation',
    starter: 'E-mail',
    ent: 'Dédié (WhatsApp / Tel)'
  }
]

export const individualTiers = pricingTiers

export const addonTiers = [
  {
    name: 'QR perso',
    slug: 'qr-custom',
    price: '2K FCFA / mois',
    description: 'Faites de votre QR Code un élément de votre identité visuelle.',
    icon: markRaw(IconQrcode),
    features: [
      'Couleur personnalisée du QR Code',
      'Ajout de votre logo au centre',
      'Choix de la taille et du niveau de correction',
      'Style arrondi ou carré des modules',
      'Prévisualisation avant génération',
      'Compatible toutes offres individuelles'
    ],
    cta: 'Activer',
    featured: false
  },
  {
    name: 'CYPASS Verified',
    slug: 'verified',
    price: '2,5K FCFA / mois',
    description: 'Un badge de confiance qui donne plus de poids à vos signalements et certifications.',
    icon: markRaw(IconRosetteDiscountCheck),
    features: [
      'Badge Verified visible sur votre profil public',
      'Voir le nom de ceux qui vous signale au lieu d\'afficher "Anonyme"',
      'Signalements prioritaires dans le dashboard VigiTech',
      'Champ de saisie étendu (3 000 car. au lieu de 1 000)',
      'Historique public de vos signalements validés',
      'Crédibilité renforcée auprès des modérateurs'
    ],
    cta: 'Activer',
    featured: true
  },
  {
    name: 'DocSentry Archive',
    slug: 'archive',
    price: '1,5K FCFA / mois',
    description: 'Conservez et retrouvez vos documents certifiés sur le long terme.',
    icon: markRaw(IconArchive),
    features: [
      'Moteur de recherche sur vos documents certifiés',
      'Export groupé de vos certificats (ZIP)',
      'Historique complet des vérifications reçues',
      'Notifications si un tiers vérifie votre document',
      'Compatible toutes offres individuelles'
    ],
    cta: 'Activer',
    featured: false
  },
  {
    name: 'VigiTech Pro',
    slug: 'vigitech-pro',
    price: '2K FCFA / mois',
    description: 'Accédez à la veille cyber avancée et aux alertes avant diffusion publique.',
    icon: markRaw(IconRadar),
    features: [
      'Alertes cyber en avant-première (avant publication)',
      'Filtres avancés par type, région, secteur',
      'Abonnement à des catégories d\'incidents spécifiques',
      'Rapport de veille mensuel personnalisé',
      'Accès aux statistiques agrégées du territoire',
      'Notifications push et e-mail configurable'
    ],
    cta: 'Activer',
    featured: false
  },
]

export const apiTiers = [
  {
    name: 'API Free',
    slug: 'api-free',
    subtitle: 'Sandbox',
    price: '0 FCFA',
    description: 'Intégrez et testez l\'API CYPASS dans votre environnement de développement.',
    icon: markRaw(IconCode),
    bgClass: 'bg-ash/5',
    features: [
      '100 appels / mois offerts',
      'Accès endpoints DocSentry (certif. + vérif.)',
      'Environnement sandbox dédié',
      'Documentation OpenAPI 3.0 / Swagger',
      'Clé API unique par compte',
      'Rate limit : 10 req / minute'
    ],
    cta: 'Obtenir ma clé API',
    link: '/developers',
    featured: false
  },
  {
    name: 'API Starter',
    slug: 'api-starter',
    subtitle: 'Pay-as-you-go',
    price: 'Dès 25 FCFA / appel',
    description: 'Payez uniquement ce que vous consommez. Idéal pour les projets à volumétrie variable.',
    icon: markRaw(IconApi),
    bgClass: 'bg-secondary/5',
    pricing: [
      { range: '0 – 500 appels/mois', unitPrice: '25 FCFA / appel' },
      { range: '501 – 2 000 appels/mois', unitPrice: '20 FCFA / appel' },
      { range: '2 001 – 10 000 appels/mois', unitPrice: '15 FCFA / appel' },
      { range: '10 000+ appels/mois', unitPrice: 'Tarif négocié' }
    ],
    features: [
      'Endpoints DocSentry et VigiTech',
      'Webhooks sur événements',
      'Dashboard consommation temps réel',
      'Historique des appels (30 jours)',
      'Rate limit : 60 req / minute',
      'Support technique par e-mail'
    ],
    cta: 'Commencer',
    link: '/developers/api',
    featured: true
  },
  {
    name: 'API Entreprise',
    slug: 'api-entreprise',
    subtitle: 'Volume & SLA',
    price: 'Sur devis',
    description: 'Pour les institutions et éditeurs de logiciels intégrant CYPASS à grande échelle.',
    icon: markRaw(IconServer),
    bgClass: 'bg-primary/10',
    features: [
      'Volume d\'appels illimité (SLA garanti)',
      'Accès tous endpoints + futurs modules',
      'IP whitelisting & authentification mTLS',
      'Webhooks avancés + asynchrone',
      'Intégration Marque Blanche possible',
      'Environnement de production dédié',
      'Rate limit personnalisé',
      'Support technique dédié',
      'Rapport d\'usage mensuel détaillé'
    ],
    cta: 'Nous contacter',
    link: '/contact',
    featured: false
  }
]
