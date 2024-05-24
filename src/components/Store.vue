<script setup>
import router from "../router";
import { ref } from 'vue';
import { useUserToken, useUserCart } from '../store/store';
import axios from 'axios';
import SiteModal from "../components/SiteModal.vue";
import Header from '../components/Header.vue'
import { auth } from "../firebase/index.js";
import { onAuthStateChanged } from 'firebase/auth';

const userToken = useUserToken();
const userCart = ref(useUserCart());
const TMDB_API_KEY = ref(import.meta.env.VITE_TMDB_API_KEY);


onAuthStateChanged(auth, (user) => {
  if (!user) {
    userToken.token.userToken = "";
    router.push("/");
  }
});

const movies = ref();
const showModal = ref(false);
const selId = ref(0);
let isHome = true;
let changePage = false;
let searchInput = "";
let search = "";

function openModal(id) {
  selId.value = id;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

async function getHome(page = 1) {
  movies.value = null
  search = "";
  let data = await axios.get("https://api.themoviedb.org/3/discover/movie", {
    params: {
      api_key: TMDB_API_KEY.value,
      include_adult: "false",
      page: page
    },
  })
  changePage = false;
  isHome = true;
  movies.value = data.data;
}

getHome()

async function getSearch(page = 1) {
  while (searchInput.charAt(0) == " ") {
    searchInput = searchInput.substring(1)
  }
  if (page == movies.value.page) {
    if ((searchInput == search || searchInput == "")) {
      return null;
    }
  }
  if (!changePage) {
    search = searchInput;
  }
  movies.value = null
  let data = await axios.get("https://api.themoviedb.org/3/search/movie", {
    params: {
      api_key: TMDB_API_KEY.value,
      include_adult: "false",
      query: search,
      page: page
    },
  })
  changePage = false;
  isHome = false;
  movies.value = data.data;
};

async function updatePage(uPage) {
  changePage = true;
  isHome ? getHome(uPage) : getSearch(uPage);
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
}

</script>

<template>
  <Header @clickedLogo="getHome()">
    <template #button>
      <button id="to-cart" v-show="userCart.cart.size" @click="router.push('cart')">cart</button>
    </template>
    <template #button2>
      <button id="to-cart" @click="router.push('mymovies')">My Movies</button>
    </template>
    <template #search-bar>
      <input type="text" id="search-input" placeholder="Search For A Movie" v-model="searchInput"
        @keydown.enter="getSearch()" />
    </template>
  </Header>
  <br>
  <div class="all-movies">
    <h2 id="connection-m" v-if="!movies">Trying to fetch data...</h2>
    <h2 id="search-not-found" v-if="movies && !movies.total_results">Search Not Found, try searching for something else!
    </h2>
    <div class="movie-con" v-if="movies" v-for="movie of movies.results" @click="openModal(movie.id)">
      <img :src="('https://image.tmdb.org/t/p/w500' + movie.poster_path)" alt="Poster Not Found">
      <div class="movie-info">
        <p id="title">{{ movie.title }}</p>
        <p id="release-date">Realeased: {{ movie.release_date == "" ? "Unknown" : movie.release_date }}</p>
        <p v-if="movie.vote_count > 0">Rating: {{ Math.trunc((movie.vote_average) * 10) }}/100</p>
        <p v-else>Rating: Unrated</p>
        <div v-if="movie.vote_count > 0" id="rating-holder">
          <div id="rating" :style="'width: ' + (movie.vote_average) * 10 + '%;' +
            'background-color: rgb(' + ((movie.vote_average) * 10 > 50 ? 255 - 255 * (movie.vote_average) * 0.1 : 255) +
            ',' + ((movie.vote_average) * 10 < 50 ? 255 * (movie.vote_average) * 0.1 : 255) + ',0);'"></div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="movies" class="pages">
    <p id="page-but" v-show="movies.page > 1" @click="updatePage(movies.page - 1)">&#60;</p>
    <p id="page-num"> Page: {{ movies.page }}/{{ movies.total_pages }}</p>
    <p id="page-but" v-show="movies.page < movies.total_pages" @click="updatePage(movies.page + 1)">&#62;</p>
  </div>
  <br>
  <Suspense>
    <SiteModal v-if="showModal" @toggleModal="closeModal()" :id="selId" />
  </Suspense>
</template>
<style sccoped>
.pages {
  display: flex;
  align-items: center;
  justify-content: center;
}

.pages #page-but {
  background-color: rgb(35, 35, 35);
  height: 50px;
  width: 50px;
  padding: auto;
  text-align: center;
  border-radius: 25px;
  cursor: pointer;
  color: #121212;
  font-size: 2.9em;
  font-family: sans-serif;
  font-weight: 700;
}

.pages #page-num {
  margin: 30px;
}

.all-movies {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 50px;
}

.movie-con {
  width: 200px;
  height: 300px;
}

.movie-con #release-date {
  font-size: 15px;
}

.movie-con img {
  width: 200px;
  aspect-ratio: 2/3;
  z-index: -1;
  position: absolute;
  border-radius: 20px;
}

.movie-con .movie-info {
  width: 200px;
  height: 300px;
  background-color: black;
  opacity: 0;
  transition: opacity 0.4s;
  border-radius: 20px;
  cursor: pointer;
}

.movie-con .movie-info:hover {
  opacity: 90%;
}

.movie-con .movie-info p {
  padding: 5%;
  width: 90%;
  text-align: center;
}

.movie-con .movie-info #rating-holder {
  margin-left: calc(5% - 1px);
  width: 90%;
  border-style: solid;
  border-width: 1px;
  border-color: white;
  border-radius: 4px;
}

.movie-con .movie-info #rating-holder #rating {
  height: 10px;
  border-radius: 2.5px;
}

#connection-m {
  height: 80vh;
}

#search-not-found {
  height: 80vh;
}

#to-cart {
  height: 100%;
  width: 100%;
}

#search-input {
  width: 96%;
  padding: 0 2% 0 2%;
  height: 100%;
}
</style>