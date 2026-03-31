<template>
  <UiBaseCard title="Méthodes d'authentification">
    <div class="space-y-4">
      <!-- Loading State -->
      <template v-if="loading">
        <div v-for="i in 3" :key="i" class="p-4 rounded-2xl border border-ashAct bg-WtAct/10">
          <div class="flex items-center gap-4">
            <UiAppSkeleton width="48px" height="48px" radius="12px" />
            <div class="space-y-2 flex-1">
              <UiAppSkeleton width="120px" height="16px" />
              <UiAppSkeleton width="200px" height="12px" />
            </div>
          </div>
        </div>
      </template>

      <!-- Methods List -->
      <template v-else>
        <div v-for="method in methods" :key="method.method"
          class="p-4 rounded-2xl border transition-all duration-300 group" :class="[
            method.is_default ? 'border-primary/50 bg-primary/5 shadow-lg shadow-primary/5' : 'border-ashAct bg-WtAct/30 hover:bg-WtAct/50'
          ]">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div :class="[
                'p-3 rounded-xl transition-colors duration-300',
                method.is_enabled ? getMfaMethodInfo(method.method).bg + ' ' + getMfaMethodInfo(method.method).color : 'bg-ash text-hsa'
              ]">
                <component :is="getMfaMethodInfo(method.method).icon" class="w-6 h-6" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h4 class="font-bold text-BtW">{{ method.label }}</h4>
                  <UiAppTooltip :content="getMfaMethodInfo(method.method).recommendation"
                    :title="getMfaMethodInfo(method.method).label" />
                  <span v-if="method.is_default"
                    class="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                    Défaut
                  </span>
                </div>
                <p class="text-xs text-hsa mt-0.5">{{ getMfaMethodInfo(method.method).description }}</p>
              </div>
            </div>

            <div
              class="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 border-t sm:border-t-0 border-ash/10 pt-3 sm:pt-0">

              <!-- Set Default Action -->
              <div v-if="method.is_enabled && !method.is_default" class="flex items-center">
                <UiBaseButton variant="ghost" size="sm"
                  class="!text-success hover:!bg-success/10 !rounded-xl font-bold !py-1.5 h-auto text-[10px] uppercase tracking-wider relative overflow-hidden"
                  :disabled="updatingMethod === method.method" @click="$emit('set-default', method.method)">
                  <template v-if="updatingMethod === method.method">
                    <UiLogoLoader size="xs" color="text-success" class="mr-1" />
                    En cours...
                  </template>
                  <template v-else>
                    <IconStar class="w-3.5 h-3.5 mr-1" />
                    Définir
                  </template>
                </UiBaseButton>
              </div>

              <!-- Backup Codes Action -->
              <div v-if="method.method === 'security_code'" class="flex items-center gap-2">
                <UiBaseButton variant="ghost" size="sm"
                  class="!bg-warning/10 !text-warning hover:!bg-warning/20 !rounded-xl font-bold !py-1.5 h-auto text-[10px] uppercase tracking-wider"
                  @click="$emit('verify-backup-codes')">
                  <IconEye class="w-3.5 h-3.5 mr-1" />
                  Gérer
                </UiBaseButton>
              </div>

              <!-- Authenticator Action -->
              <div v-if="method.method === 'authenticator' && !method.is_enabled" class="flex items-center gap-2">
                <UiBaseButton variant="ghost" size="sm"
                  class="!bg-primary/10 !text-primary hover:!bg-primary/20 !rounded-xl font-bold !py-1.5 h-auto text-[10px] uppercase tracking-wider"
                  @click="$emit('setup-authenticator')">
                  <IconSettings class="w-3.5 h-3.5 mr-1" />
                  Configurer
                </UiBaseButton>
              </div>

              <!-- Passkey Action -->
              <div v-if="method.method === 'passkey' && !method.is_enabled" class="flex items-center gap-2">
                <UiBaseButton variant="ghost" size="sm"
                  class="!bg-primary/10 !text-primary hover:!bg-primary/20 !rounded-xl font-bold !py-1.5 h-auto text-[10px] uppercase tracking-wider"
                  @click="$emit('setup-passkey')">
                  <IconFingerprint class="w-3.5 h-3.5 mr-1" />
                  Configurer
                </UiBaseButton>
              </div>

              <div class="flex items-center gap-4">
                <!-- Reset Action (if applicable) -->
                <button
                  v-if="['authenticator', 'passkey', 'security_code'].includes(method.method) && method.is_enabled"
                  class="p-2 text-hsa hover:text-danger hover:bg-danger/10 rounded-xl transition-all"
                  title="Réinitialiser la méthode" :disabled="updatingMethod === method.method"
                  @click="$emit('toggle-method', method.method, 'reset')">
                  <IconRotateClockwise2 class="w-4 h-4" />
                </button>

                <!-- Toggle Switch -->
                <div class="flex items-center gap-3">
                  <div v-if="updatingMethod === method.method" class="w-10 flex justify-center">
                    <UiLogoLoader size="xs" />
                  </div>
                  <label v-else-if="method.method !== 'totp'" class="relative inline-flex items-center"
                    :class="['authenticator', 'passkey'].includes(method.method) && !method.is_enabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'">
                    <input type="checkbox" :checked="method.is_enabled"
                      @change="(e) => $emit('toggle-method', method.method, (e.target as HTMLInputElement).checked ? 'enable' : 'disable')"
                      class="sr-only peer"
                      :disabled="updatingMethod === method.method || (['authenticator', 'passkey'].includes(method.method) && !method.is_enabled)">
                    <div class="input-toggle-slider"></div>
                  </label>

                  <div v-else class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                    <span class="text-[10px] font-bold uppercase tracking-widest text-success">Actif</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State if no methods -->
        <div v-if="!methods?.length" class="text-center py-12 opacity-60">
          <IconLockOff class="w-12 h-12 mx-auto mb-4 text-hsa/30" />
          <p class="text-hsa font-medium">Aucune méthode configurée</p>
        </div>
      </template>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconEye, IconLockOff, IconStar, IconSettings, IconFingerprint, IconRotateClockwise2 } from '@tabler/icons-vue'
import { getMfaMethodInfo } from '~/utils/mfa'

defineProps<{
  methods: any[],
  loading?: boolean,
  updatingMethod?: string | null
}>()

defineEmits(['verify-backup-codes', 'set-default', 'setup-authenticator', 'setup-passkey', 'toggle-method'])
</script>
