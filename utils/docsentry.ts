export interface Step {
  id: string
  label: string
  description: string
  status: 'pending' | 'loading' | 'completed' | 'error'
}

export const authSteps: Step[] = [
  {
    id: 'prepare',
    label: 'Préparation',
    description: 'Initialisation du document pour traitement',
    status: 'pending'
  },
  {
    id: 'hash',
    label: 'Empreinte numérique',
    description: 'Génération du hash SHA-256 unique',
    status: 'pending'
  },
  {
    id: 'network',
    label: 'Réseau souverain',
    description: 'Communication avec les serveurs CYPASS',
    status: 'pending'
  },
  {
    id: 'sign',
    label: 'Signature numérique',
    description: 'Application du sceau cryptographique Ed25519',
    status: 'pending'
  },
  {
    id: 'finalize',
    label: 'Finalisation',
    description: 'Génération du certificat de conformité',
    status: 'pending'
  }
]

export const verifySteps: Step[] = [
  {
    id: 'metadata',
    label: 'Métadonnées',
    description: 'Lecture des informations du document',
    status: 'pending'
  },
  {
    id: 'extract',
    label: 'Extraction',
    description: 'Calcul et extraction de l\'empreinte cryptographique',
    status: 'pending'
  },
  {
    id: 'ledger',
    label: 'Comparaison',
    description: 'Vérification dans le registre CYPASS',
    status: 'pending'
  },
  {
    id: 'authenticity',
    label: 'Authenticité',
    description: 'Validation de l\'intégrité de la signature',
    status: 'pending'
  },
  {
    id: 'report',
    label: 'Rapport',
    description: 'Génération du rapport de vérification final',
    status: 'pending'
  }
]
