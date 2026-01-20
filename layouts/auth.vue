<template>
  <div class="h-screen w-full flex overflow-hidden">
    <!-- Left Column: Form Area (1/3) -->
    <div
      class="w-full lg:w-1/3 h-full z-10 bg-WtB shadow-2xl lg:shadow-none relative flex flex-col border-r border-ash">

      <!-- Theme Toggle (Fixed relative to column) -->
      <div class="absolute top-6 right-6 z-30">
        <UiThemeToggle />
      </div>

      <!-- Scrollable Content -->
      <LayoutAuthFormContainer>
        <slot />
      </LayoutAuthFormContainer>
    </div>

    <!-- Right Column: Visual Area (2/3) -->
    <LayoutAuthVisual />
  </div>
</template>
