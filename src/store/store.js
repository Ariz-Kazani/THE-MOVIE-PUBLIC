import { defineStore } from 'pinia'
import { watch, ref } from 'vue';

export const useUserCart = defineStore("moviesInCart", {
  state: () => ({
    cart: new Map(),
  }),
});

export const useUserMovies = defineStore("ownedMovies", () =>{
  const myMovies = ref([]);

  // if (localStorage.getItem("myMovies")) {
  //   myMovies.value = JSON.parse(localStorage.getItem("myMovies"))
  // }

  // watch(
  //   myMovies, (myMoviesVal) => {
  //     localStorage.setItem("myMovies", JSON.stringify(myMoviesVal))
  //   },
  //   { deep: true }
  // );

  return { myMovies };
})

export const useUserToken = defineStore("userToken", () => {
  const token = ref({ userToken: "" });

  if (localStorage.getItem("token")) {
    token.value = JSON.parse(localStorage.getItem("token"))
  }

  watch(
    token, (tokenVal) => {
      localStorage.setItem("token", JSON.stringify(tokenVal))
    },
    { deep: true }
  );
  return { token };
});