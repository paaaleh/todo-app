<template>
  <q-breadcrumbs class="q-mb-md text-grey-6">
    <q-breadcrumbs-el
      v-for="(crumb, index) in breadcrumbs"
      :key="index"
      :label="crumb.label"
      :to="crumb.to"
      :class="crumb.to ? 'text-primary cursor-pointer' : 'text-grey-8'"
    />
  </q-breadcrumbs>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { BreadcrumbItem } from '../types'

const route = useRoute()

const breadcrumbs = computed<BreadcrumbItem[]>(() => route.meta.breadcrumbs ?? [])
</script>
