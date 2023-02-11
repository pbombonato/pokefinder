<script setup lang="ts">
import { RouterView } from "vue-router";
import PokemonFooter from "./components/PokemonFooter.vue";
</script>

<template>
  <RouterView :key="$route.path" />
  <PokemonFooter />
</template>
