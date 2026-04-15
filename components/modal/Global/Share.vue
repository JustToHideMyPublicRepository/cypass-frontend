<template>
  <UiBaseModal :show="show" :title="title || 'Partager'" @close="$emit('close')">
    <div class="space-y-6 animate-fade-in">
      <div v-if="text" class="p-4 bg-primary/5 rounded-2xl border border-primary/10">
        <p class="text-sm text-BtW font-medium leading-relaxed break-words">
          {{ text }}
        </p>
      </div>

      <div class="space-y-2">
        <label class="text-[10px] font-black uppercase tracking-widest text-hsa ml-1">Lien de partage</label>
        <div class="relative group flex items-center gap-2">
          <input type="text" readonly :value="url" ref="inputRef"
            class="flex-1 px-4 py-3 rounded-2xl bg-ash/30 border border-ashAct/50 text-hsa font-medium focus:ring-0 focus:border-primary/50 transition-all outline-none truncate min-w-0" />
          <UiBaseButton @click="copyLink" variant="primary"
            class="!px-4 !py-3 !rounded-2xl shrink-0 flex justify-center items-center"
            :title="copied ? 'Copié !' : 'Copier le lien'">
            <IconCheck v-if="copied" class="w-5 h-5" />
            <IconCopy v-else class="w-5 h-5" />
          </UiBaseButton>
        </div>
      </div>

      <div class="space-y-3 pt-2">
        <label class="text-[10px] font-black uppercase tracking-widest text-hsa ml-1">Réseaux sociaux</label>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <a v-for="social in socialLinks" :key="social.name" :href="social.url" target="_blank"
            rel="noopener noreferrer"
            :class="['p-3 rounded-xl flex items-center justify-center transition-all group', social.containerClass]"
            :title="`Partager sur ${social.name}`">
            <component :is="social.icon"
              :class="['w-5 h-5 group-hover:scale-110 transition-transform', social.iconClass]" />
          </a>
        </div>
      </div>
    </div>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IconCopy, IconCheck, IconBrandX, IconBrandLinkedin, IconBrandFacebook, IconBrandWhatsapp } from '@tabler/icons-vue'
import { useToastStore } from '~/stores/front/toast'

const props = defineProps<{
  show: boolean
  title?: string
  text?: string
  url: string
}>()

const emit = defineEmits(['close'])

const copied = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const toastStore = useToastStore()

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(props.url)
    copied.value = true
    toastStore.showToast('success', 'Lien copié', 'Le lien a été copié dans le presse-papiers avec succès.')
    if (inputRef.value) {
      inputRef.value.select()
    }
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.warn('Failed to copy to clipboard', err)
  }
}

const socialLinks = computed(() => {
  const encUrl = encodeURIComponent(props.url)
  const encText = encodeURIComponent(props.text || '')

  return [
    {
      name: 'LinkedIn',
      icon: IconBrandLinkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}`,
      containerClass: 'bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border border-[#0A66C2]/20 hover:border-[#0A66C2]/30',
      iconClass: 'text-[#0A66C2]'
    },
    {
      name: 'X (Twitter)',
      icon: IconBrandX,
      url: `https://twitter.com/intent/tweet?text=${encText}&url=${encUrl}`,
      containerClass: 'bg-black hover:bg-black/80 border border-black hover:border-black/80',
      iconClass: 'text-white'
    },
    {
      name: 'Facebook',
      icon: IconBrandFacebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encUrl}`,
      containerClass: 'bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/20 hover:border-[#1877F2]/30',
      iconClass: 'text-[#1877F2]'
    },
    {
      name: 'WhatsApp',
      icon: IconBrandWhatsapp,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent((props.text ? props.text + ' ' : '') + props.url)}`,
      containerClass: 'bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 hover:border-[#25D366]/30',
      iconClass: 'text-[#25D366]'
    }
  ]
})
</script>
