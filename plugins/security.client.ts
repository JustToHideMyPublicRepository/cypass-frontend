import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  if (process.server) return

  const showWarning = () => {
    const headerStyle = `
      color: #ff0000;
      font-size: 3rem;
      font-weight: 900;
      text-shadow: 2px 2px 0px black;
      font-family: system-ui, sans-serif;
    `
    const subHeaderStyle = `
      color: #0072FF;
      font-size: 1.5rem;
      font-weight: bold;
      font-family: system-ui, sans-serif;
    `
    const textStyle = `
      color: #323C4F;
      font-size: 1.2rem;
      line-height: 1.5;
      font-family: system-ui, sans-serif;
    `
    const dangerStyle = `
      color: #ff0000;
      font-size: 1.2rem;
      font-weight: bold;
      font-family: system-ui, sans-serif;
    `

    console.log('%cATTENTION : ALERTE SÉCURITÉ CYPASS', headerStyle)
    console.log('%cNe copiez rien ici si vous ne savez pas ce que vous faites !', subHeaderStyle)
    console.log(
      '%cSi quelqu\'un vous a demandé de copier-coller du code ici, il s\'agit d\'une tentative de %cvole de vos informations personnelles ou de votre compte%c.',
      textStyle,
      dangerStyle,
      textStyle
    )
    console.log(
      '%cIl n\'y a AUCUNE fonctionnalité CYPASS que vous pouvez débloquer via cette console.',
      textStyle
    )
    console.log('%cFermez cette fenêtre pour rester en sécurité.', textStyle)
  }

  // Show immediately and when the console is potentially cleared
  showWarning()
})
