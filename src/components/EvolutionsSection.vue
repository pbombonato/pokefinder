<script setup lang="ts">
import { RouterLink } from "vue-router";
import { onBeforeMount, ref } from "vue";
import axios from "axios";

let loading = ref(true);

const props = defineProps<{ pokemonId: number }>();

type EvolutionsInfo = {
  url?: string;
  readonly names: string[];
  readonly images: string[];
};

const evolutionsInfo: EvolutionsInfo = {
  names: [],
  images: [],
};

function capitalFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getEvolutionChain = async (url: string): Promise<string[]> => {
  const result = await axios.get(url);
  const { data } = result;

  const evolutionChain: string[] = [data.chain.species.name];

  type Evolution = {
    evolution_details: any[];
    evolves_to: Evolution[] | never[];
    is_baby: boolean;
    species: { name: string; url: string };
  };

  const retrieveNames = (evolvesToArray: Evolution[] | never[]): void => {
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

async function getPokemonSpeciesUrl(pokemonId: number): Promise<string> {
  const speciesUrl = await axios
    .get("https://pokeapi.co/api/v2/pokemon/" + pokemonId)
    .then((response) => response.data.species.url)
    .catch(console.log);

  return speciesUrl;
}

const getPokemonEvolutionInfo = async (
  pokemonId: number
): Promise<EvolutionsInfo> => {
  const speciesUrl = await getPokemonSpeciesUrl(pokemonId);

  return new Promise((resolve, reject) => {
    axios
      .get(speciesUrl)
      .then((response) => response.data.evolution_chain.url)
      .then((url) => {
        evolutionsInfo.url = url;
      })
      .then(() => {
        if (evolutionsInfo.url) {
          return getEvolutionChain(evolutionsInfo.url).then(
            (evolutionChain) => {
              evolutionsInfo.names.push(...evolutionChain);
            }
          );
        }
      })
      .then(() => {
        if (evolutionsInfo.names.length > 0) {
          return Promise.all(
            evolutionsInfo.names.map((evolution: string, index: number) =>
              axios
                .get(`https://pokeapi.co/api/v2/pokemon/${evolution}`)
                .then((response) => {
                  evolutionsInfo.images[index] =
                    response.data.sprites.front_default;
                })
            )
          );
        }
      })
      .then(() => {
        resolve(evolutionsInfo);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
onBeforeMount(async function (): Promise<void> {
  await getPokemonEvolutionInfo(props.pokemonId);
  loading.value = false;
});
</script>

<template>
  <div v-if="!loading" class="evolutions-container">
    <h2>Evoluções</h2>
    <ul>
      <li v-for="(evolution, index) in evolutionsInfo.names" :key="index">
        <RouterLink :to="'/' + evolution">
          <img
            :src="evolutionsInfo.images[index]"
            :alt="evolution"
            class="evolution-img"
          />
          <p>{{ capitalFirstLetter(evolution) }}</p>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
h2 {
  font-size: 1.3rem;
  margin-top: 1.5rem;
}

.evolutions-container > ul {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  justify-content: start;
  width: 100%;
  padding: 0;
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
  width: 100%;
}

.evolution-img {
  width: 100%;
  height: auto;
}

@media screen and (width <= 811px) {
  .evolutions-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .evolutions-container > ul {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .evolutions-container li {
    margin: 1vh 0;
  }

  .evolution-img {
    width: 70%;
    height: auto;
  }
}
</style>
