<script setup lang="ts">
import SymbolLogo from "@/assets/images/symbol-logo.png";
import { ref } from "vue";

let input = ref("");
let inputActive = ref(false);

// montar array a partir da API assim que o componente for montado
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
      pokemon.toLowerCase().startsWith(input.value.toLowerCase())
    )
    .map((pokemon: string) => {
      function formattedString(string: string): string {
        const separatedString: string =
          input.value.toLowerCase() +
          string.toLowerCase().replace(input.value.toLowerCase(), "").bold();
        return (
          separatedString.charAt(0).toUpperCase() + separatedString.slice(1)
        );
      }

      return input.value ? formattedString(pokemon) : pokemon;
    })
    .filter((pokemon, index: number) => index < 6);
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
        @input="inputActive = input ? true : false"
        @blur="!input ? (inputActive = false) : ''"
        autofocus
      />
    </div>
    <ul class="result-container">
      <li
        class="result"
        v-for="(pokemon, index) in filteredList()"
        :key="index"
        v-html="pokemon"
      ></li>
      <li class="result error" v-if="!filteredList().length">
        Nenhum Pokémon encontrado.
      </li>
    </ul>
  </div>
</template>

<style scoped>
.container {
  width: var(--searchbar-width);
  margin-top: 3rem;
  border-radius: var(--searchbar-border-radius);
}

.input-container {
  width: 100%;
  height: 3rem;
  border-radius: var(--searchbar-border-radius);
  display: flex;
  border: 1px solid var(--color-border);
}

.container:hover {
  box-shadow: 0 1px 6px #20212447;
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
  border: 1px solid var(--color-border);
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
  cursor: default;
}

.result:hover:not(.error) {
  background-color: var(--color-background-mute);
}

.error {
  text-align: center;
}

@media screen and (width <= 768px) {
  .container {
    width: 85vw;
  }
}
</style>
