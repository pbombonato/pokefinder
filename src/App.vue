<template>
  <input type="text" v-model="input" placeholder="Pesquisar Pokémon..." />
  <div
    class="item fruit"
    v-for="(pokemon, index) in filteredList()"
    :key="index"
  >
    <p>{{ pokemon }}</p>
  </div>
  <div class="item error" v-if="input && !filteredList().length">
    <p>Nenhum Pokémon encontrado.</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

let input = ref("");
const pokemonArray = [
  "Pikachu",
  "Squirtle",
  "Bulbasaur",
  "Charmander",
  "Charizard",
  "Blastoise",
  "Ivysaur",
];

function filteredList() {
  return pokemonArray.filter((pokemon) =>
    pokemon.toLowerCase().includes(input.value.toLowerCase())
  );
}
</script>
