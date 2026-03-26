<template>
  <div class="space-y-8">
    <div v-if="sessions.length === 0"
      class="text-center py-12 text-hsa bg-ash/30 rounded-2xl border border-dashed border-ashAct">
      <IconHistory class="w-12 h-12 mx-auto mb-4 opacity-20" />
      <p>Aucune session active trouvée.</p>
    </div>

    <!-- Session Actuelle -->
    <section v-if="currentSession">
      <h2 class="text-sm font-semibold uppercase tracking-wider text-hsa mb-4 flex items-center gap-2">
        <IconShieldCheck class="w-4 h-4 text-success" /> Session actuelle
      </h2>
      <UiBaseCard class="border-l-4 border-l-success bg-success/5">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div class="flex items-start gap-4">
            <div class="p-4 bg-WtB rounded-2xl shadow-sm border border-ashAct">
              <component :is="getSessionIcon(currentSession)" class="w-8 h-8 text-primary" />
            </div>
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <h3 class="font-bold text-lg text-BtW">
                  {{ formatSessionLabel(currentSession) }}
                </h3>
                <span class="px-2 py-0.5 text-xs bg-success text-WtB rounded-full font-bold">ACTUELLE</span>
              </div>
              <p class="text-sm font-code text-hsa bg-ash px-2 py-0.5 rounded inline-block">
                {{ currentSession.ip_address }}
              </p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 pt-2">
                <p class="text-xs text-hsa flex items-center gap-1.5">
                  <IconPlus class="w-3.5 h-3.5" /> Créée le : {{ formatFullDate(currentSession.created_at) }}
                </p>
                <p class="text-xs text-hsa flex items-center gap-1.5">
                  <IconHistory class="w-3.5 h-3.5" /> Dernière activité : {{
                    formatDateDistance(currentSession.last_used_at)
                  }}
                </p>
                <p class="text-xs text-hsa flex items-center gap-1.5 font-medium">
                  <IconClock class="w-3.5 h-3.5" /> Expire le : {{ formatFullDate(currentSession.expires_at) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </UiBaseCard>
    </section>

    <!-- Autres Sessions -->
    <section v-if="otherSessions.length > 0">
      <h2 class="text-sm font-semibold uppercase tracking-wider text-hsa mb-4">Autres appareils connectés</h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <UiBaseCard v-for="session in otherSessions" :key="session.id"
          class="relative group border border-ash hover:border-primary/30 transition-all duration-300">
          <div class="flex items-start gap-4">
            <div class="p-3 bg-ash rounded-xl group-hover:bg-primary/10 transition-colors">
              <component :is="getSessionIcon(session)"
                class="w-6 h-6 text-hsa group-hover:text-primary transition-colors" />
            </div>
            <div class="flex-grow min-w-0">
              <h3 class="font-bold text-BtW truncate">
                {{ formatSessionLabel(session) }}
              </h3>
              <p class="text-xs font-code text-hsa mb-2">
                {{ session.ip_address }}
              </p>

              <div class="space-y-1">
                <p class="text-[10px] text-hsa uppercase font-semibold">Dernière activité</p>
                <p class="text-xs text-BtW">
                  Il y a {{ formatDateDistance(session.last_used_at) }}
                  <span class="text-hsa text-[10px]">({{ formatFullDate(session.last_used_at) }})</span>
                </p>
                <p class="text-[10px] text-hsa uppercase font-semibold pt-1">Expiration</p>
                <p class="text-xs text-BtW">{{ formatFullDate(session.expires_at) }}</p>
              </div>
            </div>

            <UiBaseButton @click="$emit('confirm-revoke', session.id)" variant="ghost"
              class="!absolute !top-4 !right-4 !p-2 !text-hsa hover:!text-danger hover:!bg-danger/10 !rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              title="Déconnecter cet appareil">
              <IconLogout class="w-5 h-5" />
            </UiBaseButton>
          </div>
        </UiBaseCard>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { IconShieldCheck, IconClock, IconHistory, IconPlus, IconLogout } from '@tabler/icons-vue'
import { format, formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { formatSessionLabel, getSessionIcon as getSessionIconRaw } from '~/utils/sessions'

const getSessionIcon = (session: any) => markRaw(getSessionIconRaw(session))

defineProps<{
  sessions: any[]
  currentSession?: any
  otherSessions: any[]
}>()

defineEmits(['confirm-revoke'])

// Helpers
const formatDateDistance = (dateString: string) => {
  if (!dateString) return ''
  return formatDistanceToNow(new Date(dateString), { locale: fr })
}

const formatFullDate = (dateString: string) => {
  if (!dateString) return ''
  return format(new Date(dateString), 'dd MMM yyyy à HH:mm', { locale: fr })
}
</script>
