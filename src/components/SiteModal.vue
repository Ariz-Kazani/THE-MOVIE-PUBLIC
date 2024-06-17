<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useUserCart, useUserMovies } from '../store/store';

// Store
const props = defineProps(['id']);
const emits = defineEmits(['toggleModal']);

// Variables
const genres = ref("");
const movieData = ref();
const cart = ref(useUserCart());
const myMovies = ref(useUserMovies().myMovies);

// Get movie data
const TMDB_API_KEY = ref(import.meta.env.VITE_TMDB_API_KEY);

// Get movie data from TMDB API
movieData.value = await axios.get(`https://api.themoviedb.org/3/movie/${props.id}`, {
  params: {
    api_key: TMDB_API_KEY.value,
  }
});

// Get genres
function getGenras() {
  for (let genre of movieData.value.data.genres) {
    genres.value += genre.name + ", ";
  }
  genres.value = genres.value.substring(0, genres.value.length - 2)
}

getGenras()


// Add and remove from cart
function addToStore() {
  cart.value.cart.set(movieData.value.data.id, {
    title: movieData.value.data.title,
    poster: movieData.value.data.poster_path

  });
}

function removeFromStore() {
  cart.value.cart.delete(movieData.value.data.id);
}
</script>

<template>
  <Teleport to="body">
    <div class="background" @click.self="emits('toggleModal')">
      <div class="modal-data">
        <button id="exit-but" @click="emits('toggleModal')">x</button>
        <h2 id="title"> {{ movieData.data.title }}</h2>
        <p id="genres">{{ genres }}</p>
        <p id="date">Released: {{ movieData.data.release_date }} </p>
        <p id="runtime"> Length: {{ movieData.data.runtime }}min</p>
        <p id="overview"> {{ movieData.data.overview }} </p>
        <img :src="('https://image.tmdb.org/t/p/w500' + movieData.data.poster_path)" alt="" id="poster">
        <p id="rating-val" v-if="movieData.data.vote_count > 0">Rating: {{ Math.trunc((movieData.data.vote_average) *
          10)
          }}/100</p>
        <p id="rating-val" v-if="movieData.data.vote_count < 0"> Rating: Unrated</p>
        <div v-if="movieData.data.vote_count > 0" id="rating-holder">
          <div id="rating"
            :style="'width: ' + (movieData.data.vote_average) * 10 + '%;' +
              'background-color: rgb(' + ((movieData.data.vote_average) * 10 > 50 ? 255 - 255 * (movieData.data.vote_average) * 0.1 : 255) +
              ',' + ((movieData.data.vote_average) * 10 < 50 ? 255 * (movieData.data.vote_average) * 0.1 : 255) + ',0);'"></div>
        </div>
        <div class="cart-but-con" v-if="!myMovies.includes(props.id)">
          <Transition name="swap-but" enter-active-class="animate__animated animate__fadeInDown"
            leave-active-class="animate__animated animate__fadeOutUp">
            <button v-if="cart.cart.has(movieData.data.id)" id="remove-from-cart" @click="removeFromStore()">Remove from
              cart</button>
            <button v-else-if="!cart.cart.has(movieData.data.id)" id="add-to-cart" @click="addToStore()">Add to
              Cart</button>
          </Transition>
        </div>
        <div v-else class="cart-but-con">Owned</div>
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

.modal-data {
  width: 800px;
  height: 500px;
  margin-left: calc(50vw - 400px);
  margin-top: calc(50vh - 250px);
  background-color: rgb(35, 35, 35);
  display: grid;
  grid-template-columns: 40px 200px 40px 1fr 40px;
  grid-template-rows: 40px 56px 26px 26px 26px 1fr 1fr 20px 12px 1fr 1fr 40px;
}

#poster {
  height: 300px;
  width: 200px;
  grid-column: 2;
  grid-row: 2 / span 5;
}

#title {
  grid-column: 4;
  grid-row: 2;
}

#genres {
  grid-column: 4;
  grid-row: 3;
}

#date {
  grid-column: 4;
  grid-row: 4;
}

#runtime {
  grid-column: 4;
  grid-row: 5;
}

#overview {
  grid-column: 4;
  grid-row: 6 / span 5;
}

#rating-holder {
  margin-left: calc(5% - 1px);
  width: 90%;
  height: 10px;
  border-style: solid;
  border-width: 1px;
  border-color: white;
  border-radius: 4px;

  grid-column: 2;
  grid-row: 9;
}

#rating {
  width: 200px;
  height: 10px;
  border-radius: 2.5px;
}

#rating-val {
  text-align: center;
  grid-column: 2;
  grid-row: 8;
}

#exit-but {
  grid-column: 5;
  grid-row: 1;
  background-color: transparent;
  border-color: transparent;
  font-size: 1rem;
}

.cart-but-con {
  position: relative;
  grid-column: 2;
  grid-row: 11;
}

.cart-but-con>button {
  position: absolute;
  width: 100%;
  height: 30px;
}

#exit-but:hover {
  color: red;
  border-color: red;
}

#remove-from-cart {
  color: red;
}

#remove-from-cart:hover {
  border-color: red;
}



@media only screen and (max-height: 500px) {
  .modal-data {
    margin-top: 0;
    height: 100vh;
    overflow-y: scroll;
    grid-template-rows: 40px 56px 26px 26px 26px minmax(90px, 1fr) minmax(90px, 1fr) 20px 12px minmax(20px, 1fr) 30px 40px;
  }
}


@media only screen and (max-width: 800px) {
  .background {
    min-width: 800px;
  }

  .modal-data {
    margin-top: 0;
    margin-left: 0;
    width: 100vw;
    height: 100%;
    grid-template-rows: 40px 56px 26px 26px 26px 90px 90px 20px 12px 20px 30px 40px;
    overflow-x: scroll;
  }

  #exit-but {
    color: red;
    border-color: red;
  }
}

@media only screen and (max-width: 600px) {
  .modal-data {
    grid-template-rows: 40px 84px 52px 26px 26px 90px 90px 20px 12px 20px 30px 40px;
  }

  #title {
    font-size: 20px;
  }
}


@media only screen and (max-width: 500px) {
  .modal-data {
    grid-template-columns: 40px 1fr 40px;
    grid-template-rows: 40px 56px 1fr 28px 26px 40px 52px 26px 26px 1fr 40px;
    justify-items: center;
  }


  #exit-but {
    grid-column: 3;
    width: 100%;
  }

  #title {
    grid-row: 2;
    grid-column: 2;
    text-align: center;
  }

  #poster {
    grid-row: 3;
    grid-column: 2;
  }


  #rating-val {
    grid-row: 4;
    grid-column: 2;
  }

  #rating-holder {
    grid-row: 5;
    grid-column: 2;

  }

  .cart-but-con {
    grid-row: 6;
    grid-column: 2;
    width: 100%;
  }

  #genres {
    grid-row: 7;
    grid-column: 2;
    text-align: center;
  }

  #runtime {
    grid-row: 8;
    grid-column: 2;

  }

  #date {
    grid-row: 9;
    grid-column: 2;

  }

  #overview {
    grid-row: 10;
    grid-column: 2;
    text-align: center;
  }
}
</style>
