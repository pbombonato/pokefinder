<script setup lang="ts">
import SymbolLogo from "@/assets/images/symbol-logo.png";
import { ref } from "vue";

let input = ref("");
let inputActive = ref(false);

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
  <div class="container" :class="{ active: inputActive }">
    <div class="input-container">
      <span
        class="symbol-logo"
        :style="{ backgroundImage: `url(${SymbolLogo})` }"
      ></span>
      <input
        type="text"
        v-model="input"
        placeholder="Pesquisar Pokémon..."
        @focus="inputActive = true"
        @blur="inputActive = false"
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

.input-container {
  width: 100%;
  height: 3rem;
  border-radius: var(--searchbar-border-radius);
  display: flex;
  border: 1px solid;
}

.container.active > .input-container {
  border-radius: 0;
  border-top-left-radius: var(--searchbar-border-radius);
  border-top-right-radius: var(--searchbar-border-radius);
  border-bottom: transparent;
}

.symbol-logo {
  margin: 0 0.5rem;
  width: 2.2rem;
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
  border-top-right-radius: var(--searchbar-border-radius);
  border-bottom-right-radius: var(--searchbar-border-radius);
}

.container.active > .input-container > input {
  border-bottom-right-radius: 0;
}

.result-container {
  width: 100%;
  padding: 0;
  border: 1px solid;
  border-top: none;
  border-bottom-left-radius: var(--searchbar-border-radius);
  border-bottom-right-radius: var(--searchbar-border-radius);
  padding: 0 0 1.3rem;
  display: none;
}

.container.active .result-container {
  display: block;
}

.result {
  width: 100%;
  list-style: none;
  padding: 0.4rem 0 0.4rem 3.2rem;
}

.result:hover {
  background-color: var(--color-background-mute);
}

@media screen and (width <= 768px) {
  .container {
    width: 85vw;
  }
}
</style>
