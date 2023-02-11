<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import axios from "axios";
import LRU from "lru-cache";

import SymbolLogo from "@/assets/images/symbol-logo.png";

const input = ref("");
const inputActive = ref(false);

let pokemonList: string[] = [];

const cache = new LRU<string, string[]>({
  max: 2,
  ttl: 1000 * 60 * 60,
}); // 1 hour cache

// construir array de pokemons a partir da API (ou do cache) antes do componente ser montado
onBeforeMount(() => {
  if (cache.has("pokemonList")) {
    const cachedList = cache.get("pokemonList") as string[];
    if (cachedList.length) {
      pokemonList = cachedList;
    }
  }
  if (pokemonList.length === 0) {
    axios
      .get("https://pokeapi.co/api/v2/pokemon/?limit=1279")
      .then((response) => response.data.results)
      .then((pokemons) =>
        pokemons.map((pokemon: { name: string }) =>
          pokemon.name.replace(/-/g, " ")
        )
      )
      .then((pokemons) => {
        pokemonList = [...pokemons];
        cache.set("pokemonList", pokemonList);
      })
      .catch((error) => {
        console.error(error);
      });
  }
});

function filteredList() {
  return pokemonList
    .filter((pokemon: string) =>
      pokemon.toLowerCase().startsWith(input.value.toLowerCase())
    )
    .map((pokemon: string) => {
      function formattedString(pokemonName: string): string {
        const separatedString: string =
          input.value.toLowerCase() +
          pokemonName
            .toLowerCase()
            .replace(input.value.toLowerCase(), "")
            .bold();

        function capitalFirstLetter(eachPokemonName: string) {
          return (
            eachPokemonName.charAt(0).toUpperCase() + eachPokemonName.slice(1)
          );
        }

        const result = separatedString
          .split(" ")
          .map((eachPokemonName: string) => capitalFirstLetter(eachPokemonName))
          .join(" ");

        return result;
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
  border-radius: var(--searchbar-border-radius);
  background-color: var(--searchbar-bg-color);
}

.container:hover,
.container.active {
  box-shadow: 0 1px 6px #20212447;
}

.input-container {
  width: 100%;
  height: 3.5rem;
  border-radius: var(--searchbar-border-radius);
  display: flex;
  border: 1px solid var(--color-border);
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
  font-size: 1rem;
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
  padding: 0.7rem 0 1.3rem;
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
  padding-top: 1.3rem;
}

@media screen and (width <= 768px) {
  .container {
    width: 85vw;
  }
}
</style>
