<script setup lang="ts">
import HorizontalLogo from "@/assets/images/horizontal-logo.png";
import SearchBar from "./SearchBar.vue";
import { RouterLink } from "vue-router";
</script>

<template>
  <header role="banner">
    <RouterLink to="/">
      <img :src="HorizontalLogo" alt="Pokéfinder" />
    </RouterLink>
    <SearchBar :header="true" />
  </header>
</template>

<style scoped>
header {
  height: 10vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0 0 1vw;
}

img {
  width: 13vw;
  height: auto;
}

@media screen and (width < 811px) {
  img {
    display: none;
  }

  header {
    justify-content: center;
    padding: 0;
  }
}
</style>
