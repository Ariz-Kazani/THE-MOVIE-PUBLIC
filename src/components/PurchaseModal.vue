<script setup>
import { ref } from 'vue';
import { useUserCart, useUserToken, useUserMovies } from '../store/store';
import router from '../router/index.js'
import { firestore } from "../firebase/index";
import { doc, setDoc } from "firebase/firestore";


const cart = ref(useUserCart());
const userToken = useUserToken();
const userMovies = useUserMovies();
const emits = defineEmits(['toggleModal']);
const posters = ref([]);
let movieIDS = []
const postI = ref([-1, 0, 1]);
const isBuy = ref(true)

for (let [key, val] of cart.value.cart) {
  posters.value.push(val.poster);
  movieIDS.push(key)
  
}

async function buy() {
  isBuy.value = false;
  userMovies.myMovies = userMovies.myMovies.concat(movieIDS)
  await setDoc(doc(firestore, "movies",userToken.token.userToken), {
    movies: userMovies.myMovies,
  });
  cart.value.cart = new Map()
  router.push('shop');
}

function nextPoster() {
  for (let i = 0; i < postI.value.length; i++) {
    if (postI.value[i] <= 0) {
      postI.value[i] = posters.value.length - 1
    } else {
      postI.value[i] -= 1
    }
  }
}

function prevPoster() {
  for (let i = 0; i < postI.value.length; i++) {
    if (postI.value[i] + 2 > posters.value.length) {
      postI.value[i] = 0
    } else {
      postI.value[i] += 1
    }
  }
}

prevPoster()
</script>

<template>
  <Teleport to="body">
    <div class="background" @click.self="emits('toggleModal')">
      <div class="purchse-mod-con">
        <button id="exit-but" @click="emits('toggleModal')">x</button>
        <p id="title">Purchase</p>
        <p id="tot-items">Total Items: {{ cart.cart.size }}</p>
        <p id="tot-cost">Cost: $0</p>
        <div id="poster-con">
          <img id="movie-post" :src="('https://image.tmdb.org/t/p/w500' + posters[postI[1]])" alt="">
          <div id="img-one-holder" v-if="posters.length > 1">
            <img id="movie-post-one" :src="('https://image.tmdb.org/t/p/w500' + posters[postI[0]])" @click="prevPoster()" alt="">
          </div>
          <div id="img-two-holder" v-if="posters.length > 1">
            <img id="movie-post-two" :src="('https://image.tmdb.org/t/p/w500' + posters[postI[2]])" @click="nextPoster()" alt="">
          </div>
          <div class="button-con" v-if="posters.length > 1">
            <p id="prev-but" @click="prevPoster()">&#60;</p>
            <p id="next-but" @click="nextPoster()">&#62;</p>
          </div>
        </div>
        <button v-if="isBuy" id="purchase-but" @click="buy()">Purchase</button>

      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.background {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.9);
}

.background .purchse-mod-con {
  background-color: rgb(35, 35, 35);
  margin-left: calc(50vw - 400px);
  margin-top: calc(50vh - 250px);
  height: 500px;
  width: 800px;
  display: grid;
  grid-template-columns: 40px 150px 40px 1fr 200px 1fr 40px;
  grid-template-rows: 40px 40px 30px 30px 200px 40px 1fr 40px 40px;
}


.background .purchse-mod-con #title {
  font-size: 30px;
  grid-column: 2;
  grid-row: 2;
}

.background .purchse-mod-con #tot-items {
  font-size: 20px;
  grid-column: 2;
  grid-row: 3;
}

.background .purchse-mod-con #tot-cost {
  font-size: 20px;
  grid-column: 2;
  grid-row: 4;
}

.background .purchse-mod-con #purchase-but {
  font-size: 20px;
  grid-column: 2;
  grid-row: 8;
}

.background .purchse-mod-con #poster-con {
  grid-column: 4/span 3;
  grid-row: 2/span 7;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 75px 200px 75px 1fr;
  grid-template-rows: 40px 50px 1fr 40px 40px;
}

.background .purchse-mod-con #poster-con #movie-post {
  width: 200px;
  height: 300px;
  grid-column: 3;
  grid-row: 2/ span 2;
  /* filter: blur(2px); */
}

#img-one-holder {
  background-color: black;
  grid-row: 3;
  grid-column: 2;
  height: 200px;
  overflow: hidden;
}

#movie-post-one {
  height: 200px;
  aspect-ratio: 2/3;
  opacity: 30%;
}

#img-two-holder {
  background-color: black;
  grid-row: 3;
  grid-column: 4;
  height: 200px;
  overflow: hidden;
  display: flex;
  justify-content: flex-end;
}

#movie-post-two {
  height: 200px;
  aspect-ratio: 2/3;
  opacity: 30%;
}

.background .purchse-mod-con .button-con {
  width: 200px;
  grid-column: 3;
  grid-row: 5;
  display: flex;
  justify-content: center;
  gap: 10px
}

.background .purchse-mod-con .button-con #prev-but,
#next-but {
  width: 40px;
  text-align: center;
  font-size: 27px;
  cursor: pointer;
}

#exit-but {
  grid-column: 7;
  grid-row: 1;
  background-color: transparent;
  border-color: transparent;
  font-size: 1rem;
}

#exit-but:hover {
  color: red;
  border-color: red;
}

@media only screen and (max-width: 800px) {
  .background .purchse-mod-con {
    margin: 0;
    width: 100vw;
    min-height: 100vh;
  }
}

@media only screen and (max-width: 650px) {
  .background .purchse-mod-con {
    grid-template-columns: 40px 150fr 40px;
    overflow-y: scroll;
  }

  .background .purchse-mod-con #poster-con {
    visibility: hidden;
  }

}
</style>