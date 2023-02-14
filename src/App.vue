<script setup lang="ts">
import { RouterView } from "vue-router";
import PokemonFooter from "./components/PokemonFooter.vue";
</script>

<template>
  <div class="page">
    <RouterView :key="$route.path" />
    <PokemonFooter />
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
