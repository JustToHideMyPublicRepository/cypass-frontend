/**
 * Utility to get a dynamic greeting based on the current time and a random selection.
 */

const greetings = {
  morning: [
    'Bonjour',
    'Bonne matinée',
    'Bon début de journée',
    'Excellent matin',
    'Bon pied, bon œil !',
    'Heureux de vous voir ce matin',
    'Que votre matinée soit productive',
    'Un agréable réveil à vous',
    'Salut, prêt pour la journée ?',
    'Matin lumineux à vous',
  ],
  afternoon: [
    'Bon après-midi',
    'Ravi de vous revoir',
    'Excellente continuation',
    'Que votre après-midi soit agréable',
    'Bel après-midi à vous',
    'Bon courage pour la suite de la journée',
    'Profitez bien de votre après-midi',
    'Une après-midi pleine de réussite',
    'Bon milieu de journée',
    'Bonne progression dans vos activités',
  ],
  evening: [
    'Bonsoir',
    'Bonne soirée',
    'Excellente soirée',
    'Finissez bien votre journée',
    'Très belle soirée à vous',
    'Profitez de votre soirée',
    'Belle fin de journée',
    'Détendez-vous bien ce soir',
    'Une soirée remplie de sérénité',
    'Clôturez la journée en beauté',
  ],
  night: [
    'Bonne nuit',
    'Bonne fin de soirée',
    'Douce nuit',
    'Il se fait tard',
    'Reposez-vous bien',
    'Faites de beaux rêves',
    'Nuit paisible à vous',
    'À demain, reposez-vous bien',
    'Que la nuit vous ressource',
    'Il est temps de déconnecter',
  ]
}

export const getDynamicGreeting = (): string => {
  const hour = new Date().getHours()
  let category: keyof typeof greetings = 'morning'

  if (hour >= 5 && hour < 12) {
    category = 'morning'
  } else if (hour >= 12 && hour < 18) {
    category = 'afternoon'
  } else if (hour >= 18 && hour < 22) {
    category = 'evening'
  } else {
    category = 'night'
  }

  const list = greetings[category]
  const randomIndex = Math.floor(Math.random() * list.length)
  return list[randomIndex]
}
