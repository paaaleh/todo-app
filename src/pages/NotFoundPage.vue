<template>
  <q-page class="flex flex-center">
    <div class="text-center">
      <div class="text-h1 text-grey-4 q-mb-md">404</div>
      <div class="text-h5 q-mb-sm">Страница не найдена</div>
      <div class="text-grey q-mb-lg">Запрошенная страница не существует</div>
      <q-btn
        color="primary"
        label="На главную"
        icon="home"
        unelevated
        :to="{ name: 'index' }"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
</script>
