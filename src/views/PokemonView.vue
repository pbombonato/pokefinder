<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import axios from "axios";
import EvolutionsSectionVue from "@/components/EvolutionsSection.vue";
import PokemonHeader from "../components/PokemonHeader.vue";

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
        imgSrc: pokemonInfo.sprites.other.dream_world.front_default,
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
  <main role="main">
    <div v-if="loading">Loading...</div>
    <div v-else>
      <img
        class="pokemon-img"
        :src="pokemonInfo.imgSrc"
        :alt="`${pokemonInfo.name.toUpperCase()}'s image`"
      />
      <section role="region" class="info" aria-labelledby="pokemon-name">
        <div class="name">
          <h1 id="pokemon-name">{{ pokemonInfo.name.toUpperCase() }}</h1>
        </div>
        <div class="types-container">
          <h2>Tipo(s):</h2>
          <ul>
            <li
              class="type"
              v-for="(type, index) in pokemonInfo.types"
              :key="index"
            >
              {{ type }}
            </li>
          </ul>
        </div>

        <div class="stats-container">
          <h2>Estatísticas</h2>

          <table>
            <tr v-for="(stat, index) in pokemonInfo.stats" :key="index">
              <td class="stat-title">
                <b>{{ stat.name }}</b>
              </td>
              <td class="stat-value">{{ stat.base_stat }}</td>
            </tr>
          </table>
        </div>

        <EvolutionsSectionVue :pokemonId="pokemonInfo.id" />
      </section>
    </div>
  </main>
</template>

<style scoped>
h1 {
  font-size: 2rem;
}

h2 {
  font-size: 1.3rem;
}

li {
  list-style: none;
}

ul {
  padding-left: 0;
}

div {
  margin-top: 1rem;
}

main {
  min-height: 83vh;
  min-width: 95vw;
}

main > div {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.pokemon-img {
  align-self: center;
  width: 25rem;
  height: 25rem;
  margin-right: 10vw;
}

.types-container,
.types-container ul {
  display: flex;
  align-items: center;
}

.types-container li {
  padding-left: 1.5rem;
}

.stat-title {
  padding-right: 18rem;
}

table {
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
}

table .stat-value {
  text-align: end;
  padding-right: 0;
}

@media screen and (width <= 811px) {
  main > div {
    margin: 5vh 0;
    flex-direction: column;
    align-items: center;
  }

  .pokemon-img {
    width: 60vw;
    height: auto;
    margin-bottom: -6vh;
  }

  section {
    width: 80vw;
    margin: 5vh 0;
    text-align: center;
  }

  section > div {
    margin: 8vh 0;
  }

  .types-container h2 {
    display: none;
  }

  .types-container {
    padding: 0;
    display: flex;
    justify-content: center;
    margin-top: -7vh;
  }

  .types-container li {
    padding: 0 0.5rem;
  }
  table {
    width: 80vw;
  }
  .stat-title {
    padding-right: 0;
    text-align: left;
  }
}
</style>
