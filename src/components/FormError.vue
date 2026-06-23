<template>
  <transition name="form-error">
    <div v-if="message" class="text-negative text-caption q-mt-xs row items-center q-gutter-xs">
      <q-icon name="error_outline" size="14px" />
      <span>{{ message }}</span>
    </div>
  </transition>
</template>

<script setup lang="ts">
defineProps<{
  message: string | null | undefined
}>()
</script>

<style scoped>
.form-error-enter-active,
.form-error-leave-active {
  transition: all 0.2s ease;
}
.form-error-enter-from,
.form-error-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
