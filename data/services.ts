import { IconScanEye, IconCertificate, IconRadar2, IconEye } from '@tabler/icons-vue'

export interface ServiceBenefit {
  title: string
  qty: string
  desc?: string
}

export interface ServiceTechSpec {
  label: string
  value: string
}

export interface ServiceFeatureIcon {
  title: string
  desc: string
  icon: any
}

export interface CypassService {
  id: string
  title: string
  subtitle?: string
  description: string
  fullDescription?: string
  icon: any
  status: 'available' | 'coming_soon'
  theme: 'blue' | 'green'
  badge?: string
  cta?: string
  image?: string

  // Data for Features.vue
  features?: ServiceFeatureIcon[]
  list?: string[]
  specs?: string[]

  // Data for [id].vue
  benefits?: ServiceBenefit[]
  techSpecs?: ServiceTechSpec[]
}

export const services: CypassService[] = [
  {
    id: 'docsentry',
    title: 'DocSentry',
    subtitle: 'Certification & Archivage',
    description: 'Infrastructure PKI souveraine pour la signature électronique qualifiée, le cachetage serveur et l\'archivage à valeur probante.',
    fullDescription: 'Infrastructure PKI souveraine permettant la signature électronique qualifiée, le cachetage serveur et l\'archivage à valeur probante de tous vos documents administratifs, en totale conformité avec les réglementations en vigueur.',
    icon: IconCertificate,
    status: 'available',
    theme: 'green',
    badge: 'Populaire',
    cta: 'Découvrir la signature',
    list: [
      'Signature électronique qualifiée (eIDAS)',
      'Cachetage serveur automatisé',
      'Archivage à valeur probante (10 ans)',
      'API REST pour intégration'
    ],
    specs: ['eIDAS Ready', 'API REST'],
    benefits: [
      { title: 'eIDAS Ready', qty: 'Conforme aux règlements européens et béninois.', desc: 'Conformité légale totale' },
      { title: 'API REST', qty: 'Intégration facile dans vos workflows existants.', desc: 'Pour vos applications métier' },
      { title: 'Preuve Légale', qty: 'Validité juridique garantie devant les tribunaux.' },
      { title: 'Archivage Long', qty: 'Conservation sécurisée jusqu\'à 10 ans.' }
    ],
    techSpecs: [
      { label: 'Signature Stds', value: 'PAdES / XAdES' },
      { label: 'Encryption', value: 'RSA-4096 / SHA-256' },
      { label: 'Hébergement', value: 'Souverain (BJ)' }
    ]
  },
  {
    id: 'vigitech',
    title: 'VigiTech',
    subtitle: 'Veille & Alerte Cyber',
    description: 'Réseau d\'alerte communautaire et SOC virtuel pour signaler les incidents et recevoir des notifications ciblées en temps réel.',
    fullDescription: 'Votre tour de contrôle cybernétique. Un réseau d\'alerte communautaire et un SOC (Security Operations Center) qui permet de signaler les incidents et de recevoir des notifications ciblées en temps réel.',
    icon: IconRadar2,
    status: 'available',
    theme: 'green',
    badge: 'Nouveau',
    cta: 'Rejoindre le réseau',
    list: [
      'Signalement d\'incidents anonymisé',
      'Flux de menaces en temps réel',
      'Notifications ciblées par secteur',
      'Tableaux de bord de surveillance'
    ],
    specs: ['SOC Virtuel', 'Alertes 24/7'],
    benefits: [
      { title: 'Alerte Communautaire', qty: 'Signalement collaboratif des menaces.' },
      { title: 'Veille Ciblée', qty: 'Notifications filtrées par secteur d\'activité.' },
      { title: 'Réponse Rapide', qty: 'Validation et diffusion immédiate des alertes.' },
      { title: 'SOC Virtuel', qty: 'Dashboards de surveillance unifiés.' }
    ],
    techSpecs: [
      { label: 'Protocoles', value: 'STIX / TAXII' },
      { label: 'SLA Réponse', value: '< 15 min' },
      { label: 'Support', value: '24/7' }
    ]
  },
  {
    id: 'secuscan',
    title: 'SecuScan',
    subtitle: 'Audit de Vulnérabilité',
    description: 'Scanner de vulnérabilité continu pour détecter les failles de vos applications et infrastructures avant les attaquants.',
    fullDescription: 'Une solution complète d\'analyse de vulnérabilité qui scanne en continu vos applications, API et infrastructures cloud pour détecter les failles de sécurité avant les attaquants, garantissant une posture de sécurité robuste.',
    icon: IconScanEye,
    status: 'coming_soon',
    theme: 'blue',
    badge: 'Bêta',
    cta: 'Demander un accès',
    specs: ['OWASP Top 10', 'Automated'],
    benefits: [
      { title: 'OWASP Top 10', qty: 'Couverture complète des failles web courantes.' },
      { title: 'Rapports PDF', qty: 'Exports détaillés pour les équipes techniques et la direction.' },
      { title: 'Zéro Faux Positif', qty: 'Algorithme de validation par IA pour réduire le bruit.' },
      { title: 'Scan Continu', qty: 'Surveillance 24/7 de votre périmètre exposé.' }
    ],
    techSpecs: [
      { label: 'Scanner Engine', value: 'Nmap / OpenVAS Custom' },
      { label: 'Compliance', value: 'ISO 27001' },
      { label: 'Deployment', value: 'SaaS / On-Premise' }
    ]
  },
  {
    id: 'leakmonitor',
    title: 'LeakMonitor',
    subtitle: 'Fuites de Données',
    description: 'Surveillance du darkweb et des accès aux documents sensibles pour prévenir les exfiltrations de données critiques.',
    fullDescription: 'Système avancé de surveillance des fuites de données et de traçabilité des accès aux documents sensibles. Détecte les comportements anormaux, surveille le darkweb et prévient les exfiltrations de données critiques.',
    icon: IconEye,
    status: 'coming_soon',
    theme: 'blue',
    badge: 'En Dév',
    cta: 'En savoir plus',
    specs: ['DLP', 'Darkweb'],
    benefits: [
      { title: 'DLP Avancé', qty: 'Data Loss Prevention pour vos documents critiques.' },
      { title: 'Audit Log', qty: 'Journalisation inviolable de tous les accès.' },
      { title: 'Alertes Temps Réel', qty: 'Soyez notifié dès qu\'une anomalie est détectée.' },
      { title: 'Veille Darkweb', qty: 'Scan proactif des bases de données fuitées.' }
    ],
    techSpecs: [
      { label: 'Detection', value: 'AI / Pattern Matching' },
      { label: 'Sources', value: 'Darkweb / Pastebin' },
      { label: 'Notification', value: 'Email / SMS / Webhook' }
    ]
  }
]
