import { IconSchool, IconFileCertificate, IconClipboardText, IconFileText, IconFileDescription, IconFilePower, IconFile, IconFiles } from '@tabler/icons-vue'

/**
 * Interface représentant une étape du processus de vérification
 */
export interface Step {
  id: string
  label: string
  description: string
  status: 'pending' | 'loading' | 'completed' | 'error'
}


/**
 * Retourne le style visuel associé à un document selon son mode et ses versions
 */
export const getDocumentStyle = (hasVersions: boolean, mode: string) => {
  const isEnriched = mode === 'enrichie' || mode === 'enriched'

  if (hasVersions) {
    return {
      bgColor: 'bg-primary/5',
      color: 'text-primary',
      icon: IconFiles
    }
  }

  if (isEnriched) {
    return {
      bgColor: 'bg-warning/10',
      color: 'text-warning',
      icon: IconFilePower
    }
  }

  return {
    bgColor: 'bg-success/10',
    color: 'text-success',
    icon: IconFile
  }
}

/**
 * Étapes par défaut de la vérification de document
 */
export const verifySteps: Step[] = [
  {
    id: 'file-metadata',
    label: 'Analyse',
    description: 'Lecture des métadonnées du document',
    status: 'pending'
  },
  {
    id: 'hash-calculation',
    label: 'Calcul',
    description: 'Génération de l\'empreinte SHA-256',
    status: 'pending'
  },
  {
    id: 'integrity-check',
    label: 'Vérification',
    description: 'Validation de la signature souveraine',
    status: 'pending'
  }
]

/**
 * Étapes par défaut de l'authentification de document
 */
export const authSteps: Step[] = [
  {
    id: 'file-processing',
    label: 'Traitement',
    description: 'Analyse et préparation du document',
    status: 'pending'
  },
  {
    id: 'hash-generation',
    label: 'Empreinte',
    description: 'Calcul de la signature numérique unique',
    status: 'pending'
  },
  {
    id: 'encryption-signature',
    label: 'Sécurisation',
    description: 'Application du sceau cryptographique CYPASS',
    status: 'pending'
  }
]



/**
 * Retourne l'icône associée à une catégorie de document
 * @param key Clé de la catégorie (diplome, attestation, certificat, etc.)
 */
export const getDocCategoryIcon = (key: string) => {
  const k = key?.toLowerCase()
  switch (k) {
    case 'diplome':
      return IconSchool
    case 'attestation':
      return IconFileCertificate
    case 'certificat':
      return IconClipboardText
    case 'releve_notes':
      return IconFileText
    default:
      return IconFileDescription
  }
}

/**
 * Traduit une clé de catégorie de document en français
 */
export const translateDocCategory = (key?: string | null) => {
  if (!key) return '—'
  const mapping: Record<string, string> = {
    diplome: 'Diplôme',
    attestation: 'Attestation',
    certificat: 'Certificat',
    releve_notes: 'Relevé de notes'
  }
  return mapping[key.toLowerCase()] || key
}

/**
 * Traduit une clé de métadonnée enrichie en français
 */
export const translateEnrichedField = (key: string) => {
  const mapping: Record<string, string> = {
    holder_name: 'Détenteur',
    institution: 'Établissement',
    field_of_study: 'Filière',
    academic_year: 'Année académique',
    mention: 'Mention',
    issue_date: 'Date d\'émission',
    purpose: 'Objet',
    issuing_body: 'Organisme émetteur',
    certificate_type: 'Type de certificat',
    level: 'Niveau / Classe'
  }
  return mapping[key.toLowerCase()] || key.replace(/_/g, ' ')
}
