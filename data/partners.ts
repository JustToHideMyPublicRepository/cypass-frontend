export interface Partner {
  name: string
  role: string
  logo: string
  website: string
  initials?: string
  style?: string
}

export const partners: Partner[] = [
  {
    name: 'ASIN',
    role: 'Agence des Systèmes d\'Information et du Numérique',
    logo: 'https://asin.bj/images/thumbnail.png',
    website: 'https://asin.bj',
    initials: 'ASIN',
    style: 'text-xl font-bold border-2 border-current px-2 py-1'
  },
  {
    name: 'BJ-CSIRT',
    role: 'Centre de Réponse aux Incidents de Sécurité Informatique',
    logo: 'https://csirt.gouv.bj/wp-content/uploads/2020/11/Logo_bjCSIRT_fond_blanc_text_noir.png',
    website: 'https://csirt.gouv.bj/',
    initials: 'CSIRT'
  },
  {
    name: 'ARCEP',
    role: 'Autorité de Régulation des Communications Électroniques',
    logo: 'https://srtb.bj/storage/2021/01/ARCEP.jpg',
    website: 'https://arcep.bj/',
    initials: 'ARCEP'
  },
  {
    name: 'MND',
    role: 'Ministère du Numérique et de la Digitalisation',
    logo: 'https://www.africa-newsroom.com/files/thumb/9eca1b9c80df554/800/600',
    website: 'https://numerique.gouv.bj/',
    initials: 'MND'
  },
  {
    name: 'APIEX',
    role: 'Agence de Promotion des Investissements et des Exportations',
    logo: 'https://admin-home.monentreprise.bj/uploads/APIEX_LOGO_Copy_a7a4435d53.png',
    website: 'https://monentreprise.bj/',
    initials: 'APIEX'
  },
  {
    name: 'GOUV.BJ',
    role: 'Portail Officiel du Gouvernement du Bénin',
    logo: 'https://www.gouv.bj/images/logo-white.png',
    website: 'https://www.gouv.bj/',
    initials: 'GOUV',
    style: 'text-2xl font-bold font-serif'
  }
]
