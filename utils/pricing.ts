import { IconUser, IconBriefcase, IconBuildingSkyscraper, IconActivity } from '@tabler/icons-vue'

export const pricingTiers = [
  {
    name: 'Individuel',
    subtitle: 'Gratuit',
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
    featured: false
  },
  {
    name: 'Pack Starter',
    subtitle: '100 crédits',
    price: '10.000 FCFA',
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
    cta: 'Acheter le pack',
    featured: true
  },
  {
    name: 'Pack Business',
    subtitle: '500 crédits',
    price: '40.000 FCFA',
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
    cta: 'Acheter le pack',
    featured: false
  },
  {
    name: 'Entreprise',
    subtitle: 'Sur mesure',
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
    cta: 'Contacter le service',
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
