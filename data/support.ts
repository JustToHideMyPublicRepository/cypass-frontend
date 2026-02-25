import { IconUserCircle, IconShieldLock, IconTerminal2, IconFileDescription, IconDeviceLaptop, IconBroadcast, IconScale, IconUsersGroup } from '@tabler/icons-vue'

export interface SupportArticle {
  id: string
  title: string
  content: string
  category: string
  lastUpdate: string
}

export interface SupportCategory {
  id: string
  title: string
  desc: string
  icon: any
  colorClass: string
  articles: SupportArticle[]
}

export const supportData: SupportCategory[] = [
  {
    id: 'account',
    title: 'Compte & Profil',
    desc: 'Gestion de votre identité, mise à jour des informations et paramètres de compte.',
    icon: IconUserCircle,
    colorClass: 'bg-primary/10 text-primary',
    articles: [
      {
        id: 'update-info',
        title: 'Mettre à jour mes informations personnelles',
        content: 'Vous pouvez modifier vos informations de contact via l\'onglet Profil dans vos paramètres. Certaines données d\'identité officielle nécessitent une visite physique.',
        category: 'Compte & Profil',
        lastUpdate: '2026-02-15'
      },
      {
        id: 'two-factor',
        title: 'Activer la double authentification (2FA)',
        content: 'Sécurisez votre compte en activant la 2FA via une application d\'authentification type Google Authenticator ou Authy.',
        category: 'Compte & Profil',
        lastUpdate: '2026-02-10'
      },
      {
        id: 'delete-account',
        title: 'Supprimer mon compte CYPASS',
        content: 'La suppression de compte est une action irréversible. Toutes vos certifications et preuves d\'intégrité seront dissociées de votre identité.',
        category: 'Compte & Profil',
        lastUpdate: '2026-01-20'
      },
      {
        id: 'export-data',
        title: 'Exporter mes données personnelles',
        content: 'Conformément au RGPD et à la loi sur le numérique au Bénin, vous pouvez télécharger une archive de toutes vos données stockées sur CYPASS.',
        category: 'Compte & Profil',
        lastUpdate: '2026-02-05'
      }
    ]
  },
  {
    id: 'security',
    title: 'Sécurité & Accès',
    desc: 'Double authentification, réinitialisation de mot de passe et historique de connexion.',
    icon: IconShieldLock,
    colorClass: 'bg-success/10 text-success',
    articles: [
      {
        id: 'reset-password',
        title: 'Réinitialiser mon mot de passe',
        content: 'Si vous avez perdu votre mot de passe, utilisez la procédure d\'oubli sur la page de connexion.',
        category: 'Sécurité & Accès',
        lastUpdate: '2026-02-12'
      },
      {
        id: 'suspicious-activity',
        title: 'Signaler une activité suspecte',
        content: 'Si vous remarquez une connexion inhabituelle, changez immédiatement votre mot de passe et révoquez toutes les sessions actives.',
        category: 'Sécurité & Accès',
        lastUpdate: '2026-02-14'
      },
      {
        id: 'device-management',
        title: 'Gérer mes appareils connectés',
        content: 'Visualisez la liste de tous les navigateurs et appareils ayant accès à votre compte. Vous pouvez forcer la déconnexion d\'un appareil à tout moment.',
        category: 'Sécurité & Accès',
        lastUpdate: '2026-02-01'
      },
      {
        id: 'security-keys',
        title: 'Utilisation des clés de sécurité matérielles',
        content: 'CYPASS supporte les clés YubiKey et autres dispositifs FIDO2 pour une protection maximale de votre identité numérique.',
        category: 'Sécurité & Accès',
        lastUpdate: '2026-01-25'
      }
    ]
  },
  {
    id: 'docs',
    title: 'Certification & Documents',
    desc: 'Comprendre comment certifier vos documents et vérifier leur authenticité.',
    icon: IconFileDescription,
    colorClass: 'bg-orange-500/10 text-orange-500',
    articles: [
      {
        id: 'how-to-certify',
        title: 'Comment certifier un document ?',
        content: 'Déposez votre fichier dans l\'espace DocsEntry. Le système générera une preuve d\'intégrité blockchain.',
        category: 'Certification & Documents',
        lastUpdate: '2026-02-18'
      },
      {
        id: 'verification-standard',
        title: 'Qu\'est-ce que le standard PAdES ?',
        content: 'C\'est une norme européenne pour les signatures électroniques avancées appliquées aux fichiers PDF.',
        category: 'Certification & Documents',
        lastUpdate: '2026-02-03'
      },
      {
        id: 'document-expiration',
        title: 'Durée de validité des certifications',
        content: 'Une preuve d\'intégrité CYPASS est permanente. Cependant, le certificat de signature utilisé peut avoir une date d\'expiration.',
        category: 'Certification & Documents',
        lastUpdate: '2026-01-15'
      },
      {
        id: 'batch-certification',
        title: 'Certification par lots (Bulk)',
        content: 'Les entreprises peuvent certifier des milliers de documents simultanément via nos outils d\'automatisation ou API.',
        category: 'Certification & Documents',
        lastUpdate: '2026-02-20'
      }
    ]
  },
  {
    id: 'tech',
    title: 'Développeurs & API',
    desc: 'Documentation technique, intégration SDKs et accès aux environnements de test.',
    icon: IconTerminal2,
    colorClass: 'bg-secondary/10 text-secondary',
    articles: [
      {
        id: 'api-access',
        title: 'Obtenir des clés API',
        content: 'Les développeurs peuvent générer des credentials OAuth2 via le portail développeur dédié.',
        category: 'Développeurs & API',
        lastUpdate: '2026-02-22'
      },
      {
        id: 'sdk-languages',
        title: 'Langages supportés par nos SDK',
        content: 'Nous proposons actuellement des bibliothèques en Node.js, Python et PHP.',
        category: 'Développeurs & API',
        lastUpdate: '2026-02-11'
      },
      {
        id: 'webhooks',
        title: 'Configuration des Webhooks',
        content: 'Recevez des notifications en temps réel lors de la certification d\'un document ou d\'une authentification réussie via CYPASS Connect.',
        category: 'Développeurs & API',
        lastUpdate: '2026-02-19'
      },
      {
        id: 'sandbox-env',
        title: 'Environnement de Test (Sandbox)',
        content: 'Utilisez notre bac à sable pour tester vos intégrations sans impacter les données réelles. Les certificats de test sont gratuits.',
        category: 'Développeurs & API',
        lastUpdate: '2026-02-24'
      },
      {
        id: 'oauth-scopes',
        title: 'Comprendre les Scopes OAuth2',
        content: 'Limitez les permissions de votre application en demandant uniquement les scopes nécessaires (openid, profile, documents.read).',
        category: 'Développeurs & API',
        lastUpdate: '2026-02-07'
      },
      {
        id: 'rate-limiting',
        title: 'Limites de débit de l\'API',
        content: 'Découvrez les quotas d\'appels selon votre niveau de souscription et comment gérer les erreurs 429.',
        category: 'Développeurs & API',
        lastUpdate: '2026-01-30'
      }
    ]
  },
  {
    id: 'community',
    title: 'Veille communautaire',
    desc: 'Participez à la sécurité collective en signalant des menaces et en consultant les alertes.',
    icon: IconBroadcast,
    colorClass: 'bg-purple-500/10 text-purple-500',
    articles: [
      {
        id: 'threat-report',
        title: 'Comment signaler une menace ?',
        content: 'Utilisez l\'interface VigiTech pour soumettre des preuves de fraude ou de phishing. Votre signalement sera analysé par nos experts.',
        category: 'Veille communautaire',
        lastUpdate: '2026-02-21'
      },
      {
        id: 'alert-levels',
        title: 'Comprendre les niveaux d\'alerte',
        content: 'Les alertes VigiTech vont de "Information" à "Critique". Chaque niveau correspond à un risque spécifique pour l\'écosystème.',
        category: 'Veille communautaire',
        lastUpdate: '2026-02-16'
      },
      {
        id: 'community-rewards',
        title: 'Programme de récompenses communautaires',
        content: 'Les contributeurs les plus actifs au réseau de veille reçoivent des badges de confiance et des accès privilégiés.',
        category: 'Veille communautaire',
        lastUpdate: '2026-02-13'
      }
    ]
  },
  {
    id: 'legal',
    title: 'Légal & Réglementation',
    desc: 'Cadre juridique de la certification numérique et conformité aux lois béninoises.',
    icon: IconScale,
    colorClass: 'bg-rose-500/10 text-rose-500',
    articles: [
      {
        id: 'digital-code',
        title: 'Le Code du Numérique au Bénin',
        content: 'CYPASS est entièrement conforme aux dispositions du Code du Numérique concernant la signature électronique et la preuve numérique.',
        category: 'Légal & Réglementation',
        lastUpdate: '2026-02-02'
      },
      {
        id: 'privacy-policy',
        title: 'Politique de confidentialité et RGPD',
        content: 'Découvrez comment nous protégeons vos données personnelles et quels sont vos droits d\'accès et de rectification.',
        category: 'Légal & Réglementation',
        lastUpdate: '2026-02-09'
      },
      {
        id: 'terms-of-use',
        title: 'Conditions Générales d\'Utilisation',
        content: 'Les règles d\'utilisation de la plateforme CYPASS pour les particuliers et les professionnels.',
        category: 'Légal & Réglementation',
        lastUpdate: '2026-01-10'
      }
    ]
  },
  {
    id: 'network',
    title: 'Partenariats & Réseau',
    desc: 'Devenez partenaire certifié ou intégrez CYPASS dans votre organisation.',
    icon: IconUsersGroup,
    colorClass: 'bg-emerald-500/10 text-emerald-500',
    articles: [
      {
        id: 'become-partner',
        title: 'Comment devenir partenaire CYPASS ?',
        content: 'Les institutions financières et administratives peuvent demander un accès partenaire pour valider des documents en temps réel.',
        category: 'Partenariats & Réseau',
        lastUpdate: '2026-02-23'
      },
      {
        id: 'corporate-accounts',
        title: 'Gestion des comptes entreprises',
        content: 'Créez un compte organisation pour gérer plusieurs collaborateurs et automatiser vos processus de certification.',
        category: 'Partenariats & Réseau',
        lastUpdate: '2026-02-08'
      }
    ]
  }
]
