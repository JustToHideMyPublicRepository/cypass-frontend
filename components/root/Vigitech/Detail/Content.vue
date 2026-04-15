<template>
  <div class="space-y-8">
    <div class="h-px bg-ashAct/50"></div>

    <div class="space-y-6">
      <h3 class="text-xs font-black text-hsa uppercase tracking-[0.3em]">Détail de l'incident</h3>
      <p class="text-lg md:text-xl text-BtW leading-relaxed whitespace-pre-wrap">
        {{ decodeHtmlEntities(incident.description) }}
      </p>
    </div>

    <!-- Evidence Section with Toggle -->
    <div v-if="incident.evidence_file" class="pt-8 space-y-6">
      <button @click="showEvidence = !showEvidence"
        class="flex items-center gap-2 text-xs font-black text-hsa uppercase tracking-[0.3em] hover:text-primary transition-colors">
        <component :is="showEvidence ? IconChevronUp : IconChevronDown" class="w-4 h-4" />
        Preuve de l'incident
      </button>

      <div v-if="showEvidence" class="animate-fade-in space-y-6">
        <div v-if="isImage(incident.evidence_file)" @click="openViewer(getFullUrl(incident.evidence_file))"
          class="group relative rounded-3xl overflow-hidden border border-ash bg-ash/5 cursor-zoom-in aspect-video md:aspect-auto max-h-[600px] transition-transform hover:scale-[1.01] active:scale-[0.99]">
          <img :src="getFullUrl(incident.evidence_file)" class="w-full h-full object-contain mx-auto" alt="Evidence" />
          <div
            class="absolute inset-0 bg-BtW/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div
              class="p-3 bg-white/90 backdrop-blur rounded-2xl shadow-xl text-primary transform translate-y-4 group-hover:translate-y-0 transition-transform">
              <IconZoomIn class="w-6 h-6" />
            </div>
          </div>
        </div>

        <!-- PDF Viewer Frame -->
        <div v-else-if="isPdf(incident.evidence_file)" class="space-y-4">
          <div class="w-full h-[600px] rounded-[2rem] overflow-hidden border border-ash shadow-inner bg-ash/5">
            <iframe :src="getFullUrl(incident.evidence_file)" class="w-full h-full border-none"></iframe>
          </div>
          <div class="flex items-center justify-between p-6 rounded-2xl bg-ash/5 border border-ashAct">
            <div class="flex items-center gap-4">
              <IconFileTypePdf class="w-8 h-8 text-danger" />
              <p class="text-sm font-black text-BtW tracking-tight">Vue PDF intégrée</p>
            </div>
            <a :href="getFullUrl(incident.evidence_file)" target="_blank">
              <UiBaseButton variant="secondary" size="sm"
                class="!rounded-xl text-[10px] font-black uppercase tracking-widest">
                <IconExternalLink class="w-4 h-4 mr-2" /> Plein écran
              </UiBaseButton>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Viewer Modal -->
    <ModalGlobalImageViewer :show="viewer.show" :imageUrl="viewer.url" @close="viewer.show = false" />
  </div>
</template>

<script setup lang="ts">
import { IconChevronUp, IconChevronDown, IconZoomIn, IconFileTypePdf, IconExternalLink } from '@tabler/icons-vue'
import { decodeHtmlEntities } from '~/utils/format'
import { useVigiPrefStore } from '~/stores/front/vigiPref'

const props = defineProps<{
  incident: any
}>()

const prefStore = useVigiPrefStore()
const showEvidence = ref(prefStore.display.previewFile)

// React to preference changes
watch(() => prefStore.display.previewFile, (val) => {
  showEvidence.value = val
})
const viewer = ref({
  show: false,
  url: ''
})

const getFullUrl = (path: string) => {
  if (!path) return ''
  return `/evidence/${path}`
}

const isImage = (path: string) => {
  if (!path) return false
  const ext = path.split('.').pop()?.toLowerCase()
  return ['jpg', 'jpeg', 'png', 'webp', 'gif', 'jfif', 'pjpeg', 'pjp', 'avif', 'apng'].includes(ext || '')
}

const isPdf = (path: string) => {
  if (!path) return false
  return path.toLowerCase().endsWith('.pdf')
}

const openViewer = (url: string) => {
  viewer.value.url = url
  viewer.value.show = true
}
</script>
