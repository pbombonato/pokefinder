<script setup lang="ts">
const props = defineProps<{ pokemonTypes: string[] }>();
</script>

<template>
  <div class="types-container">
    <h2>Tipo(s):</h2>
    <ul>
      <li class="type" v-for="(type, index) in props.pokemonTypes" :key="index">
        {{ type }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
h2 {
  font-size: 1.3rem;
  margin-right: 1rem;
}

li {
  list-style: none;
}

ul {
  padding-left: 0;
}

.types-container {
  margin-top: 0.5rem;
}

.types-container,
.types-container ul {
  display: flex;
  align-items: center;
}

.types-container li {
  padding-right: 1rem;
}

@media screen and (width <= 811px) {
  div {
    margin: 8vh 0;
  }

  .types-container h2 {
    display: none;
  }

  .types-container {
    padding: 0;
    display: flex;
    justify-content: center;
  }

  .types-container li {
    padding: 0 0.5rem;
  }
}
</style>
