<script setup lang="ts">
import PokemonHeader from "../components/PokemonHeader.vue";

const pokemonInfo = {
  name: "rayquaza",
  stats: [
    { base_stat: 105, name: "hp" },
    { base_stat: 105, name: "attack" },
    { base_stat: 105, name: "defense" },
    { base_stat: 105, name: "special-attack" },
    { base_stat: 105, name: "special-defense" },
    { base_stat: 105, name: "speed" },
  ],
  types: ["dragon", "flying"],
  imgSrc:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/384.svg",
  evolutions: ["charizard", "rayquaza", "charmander"],
};
</script>

<template>
  <PokemonHeader />
  <main>
    <div>
      <img
        class="pokemon-img"
        :src="pokemonInfo.imgSrc"
        :alt="`${pokemonInfo.name}'s image`"
      />
      <section class="info">
        <div class="name">
          <h2>{{ pokemonInfo.name }}</h2>
        </div>
        <ul class="types-container">
          <li
            class="type"
            v-for="(type, index) in pokemonInfo.types"
            :key="index"
          >
            {{ type }}
          </li>
        </ul>
        <div class="stats"></div>
      </section>
    </div>
  </main>
</template>

<style scoped>
main {
  width: 100vw;
  height: 90vh;
}

main > div {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.pokemon-img {
  width: 15rem;
  height: 15rem;
}
</style>
