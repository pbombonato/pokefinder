<script setup lang="ts">
import SymbolLogo from "@/assets/images/symbol-logo.png";
import { ref } from "vue";

let input = ref("");
const pokemonArray: string[] = [
  "Pikachu",
  "Squirtle",
  "Bulbasaur",
  "Charmander",
  "Charizard",
  "Blastoise",
  "Ivysaur",
];

function filteredList() {
  return pokemonArray
    .filter((pokemon: string) =>
      pokemon.toLowerCase().includes(input.value.toLowerCase())
    )
    .filter((filteredPokemon, index: number) => index < 5);
}
</script>

<template>
  <div class="container active">
    <div class="input-container">
      <span
        class="symbol-logo"
        :style="{ backgroundImage: `url(${SymbolLogo})` }"
      ></span>
      <input
        type="text"
        v-model="input"
        placeholder="Pesquisar Pokémon..."
        autofocus
      />
    </div>
    <ul class="result-container">
      <li
        class="result"
        v-for="(pokemon, index) in filteredList()"
        :key="index"
      >
        <p>{{ pokemon }}</p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.container {
  width: var(--searchbar-width);
  margin-top: 3rem;
}

.container.active > .input-container {
  border-radius: 0;
  border-top-left-radius: 2rem;
  border-top-right-radius: 2rem;
}

.container .active > .input-container > input {
  border-bottom-left-radius: 0;
}

.input-container {
  width: 100%;
  height: 3rem;
  border-radius: 2rem;
  display: flex;
  border: 1px solid;
}

.symbol-logo {
  margin: 0 1rem;
  width: 1.7rem;
  height: 100%;
  display: block;
  background: url("../assets/images/symbol-logo.png") no-repeat center;
  background-size: 1.7rem;
  opacity: 0.8;
}

input {
  width: 100%;
  border: none;
  outline: none;
  border-top-right-radius: 2rem;
  border-bottom-right-radius: 2rem;
}

.result-container {
  width: 100%;
  padding: 0;
  background-color: green;
}

.result {
  width: 100%;
  background-color: blue;
  list-style: none;
}
</style>
