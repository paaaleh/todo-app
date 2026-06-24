<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useSeoMeta } from './composables/useSeoMeta'
import { measureWebVitals, logMetric } from './utils/monitoring'
import { useUiStore } from './stores'

const uiStore = useUiStore()

useSeoMeta()

onMounted(() => {
  uiStore.initTheme()
  measureWebVitals(logMetric)
})
</script>
