<template>
  <div
    :class="['flex items-center justify-center', containerClass, !containerClass.includes('text-') ? 'text-primary' : '']">
    <div :class="['relative transition-all duration-300', sizeClasses[size]]">
      <svg viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg"
        class="w-full h-full overflow-visible">
        <!-- Filtre de lueur -->
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Cercle de fond -->
        <circle cx="512" cy="512" r="500" stroke="currentColor" stroke-width="32" class="opacity-20 animate-draw-circle"
          stroke-linecap="round" fill="none" />

        <!-- Support principal du logo -->
        <circle cx="512" cy="512" r="512" fill="currentColor" class="animate-logo-pop" style="filter: url(#glow);" />

        <g class="text-WtB">
          <!-- Corps (Bouclier) - Assemblage dynamique -->
          <path d="M512 376L280 476V656C280 788.548 402.667 868 512 908C621.333 868 744 788.548 744 656V476L512 376Z"
            fill="currentColor" class="animate-shield-assemble" />

          <!-- Anse (Shackle) - Verrouillage -->
          <path
            d="M376 436V288C376 212.891 436.891 152 512 152C587.109 152 648 212.891 648 288V436H692V288C692 188.589 611.411 108 512 108C412.589 108 332 188.589 332 288V436H376Z"
            fill="currentColor" class="animate-shackle-lock" />

          <!-- Trou de serrure - Signal lumineux -->
          <g class="animate-key-glow">
            <circle cx="512" cy="580" r="40" fill="black" class="opacity-40" />
            <path d="M512 580V700" stroke="black" stroke-width="60" stroke-linecap="round" class="opacity-40" />
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg' | 'xl'
  containerClass?: string
}>(), {
  size: 'md',
  containerClass: ''
})

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-14 h-14 md:w-16 md:h-16',
  xl: 'w-20 h-20 md:w-24 md:h-24'
}
</script>

<style scoped>
/* Dessin du contour */
@keyframes draw-circle {
  0% {
    stroke-dasharray: 0 3200;
    opacity: 0;
  }

  20% {
    stroke-dasharray: 1600 3200;
    opacity: 0.5;
  }

  40%,
  100% {
    stroke-dasharray: 3200 3200;
    opacity: 0;
  }
}

/* Explosion/Pop du logo */
@keyframes logo-pop {

  0%,
  15% {
    transform: scale(0);
    opacity: 0;
    filter: brightness(2) blur(10px);
  }

  25% {
    transform: scale(1.1);
    opacity: 1;
    filter: brightness(1.5) blur(0px);
  }

  35%,
  85% {
    transform: scale(1);
    opacity: 1;
    filter: brightness(1) blur(0px);
  }

  100% {
    transform: scale(0.8);
    opacity: 0;
  }
}

/* Montage du bouclier avec un petit rebond */
@keyframes shield-assemble {

  0%,
  25% {
    transform: translateY(150px) scale(0.8);
    opacity: 0;
  }

  40% {
    transform: translateY(-10px) scale(1.05);
    opacity: 1;
  }

  50%,
  85% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }

  100% {
    transform: translateY(-50px);
    opacity: 0;
  }
}

/* Descente de l'anse pour "fermer" le cadenas */
@keyframes shackle-lock {

  0%,
  40% {
    transform: translateY(-150px);
    opacity: 0;
  }

  55% {
    transform: translateY(5px);
    opacity: 1;
  }

  65%,
  85% {
    transform: translateY(0);
    opacity: 1;
  }

  100% {
    transform: translateY(-80px);
    opacity: 0;
  }
}

/* Pulsation finale du trou de serrure */
@keyframes key-glow {

  0%,
  65% {
    opacity: 0;
    transform: scale(0.5);
  }

  75% {
    opacity: 1;
    transform: scale(1.2);
  }

  85% {
    opacity: 0.4;
    transform: scale(1);
  }

  100% {
    opacity: 0;
  }
}

.animate-draw-circle {
  animation: draw-circle 4s linear infinite;
}

.animate-logo-pop {
  animation: logo-pop 4s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
  transform-origin: center;
  transform-box: fill-box;
}

.animate-shield-assemble {
  animation: shield-assemble 4s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
  transform-origin: center;
  transform-box: fill-box;
}

.animate-shackle-lock {
  animation: shackle-lock 4s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
  transform-origin: center;
  transform-box: fill-box;
}

.animate-key-glow {
  animation: key-glow 4s ease-out infinite;
  transform-origin: center;
  transform-box: fill-box;
}
</style>
