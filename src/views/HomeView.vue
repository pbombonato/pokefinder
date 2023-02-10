<script setup lang="ts">
import SearchBar from "@/components/SearchBar.vue";
import Logo from "../assets/images/vertical-logo.png";
</script>

<template>
  <body>
    <main>
      <img id="logo" :src="Logo" alt="PokéFinder logo" />
      <SearchBar />
    </main>
  </body>
</template>

<style scoped>
body {
  min-height: 100vh;
  min-width: 100vw;
  background-color: var(--color-background);
}

main {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#logo {
  height: var(--logo-size);
  width: var(--logo-size);
}
</style>
