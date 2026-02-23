export const useVigitechAdvice = () => {
  const getAdvice = (type: string, threatLevel: string) => {
    const advices: Record<string, string> = {
      phishing: "Méfiez-vous des emails ou SMS demandant des informations personnelles. Ne cliquez jamais sur des liens suspects et vérifiez l'expéditeur.",
      ransomware: "Ne payez jamais de rançon. Déconnectez immédiatement les appareils infectés du réseau et restaurez vos données à partir de sauvegardes hors ligne.",
      fake_profile: "Ne partagez pas d'informations sensibles avec des inconnus en ligne. Signalez le profil à la plateforme concernée.",
      harassment: "Documentez les preuves, bloquez l'agresseur et signalez les faits aux autorités compétentes si nécessaire.",
      default: "Restez vigilant et activez l'authentification à deux facteurs sur tous vos comptes sensibles."
    }

    const threatPrefix =
      threatLevel === 'critical' ? "🚨 URGENCE CRITIQUE : "
        : threatLevel === 'medium' ? "⚠️ MISE EN GARDE : "
          : "💡 CONSEIL : "

    return threatPrefix + (advices[type] || advices.default)
  }

  return { getAdvice }
}
