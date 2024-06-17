<script setup>
import { useUserToken, useUserCart } from '../store/store';
import { ref } from 'vue';
import router from '../router/index.js'
import Header from '../components/Header.vue'
import { auth } from "../firebase/index.js";
import { onAuthStateChanged } from 'firebase/auth';
import PurchaseModal from "../components/PurchaseModal.vue";

// Store
const cart = ref(useUserCart());
const userToken = useUserToken();
const showModal = ref(false);

// Check if cart is empty
if (cart.value.cart.size == 0) {
  router.push('shop');
}

// Check if user is logged in
onAuthStateChanged(auth, (user) => {
  if (!user) {
    userToken.token.userToken = "";
    router.push("/");
  }
});

// Remove movie from cart
function removeFromStore(key) {
  cart.value.cart.delete(key);
  if (cart.value.cart.size == 0) {
    setTimeout(() => { router.push('shop') }, 500);
  }
}

// Open and close modal
function openModal() {
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}
</script>

<template>
  <Header @clickedLogo="router.push('shop')">
    <template #button2>
      <Transition name="exit-but" duration="100" leave-active-class="animate__animated animate__zoomOut">
        <button v-if="cart.cart.size" id="buy-but" @click="openModal()">Buy Now</button>
      </Transition>
    </template>
  </Header>
  <div class="con">
    <TransitionGroup name="swap-but" leave-active-class="animate__animated animate__backOutLeft">
      <div :key="key" class="movie-info" v-for="key of cart.cart.keys()">
        <img id="poster" :src="('https://image.tmdb.org/t/p/w500' + cart.cart.get(key).poster)" alt="">
        <h3 id="title"> {{ cart.cart.get(key).title }} </h3>
        <h3 id="movie-id"> Item id: {{ key }} </h3>
        <p id="remove-movie" @click="removeFromStore(key)">remove</p>
      </div>
    </TransitionGroup>
  </div>
  <Suspense>
    <PurchaseModal v-if="showModal" @toggleModal="closeModal()" />
  </Suspense>
</template>


<style scoped>
.con {
  min-height: 80vh;
  margin: 15px 0px;
}

.movie-info {
  width: 80%;
  height: 50px;
  border-radius: 25px;
  margin: 15px 10% 15px;
  background-color: rgb(35, 35, 35);
  display: grid;
  grid-template-columns: 58px 1fr 80px;
  overflow: hidden;
}

.movie-info #poster {
  height: 50px;
  grid-column: 1;
  justify-self: end;
}

.movie-info #title {
  margin: auto;
  padding: 5px;
  overflow: hidden
}

.movie-info #movie-id {
  margin: auto;
  padding: 5px;
  overflow: hidden
}

.movie-info #remove-movie {
  margin: auto;
  padding: 10px;
  border-radius: 20px;
  background-color: red;
  cursor: pointer;
  grid-column: 3;
  justify-self: start;
  font-family: serif;
}

#buy-but {
  height: 100%;
  width: 100%;
}

@media only screen and (max-width: 749px) {
  .movie-info #title {
    font-size: 15px;
  }
}

@media only screen and (max-width: 550px) {
  .movie-info #title {
    display: none;
  }

  .movie-info #movie-id {
    font-size: 15px;
  }
}

@media only screen and (min-width: 551px) {
  .movie-info #movie-id {
    display: none;
  }
}
</style>