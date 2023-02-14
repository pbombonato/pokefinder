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

const getPokemonEvolutionInfo = (pokemonId: number): Promise<EvolutionsInfo> =>
  new Promise((resolve, reject) => {
    axios
      .get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`)
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

onBeforeMount(async function (): Promise<void> {
  await getPokemonEvolutionInfo(props.pokemonId);
  loading.value = false;
});
</script>

<template>
  <div v-if="!loading" class="evolutions-container">
    <h2>Evoluções</h2>
    <br />
    <ul>
      <li v-for="(evolution, index) in evolutionsInfo.names" :key="index">
        <RouterLink :to="'/' + evolution">
          <img
            :src="evolutionsInfo.images[index]"
            :alt="evolution"
            class="evolution-img"
          />
          <br />
          {{ capitalFirstLetter(evolution) }}
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
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
    width: 100%;
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