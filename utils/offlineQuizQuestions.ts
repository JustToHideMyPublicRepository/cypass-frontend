export interface Question {
  text: string
  options: string[]
  correctIndex: number
  explanation: string
}

export const offlineQuestions: Question[] = [
  {
    text: "Quelle est la méthode la plus sûre pour protéger vos comptes en ligne ?",
    options: [
      "Utiliser le même mot de passe partout",
      "Activer l'authentification à deux facteurs (2FA)",
      "Changer de mot de passe tous les ans",
      "Ne jamais se déconnecter"
    ],
    correctIndex: 1,
    explanation: "La 2FA ajoute une couche de sécurité cruciale : même si un pirate trouve votre mot de passe, il ne pourra pas accéder à votre compte sans le second code."
  },
  {
    text: "Vous recevez un email alarmant d'une banque vous demandant de cliquer sur un lien pour 'vérifier votre identité'. De quoi s'agit-il ?",
    options: [
      "Une procédure de sécurité standard",
      "Une mise à jour système",
      "Une tentative de phishing (hameçonnage)",
      "Un cadeau d'anniversaire"
    ],
    correctIndex: 2,
    explanation: "Les banques ne demandent jamais d'identifiants par email. Vérifiez toujours l'adresse de l'expéditeur et ne cliquez jamais sur des liens suspects."
  },
  {
    text: "Qu'est-ce qu'un Ransomware (rançongiciel) ?",
    options: [
      "Un logiciel qui accélère votre PC",
      "Un virus qui crypte vos fichiers et demande de l'argent",
      "Un programme de nettoyage de disque",
      "Un type de carte réseau"
    ],
    correctIndex: 1,
    explanation: "Le ransomware prend vos données en otage. La meilleure protection est d'avoir des sauvegardes régulières hors ligne."
  },
  {
    text: "Pourquoi est-il risqué d'utiliser un Wi-Fi public gratuit sans VPN ?",
    options: [
      "La connexion est trop lente",
      "Vos données peuvent être interceptées par d'autres utilisateurs",
      "Cela décharge la batterie plus vite",
      "Le Wi-Fi public est payant en réalité"
    ],
    correctIndex: 1,
    explanation: "Sur un réseau ouvert, les pirates peuvent 'écouter' votre trafic. Un VPN encrypte vos données, les rendant illisibles pour les tiers."
  },
  {
    text: "Quelle caractéristique définit un mot de passe robuste ?",
    options: [
      "Le nom de votre animal de compagnie",
      "Au moins 12 caractères mixant lettres, chiffres et symboles",
      "Votre date de naissance",
      "Le mot 'Azerty123'"
    ],
    correctIndex: 1,
    explanation: "La complexité et la longueur augmentent exponentiellement le temps nécessaire à un ordinateur pour deviner votre mot de passe par 'force brute'."
  },
  {
    text: "Que signifie l'acronyme RGPD ?",
    options: [
      "Règlement Général sur la Protection des Données",
      "Réseau Global de Protection Digitale",
      "Registre des Grands Protocoles de Défense",
      "Règlement de Gestion des Particuliers et des Données"
    ],
    correctIndex: 0,
    explanation: "Le RGPD est le cadre juridique européen qui protège la vie privée et les données personnelles des citoyens."
  },
  {
    text: "Quelle est la première action à faire en cas de vol de votre téléphone ?",
    options: [
      "Appeler la police",
      "Acheter un nouveau téléphone",
      "Bloquer votre carte SIM et vos comptes à distance",
      "Envoyer un SMS au voleur"
    ],
    correctIndex: 2,
    explanation: "La priorité est de sécuriser l'accès à vos données bancaires, emails et réseaux sociaux en bloquant les accès distants."
  },
  {
    text: "Quel est le but principal d'un pare-feu (firewall) ?",
    options: [
      "Éteindre les incendies de serveurs",
      "Améliorer la vitesse de téléchargement",
      "Filtrer le trafic entrant et sortant pour bloquer les menaces",
      "Nettoyer les virus sur le disque dur"
    ],
    correctIndex: 2,
    explanation: "Un pare-feu surveille et contrôle le trafic réseau entrant et sortant selon des règles de sécurité établies."
  },
  {
    text: "Que signifie 'le HTTPS' (petit cadenas) dans la barre d'adresse ?",
    options: [
      "Le site est hébergé en France",
      "La connexion entre vous et le site est cryptée",
      "Le site appartient obligatoirement au gouvernement",
      "Le site est protégé contre tous les virus"
    ],
    correctIndex: 1,
    explanation: "HTTPS garantit que les informations échangées ne peuvent pas être interceptées 'en clair' par un pirate sur le réseau."
  },
  {
    text: "Qu'est-ce qu'une attaque 'Zero-Day' ?",
    options: [
      "Une attaque qui dure 24 heures",
      "Une attaque pendant les jours fériés",
      "Une attaque exploitant une faille inconnue du fabricant",
      "Une attaque sans aucune conséquence"
    ],
    correctIndex: 2,
    explanation: "Une faille Zero-Day est une vulnérabilité que le développeur n'a pas encore découverte, et donc pour laquelle aucun correctif n'existe encore."
  },
  {
    text: "Comment appelle-t-on le fait de surveiller l'écran de quelqu'un à son insu ?",
    options: [
      "Le Phishing",
      "Le Shoulder Surfing (regard par-dessus l'épaule)",
      "Le Skimming",
      "Le Spoofing"
    ],
    correctIndex: 1,
    explanation: "Le Shoulder Surfing consiste à regarder discrètement ce qu'une personne tape (code PIN, mot de passe) sur son clavier ou écran."
  },
  {
    text: "Qu'est-ce qu'un 'keylogger' ?",
    options: [
      "Un outil de gestion de clavier",
      "Un logiciel malveillant qui enregistre tout ce que vous tapez",
      "Un programme pour accélérer la saisie",
      "Un type de clé de sécurité USB"
    ],
    correctIndex: 1,
    explanation: "Un keylogger enregistre vos frappes au clavier pour voler des identifiants, des numéros de carte bancaire ou des messages privés."
  },
  {
    text: "Que faire avant de jeter un vieux disque dur ou smartphone ?",
    options: [
      "Simplement supprimer les fichiers",
      "Réinitialiser aux paramètres d'usine ou effacer de manière sécurisée",
      "Le mettre à la poubelle directement",
      "Le vendre sans rien faire"
    ],
    correctIndex: 1,
    explanation: "Une simple suppression ne suffit pas. Il faut utiliser des outils d'effacement sécurisé ou une réinitialisation d'usine pour éviter la récupération de données."
  },
  {
    text: "Qu'est-ce que l'ingénierie sociale (Social Engineering) ?",
    options: [
      "Une technique de programmation",
      "La manipulation psychologique pour soutirer des informations",
      "L'étude des réseaux sociaux",
      "Un type de marketing digital"
    ],
    correctIndex: 1,
    explanation: "L'ingénierie sociale s'attaque au 'maillon faible' humain en utilisant la ruse, la pression ou l'autorité pour obtenir des accès."
  },
  {
    text: "Quel est l'avantage d'un gestionnaire de mots de passe ?",
    options: [
      "Il permet d'utiliser le même mot de passe partout",
      "Il génère et stocke des mots de passe complexes et uniques",
      "Il rend votre connexion internet plus rapide",
      "Il remplace l'antivirus"
    ],
    correctIndex: 1,
    explanation: "Le gestionnaire vous permet d'avoir 100 mots de passe différents et complexes sans avoir à les retenir, renforçant drastiquement votre sécurité."
  },
  {
    text: "Que signifie 'DDoS' ?",
    options: [
      "Data Damage on Software",
      "Distributed Denial of Service (Attaque par déni de service distribué)",
      "Digital Defense on Security",
      "Direct Download of Software"
    ],
    correctIndex: 1,
    explanation: "Le DDoS consiste à saturer un serveur de requêtes provenant de multiples sources pour le rendre inaccessible."
  }
]
