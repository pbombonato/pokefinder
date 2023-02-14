<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import axios from "axios";

import PokemonHeader from "../components/PokemonHeader.vue";
import PokemonImage from "@/components/PokemonImage.vue";
import EvolutionsSectionVue from "@/components/EvolutionsSection.vue";
import StatsSection from "@/components/StatsSection.vue";
import TypesSection from "@/components/TypesSection.vue";

const loading = ref(true);

const props = defineProps<{ pokemonName: string }>();

function translatePokemonType(pokemonType: string): string {
  switch (pokemonType) {
    case "normal":
      return "Normal";
    case "fire":
      return "Fogo";
    case "water":
      return "Água";
    case "grass":
      return "Planta";
    case "flying":
      return "Voador";
    case "fighting":
      return "Lutador";
    case "poison":
      return "Venenoso";
    case "electric":
      return "Elétrico";
    case "ground":
      return "Terrestre";
    case "rock":
      return "Pedra";
    case "psychic":
      return "Psíquico";
    case "ice":
      return "Gelo";
    case "bug":
      return "Inseto";
    case "ghost":
      return "Fantasma";
    case "steel":
      return "Aço";
    case "dragon":
      return "Dragão";
    case "dark":
      return "Sombrio";
    case "fairy":
      return "Fada";
    default:
      return "Tipo desconhecido.";
  }
}

function formatPokemonName(pokemonName: string): string {
  return pokemonName.replace(/-/g, " ").toUpperCase();
}

type PokemonInfo = {
  readonly name: string;
  readonly id: number;
  readonly imgSrc: string;
  readonly stats: { base_stat: number; name: string }[];
  readonly types: string[];
  evolutions?: {
    url?: string;
  };
};

let pokemonInfo: PokemonInfo;

function getPokemonImage(pokemonInformation: {
  id: number;
  sprites: {
    front_default: string;
    other: { dream_world: { front_default: string | null } };
  };
}): string {
  const dreamWorldImage =
    pokemonInformation.sprites.other.dream_world.front_default;
  const defaultImage = pokemonInformation.sprites.front_default;

  if (dreamWorldImage !== null) {
    return dreamWorldImage;
  } else {
    return defaultImage;
  }
}

onBeforeMount(async function () {
  type PokemonType = { type: { name: string } };

  // define basic pokemon info
  await axios
    .get(`https://pokeapi.co/api/v2/pokemon/${props.pokemonName}`)
    .then((response) => response.data)
    .then((pokemonInfo): PokemonInfo => {
      return {
        name: pokemonInfo.name,
        id: pokemonInfo.id,
        imgSrc: getPokemonImage(pokemonInfo),
        stats: [
          { base_stat: pokemonInfo.stats[0].base_stat, name: "HP" },
          { base_stat: pokemonInfo.stats[1].base_stat, name: "Ataque" },
          { base_stat: pokemonInfo.stats[2].base_stat, name: "Defesa" },
          {
            base_stat: pokemonInfo.stats[3].base_stat,
            name: "Ataque especial",
          },
          {
            base_stat: pokemonInfo.stats[4].base_stat,
            name: "Defesa especial",
          },
          { base_stat: pokemonInfo.stats[5].base_stat, name: "Velocidade" },
        ],
        types: pokemonInfo.types.map((type: PokemonType): string =>
          translatePokemonType(type.type.name)
        ),
      };
    })
    .then(function (pokemonInformation: PokemonInfo): void {
      pokemonInfo = pokemonInformation;
    })
    .catch((error: string): void => {
      console.log(error);
      loading.value = false;
    });

  loading.value = false;
});
</script>

<template>
  <PokemonHeader />
  <div v-if="loading">Loading...</div>
  <main v-else role="main">
    <PokemonImage
      :pokemon-img-src="pokemonInfo.imgSrc"
      :pokemon-name="formatPokemonName(pokemonInfo.name)"
    />
    <section role="region" class="info" aria-labelledby="pokemon-name">
      <h1 id="pokemon-name">{{ formatPokemonName(pokemonInfo.name) }}</h1>
      <TypesSection :pokemon-types="pokemonInfo.types" />

      <StatsSection :pokemon-stats="pokemonInfo.stats" />

      <EvolutionsSectionVue :pokemon-id="pokemonInfo.id" />
    </section>
  </main>
</template>

<style scoped>
h1 {
  font-size: 2rem;
  line-height: 1;
}

main {
  min-height: 83vh;
  min-width: 95vw;
  width: 95vw;
  display: grid;
  margin: 0 auto;
  grid-template-areas: "img content";
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  padding: 3vh 0;
}

section {
  grid-area: "content";
  justify-self: center;
  width: 80%;
}

@media screen and (width <= 811px) {
  main {
    width: 100vw;
    display: flex;
    margin: 3vh 0 0;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0;
  }

  section {
    width: 80vw;
    margin: 5vh 0;
    text-align: center;
  }
}
</style>
