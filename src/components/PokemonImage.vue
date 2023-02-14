<script setup lang="ts">
const props = defineProps<{ pokemonName: string; pokemonImgSrc: string }>();
</script>

<template>
  <img
    class="pokemon-img"
    :src="props.pokemonImgSrc"
    :alt="`${props.pokemonName}'s image`"
  />
</template>

<style scoped>
.pokemon-img {
  grid-area: "img";
  justify-self: center;
  height: auto;
  width: 80%;
}

@media screen and (width <= 811px) {
  .pokemon-img {
    width: 80%;
    height: auto;
  }
}
</style>
