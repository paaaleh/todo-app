<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useSeoMeta } from './composables/useSeoMeta'
import { measureWebVitals, logMetric } from './utils/monitoring'

useSeoMeta()

onMounted(() => {
  measureWebVitals(logMetric)
})
</script>
