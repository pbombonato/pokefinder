import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import PokemonView from "../views/PokemonView.vue";

// import { defineAsyncComponent } from "vue";
// const PokemonView = defineAsyncComponent(
// );

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/rayquaza",
      name: "pokemon",
      component: PokemonView,
    },
  ],
});

export default router;
