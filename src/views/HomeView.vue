<script setup lang="ts">
import SearchBar from "@/components/SearchBar.vue";
import Logo from "../assets/images/vertical-logo.png";
</script>

<template>
  <main role="main" aria-labelledby="main-title">
    <div>
      <img id="logo" :src="Logo" alt="PokéFinder logo" />
      <SearchBar />
    </div>
  </main>
</template>

<style scoped>
main {
  min-height: 95vh;
  min-width: 95vw;
  background-color: var(--color-background);
}

main > div {
  height: 100%;
  width: 100%;
  padding-top: 10vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#logo {
  height: var(--logo-size);
  width: var(--logo-size);
  margin-bottom: 1rem;
}
</style>
