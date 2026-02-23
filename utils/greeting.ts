/**
 * Utility to get a dynamic greeting based on the current time and a random selection.
 */

const greetings = {
  morning: [
    'Bonjour',
    'Bonne matinée',
    'Bon début de journée',
    'Excellent matin'
  ],
  afternoon: [
    'Bon après-midi',
    'Bonne après-midi',
    'Ravi de vous revoir',
    'Passez une belle après-midi'
  ],
  evening: [
    'Bonsoir',
    'Bonne soirée',
    'Excellente soirée',
    'Finissez bien votre journée'
  ],
  night: [
    'Bonne nuit',
    'Bonne fin de soirée',
    'Douce nuit',
    'Il se fait tard'
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
