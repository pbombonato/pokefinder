<script setup lang="ts">
type Stat = { base_stat: number; name: string };

const props = defineProps<{ pokemonStats: Stat[] }>();
</script>

<template>
  <div class="stats-container">
    <h2>Estatísticas</h2>

    <table>
      <tr v-for="(stat, index) in props.pokemonStats" :key="index">
        <td class="stat-title">
          <b>{{ stat.name }}</b>
        </td>
        <td class="stat-value">{{ stat.base_stat }}</td>
      </tr>
    </table>
  </div>
</template>

<style scoped>
h2 {
  font-size: 1.3rem;
  margin-top: 1.5rem;
}

table {
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  width: 100%;
}

table .stat-value {
  text-align: end;
}

@media screen and (width <= 811px) {
  table {
    width: 80vw;
  }
  .stat-title {
    text-align: left;
  }

  div {
    margin: 8vh 0;
  }
}
</style>
