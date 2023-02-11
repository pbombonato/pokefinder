<script setup lang="ts">
import HorizontalLogo from "@/assets/images/horizontal-logo.png";
import SearchBar from "./SearchBar.vue";
</script>

<template>
  <header>
    <img :src="HorizontalLogo" alt="" />
    <SearchBar :pokemon-page="true" />
  </header>
</template>

<style scoped>
header {
  height: 10vh;
  width: 100%;
  /* background-color: white; */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
}

img {
  width: auto;
  height: 7vh;
}
</style>
