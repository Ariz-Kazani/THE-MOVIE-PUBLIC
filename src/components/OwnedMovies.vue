<script setup>
import Header from '../components/Header.vue'
import router from '../router/index.js'
import axios from 'axios';
import { useUserMovies } from '../store/store';
import { ref } from 'vue';

const userMovies = useUserMovies().myMovies;
const movies = ref([]);
const isWatchingMovie = ref(false);
// const watchingMovieId = ref("")
const watchingMovieLink = ref("")

const TMDB_API_KEY = ref(import.meta.env.VITE_TMDB_API_KEY);

// Get movies from TMDB API
async function getMovies() {
  for (let movie of userMovies) {
    let movieData = await axios.get(`https://api.themoviedb.org/3/movie/${movie}`, {
      params: {
        api_key: TMDB_API_KEY.value,
        append_to_response: "videos",
      }
    });

    try {
      movieData.data.videos = `${(movieData.data.videos.results.filter((trailer) => trailer.type === "Trailer")).at(0).key}`;
    } catch {
      movieData.data.videos = 'dQw4w9WgXcQ';
    }
    movies.value.push(movieData.data)
  }
}
// Get movies
getMovies()

// function to watch movie
function watchMovie(id) {
  watchingMovieLink.value = 'https://www.youtube.com/embed/' + id + '?autoplay=1'
  isWatchingMovie.value = true;
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
}
</script>

<template>
  <Header @clickedLogo="router.push('shop')"></Header>
  <div class="owned-movie-con">
    <div class="watch-movie-con" v-if="isWatchingMovie">
      <iframe :src="watchingMovieLink" frameborder="0" allowfullscreen allow='autoplay'></iframe>
    </div>
    <div class="my-movies-con">
      <div class="movies-op-con" v-if="movies.length > 0" v-for="movie of movies" @click="watchMovie(movie.videos)">
        <img :src="('https://image.tmdb.org/t/p/w500' + movie.poster_path)" alt="" id="poster">
        <h3 id="title">{{ movie.title }}</h3>
      </div>
    </div>
  </div>
</template>

<style scoped>
.owned-movie-con {
  width: 100%;
  overflow: hidden;
}

.watch-movie-con iframe {
  width: 61%;
  margin: 5%;
  aspect-ratio: 16/9;
}

.my-movies-con {
  min-height: 80vh;
  color: red;
  width: 100%;
}

.movies-op-con {
  width: 80%;
  height: 50px;
  border-radius: 25px;
  margin: 15px 10% 15px;
  background-color: rgb(35, 35, 35);
  display: grid;
  grid-template-columns: 58px 1fr 58px;
  overflow: hidden;
  cursor: pointer;
}

.movies-op-con:hover {
  transform: scale(1.1);
}

.movies-op-con #poster {
  height: 50px;
  grid-column: 1;
  justify-self: end;
}

.movies-op-con #title {
  margin: auto;
  width: 100%;
  padding: 10px;
  height: 25px;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.watch-movie-con {
  width: 140%;
}

@media only screen and (min-width: 950px) {
  .owned-movie-con {
    width: 100%;
    display: flex;
  }

  .watch-movie-con iframe {
    width: 90%;
    margin: 5%;
    aspect-ratio: 16/9;
  }
}
</style>