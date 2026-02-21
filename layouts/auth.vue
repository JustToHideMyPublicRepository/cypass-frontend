<template>
  <div class="h-screen w-full flex overflow-hidden">
    <!-- Colonne de gauche : Zone de formulaire (1/3) -->
    <div
      class="w-full lg:w-1/3 h-full z-10 bg-WtB shadow-2xl lg:shadow-none relative flex flex-col border-r border-ash">

      <!-- Sélecteur de thème -->
      <div class="absolute top-6 right-6 z-30">
        <UiThemeToggle />
      </div>

      <!-- Contenu défilable -->
      <LytAuthFormContainer>
        <slot />
      </LytAuthFormContainer>
    </div>

    <!-- Colonne de droite : Zone visuelle (2/3) -->
    <LytAuthVisual />
  </div>
</template>
