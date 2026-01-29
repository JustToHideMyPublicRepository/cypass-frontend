<template>
  <div class="h-screen w-full flex overflow-hidden">
    <!-- Left Column: Form Area (1/3) -->
    <div
      class="w-full lg:w-1/3 h-full z-10 bg-WtB shadow-2xl lg:shadow-none relative flex flex-col border-r border-ash">

      <!-- Theme Toggle -->
      <div class="absolute top-6 right-6 z-30">
        <UiThemeToggle />
      </div>

      <!-- Scrollable Content -->
      <LytAuthFormContainer>
        <slot />
      </LytAuthFormContainer>
    </div>

    <!-- Right Column: Visual Area (2/3) -->
    <LytAuthVisual />
  </div>
</template>
