<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import axios from "axios";
import { RouterLink } from "vue-router";
import PokemonHeader from "../components/PokemonHeader.vue";

let loading = ref(true);

const props = defineProps<{ pokemonName?: string }>();

function capitalFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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

const getEvolutionChain = async (url: string): Promise<string[]> => {
  const result = await axios.get(url);
  const { data } = result;

  const evolutionChain: Array<string> = [data.chain.species.name];
  const retrieveNames = (evolvesToArray: Array<any>) => {
    evolvesToArray.forEach(async (item) => {
      evolutionChain.push(item.species.name);
      if (item.evolves_to.length > 0) {
        retrieveNames(item.evolves_to);
      }
    });
  };
  retrieveNames(data.chain.evolves_to);

  return evolutionChain;
};

let pokemonInfo: {
  name: string;
  id: number;
  imgSrc: string;
  stats: { base_stat: number; name: string }[];
  types: string[];
  evolutions: { url: string; names: string[]; images: string[] };
};

onBeforeMount(async function () {
  await axios
    .get(`https://pokeapi.co/api/v2/pokemon/${props.pokemonName}`)
    .then((response) => response.data)
    .then((pokemonInfo) => {
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
        types: pokemonInfo.types.map((type: { type: { name: string } }) =>
          translatePokemonType(type.type.name)
        ),
        evolutions: { url: "unknown", names: ["unknown"], images: [] },
      };
    })
    .then(async (pokemonInfo) => {
      await axios
        .get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonInfo.id}`)
        .then((response) => response.data.evolution_chain.url)
        .then((url) => {
          pokemonInfo.evolutions.url = url;
        });
      return pokemonInfo;
    })
    .then(function (pokemonInformation: {
      name: string;
      id: number;
      imgSrc: string;
      stats: { base_stat: number; name: string }[];
      types: string[];
      evolutions: { url: string; names: string[]; images: string[] };
    }): void {
      pokemonInfo = pokemonInformation;
    })
    .catch((error: string) => {
      console.log(error);
      loading.value = false;
    });

  await axios
    .get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonInfo.id}/`)
    .then((response) => response.data.evolution_chain.url)
    .then((url) => {
      pokemonInfo.evolutions.url = url;
    })
    .catch((err) => {
      console.log(err);
      loading.value = false;
    });

  await getEvolutionChain(pokemonInfo.evolutions.url)
    .then((evolutionChain) => {
      pokemonInfo.evolutions.names = evolutionChain;
    })
    .catch((err) => {
      console.log(err);
      loading.value = false;
    });

  await Promise.all(
    pokemonInfo.evolutions.names.map(async (evolution) => {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${evolution}`
      );
      const image = response.data.sprites.other.dream_world.front_default;
      pokemonInfo.evolutions.images.push(image);
      console.log(pokemonInfo.evolutions.images);
    })
  );

  loading.value = false;
});
</script>

<template>
  <PokemonHeader />
  <main>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <img
        class="pokemon-img"
        :src="pokemonInfo.imgSrc"
        :alt="`${pokemonInfo.name.toUpperCase()}'s image`"
      />
      <section class="info">
        <div class="name">
          <h1>{{ pokemonInfo.name.toUpperCase() }}</h1>
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
        <div class="evolutions-container">
          <h2>Evoluções</h2><br />
          <ul>
            <li
              v-for="(evolution, index) in pokemonInfo.evolutions.names"
              :key="index"
            >
              <RouterLink :to="'/' + evolution">
                <img
                  :src="pokemonInfo.evolutions.images[index]"
                  :alt="evolution"
                  class="evolution-img"
                />
                <br />
                {{ capitalFirstLetter(evolution) }}
              </RouterLink>
            </li>
          </ul>
        </div>
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
  width: 100%;
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

.evolutions-container > ul {
  display: flex;
  justify-content: space-around;
  width: 29rem;
}

.evolutions-container li {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
}

a {
  text-decoration: none;
  color: #000;
  text-align: center;
  font-weight: bold;
}

.evolution-img {
  width: 6rem;
  height: 6rem;
  margin: 2rem 0 0;
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
    padding-right:0;
    text-align: left;
  }

  .evolutions-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .evolutions-container > ul {
    margin-top: 2vh;
    display: flex;
    flex-direction: column;
    width: 100%
  }

  .evolutions-container li {
    margin: 3vh 0;
  }

  .evolution-img {
    width: 70%;
    height: auto;
  }
}
</style>
