import { IconScan, IconCertificate, IconAlertTriangle, IconEye } from '@tabler/icons-vue'

export interface ServiceBenefit {
  title: string
  qty: string
  desc?: string
}

// Spécifications techniques d'un service
export interface ServiceTechSpec {
  label: string
  value: string
}

// Fonctionnalité mise en avant avec une icône
export interface ServiceFeatureIcon {
  title: string
  desc: string
  icon: any
}

// Interface principale représentant un service CYPASS (Module)
export interface CypassModule {
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
  features?: ServiceFeatureIcon[]
  list?: string[]
  specs?: string[]
  benefits?: ServiceBenefit[]
  techSpecs?: ServiceTechSpec[]
}

export const modules: CypassModule[] = [
  {
    id: 'docsentry',
    title: 'DocSentry',
    subtitle: 'Certification & Intégrité documentaire',
    description: 'Certifiez vos documents avec une empreinte cryptographique infalsifiable et un QR Code vérifiable instantanément, sans compte et sans friction.',
    fullDescription: 'DocSentry génère une preuve d\'intégrité cryptographique pour chaque document soumis, matérialisée par un QR Code et une page de certification attachée. Toute falsification devient immédiatement détectable, par n\'importe quel tiers, en temps réel ou hors ligne.',
    icon: IconCertificate,
    status: 'available',
    theme: 'green',
    badge: 'MVP Actif',
    cta: 'Découvrir la signature',
    list: [
      'Hachage du contenu binaire',
      'Signature numérique',
      'QR Code vérifiable sans compte',
      'API REST pour intégration',
    ],
    specs: ['Ed25519', 'SHA-256'],
    benefits: [
      {
        title: 'Intégrité garantie',
        qty: 'Toute modification du document est détectée instantanément.',
        desc: 'Zéro falsification possible'
      },
      {
        title: 'Vérification publique',
        qty: 'N\'importe quel tiers vérifie l\'authenticité par simple scan du QR Code.',
        desc: 'Sans compte requis'
      },
      {
        title: 'Conformité légale',
        qty: 'Signature numérique reconnue par la loi n°2017-20 du Bénin.',
        desc: 'Valeur juridique locale'
      },
      {
        title: 'API REST',
        qty: 'Intégration directe dans vos systèmes documentaires existants.',
        desc: 'Pour institutions et PME'
      }
    ],
    techSpecs: [
      { label: 'Hachage', value: 'SHA-256' },
      { label: 'Signature', value: 'Ed25519 (Sodium)' },
      { label: 'QR Code', value: 'ISO 18004' },
      { label: 'Storage policie', value: 'Zero Knowledge' }
    ]
  },
  {
    id: 'vigitech',
    title: 'VigiTech',
    subtitle: 'Signalement & Veille Cyber',
    description: 'Réseau d\'alerte communautaire pour signaler les incidents et recevoir des notifications ciblées en temps réel.',
    fullDescription: 'VigiTech est un réseau communautaire de signalement cyber qui permet à tout citoyen ou organisation de remonter un incident (phishing, ransomware, fraude documentaire) avec ou sans preuve numérique. Les incidents qualifiés alimentent un dashboard de veille en temps réel.',
    icon: IconAlertTriangle,
    status: 'available',
    theme: 'green',
    badge: 'Nouveau',
    cta: 'Rejoindre le réseau',
    list: [
      'Signalement d\'incidents anonymisé',
      'Dépôt de preuve numérique (image, PDF)',
      'Dashboard de veille cyber en temps réel',
      'Flux de menaces en temps réel',
    ],
    specs: ['Anonymat', 'Temps réel'],
    benefits: [
      {
        title: 'Anonymat garanti',
        qty: 'Votre identité est découplée du contenu avant toute persistance.',
        desc: 'Zéro traçabilité si anonyme'
      },
      {
        title: 'Veille collective',
        qty: 'Chaque signalement alimente la carte des menaces cyber du territoire.',
        desc: 'Intelligence communautaire'
      },
      {
        title: 'Veille ciblée',
        qty: 'Notifications filtrées par secteur d\'activité.',
        desc: 'Restez informé des menaces pertinentes'
      },
      {
        title: 'Preuve numérique',
        qty: 'Joignez captures d\'écran ou PDF comme pièce forensique à votre signalement.',
        desc: 'Incidents documentés'
      }
    ],
    techSpecs: [
      { label: 'Anonymisation', value: 'Découplage ID/contenu' },
      { label: 'Pièces jointes', value: 'JPEG, PNG, PDF' },
    ]
  },
  {
    id: 'secuscan',
    title: 'SecuScan',
    subtitle: 'Audit & Vulnérabilités Web',
    description: 'Analysez automatiquement votre site ou application et obtenez un rapport priorisé de vos vulnérabilités, sans expert interne requis.',
    fullDescription: 'SecuScan scanne vos actifs web selon le référentiel OWASP Top 10 et génère un rapport priorisé par niveau de criticité avec des recommandations correctives actionnables. Conçu pour les PME et développeurs africains sans équipe sécurité dédiée.',
    icon: IconScan,
    status: 'coming_soon',
    theme: 'blue',
    badge: 'Bientôt',
    cta: 'En savoir plus',
    list: [
      'Scan automatisé selon OWASP Top 10',
      'Rapport priorisé par niveau de criticité',
      'Recommandations correctives actionnables',
      'Export PDF certifiable via DocSentry',
    ],
    specs: ['OWASP Top 10', 'PDF Export'],
    benefits: [
      {
        title: 'Sans expert requis',
        qty: 'Un rapport clair, priorisé et actionnable, même sans équipe sécurité.',
        desc: 'Accessible aux PME'
      },
      {
        title: 'Référentiel international',
        qty: 'Audit basé sur l\'OWASP Top 10, standard mondial de sécurité web.',
        desc: 'Crédibilité garantie'
      },
      {
        title: 'Surveillance continue',
        qty: 'Planifiez des scans récurrents pour détecter toute nouvelle exposition.',
        desc: 'Pas juste un audit ponctuel'
      },
      {
        title: 'Rapport certifiable',
        qty: 'Exportez et certifiez votre rapport via DocSentry pour vos audits.',
        desc: 'Preuve de conformité'
      }
    ],
    techSpecs: [
      { label: 'Référentiel', value: 'OWASP Top 10' },
      { label: 'Criticité', value: '4 niveaux' },
      { label: 'Export', value: 'PDF' },
      { label: 'Hébergement', value: 'Souverain (BJ)' }
    ]
  },
  {
    id: 'leakmonitor',
    title: 'LeakMonitor',
    subtitle: 'Surveillance & Fuites de Données',
    description: 'Surveillance en temps réel du darkweb et des accès aux documents sensibles pour prévenir les exfiltrations de données critiques.',
    fullDescription: 'LeakMonitor surveille en continu les sources dark web, forums underground et bases de données compromises à la recherche d\'indicateurs de compromission liés à votre organisation. Alertes temps réel, rapports de conformité RGPD/loi n°2017-20, et escalade vers VigiTech pour les incidents critiques.',
    icon: IconEye,
    status: 'coming_soon',
    theme: 'blue',
    badge: 'Bientôt',
    cta: 'En savoir plus',
    list: [
      'Surveillance dark web et sources underground',
      'Alertes temps réel sur vos données exposées',
      'Rapports de conformité',
      'Escalade automatique vers VigiTech',
    ],
    specs: ['Dark Web', 'RGPD'],
    benefits: [
      {
        title: 'Détection précoce',
        qty: 'Sachez avant vos clients ou partenaires que vos données ont fui.',
        desc: 'Réagissez avant le désastre'
      },
      {
        title: 'Conformité active',
        qty: 'Prouvez à vos auditeurs que vous surveillez activement vos expositions.',
        desc: 'RGPD & loi n°2017-20'
      },
      {
        title: 'Périmètre large',
        qty: 'Emails, domaines, identifiants, tout votre périmètre est surveillé.',
        desc: 'Couverture complète'
      },
      {
        title: 'Escalade intégrée',
        qty: 'Les fuites critiques déclenchent automatiquement une alerte VigiTech.',
        desc: 'Boucle de réponse fermée'
      }
    ],
    techSpecs: [
      { label: 'Sources', value: 'Dark web + underground' },
      { label: 'Fingerprinting', value: 'Email, domaine, ID' },
      { label: 'Conformité', value: 'RGPD / Loi n°2017-20' },
      { label: 'Hébergement', value: 'Souverain (BJ)' }
    ]
  },
]
