<script setup>
import router from "../router";
import { ref } from 'vue';
import { auth, firestore } from "../firebase/index.js";
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useUserToken, useUserMovies, useUserCart } from '../store/store';
import Header from '../components/Header.vue'

const userToken = useUserToken();
const userMovies = useUserMovies()
const userCart = useUserCart();

const googleAuth = new GoogleAuthProvider();
const otherError = ref("");
const emailError = ref("");
const password = ref("");
const email = ref("");
const errWarn = ref();

onAuthStateChanged(auth, (user) => {
  if (user) {
    router.push('/shop')
  } else {
    userToken.token.userToken = "";
    cart.cart = new Map()
    userMovies.myMovies = []
  }
});


function loginWGoogle() {
  signInWithPopup(auth, googleAuth)
    .then((userCredential) => {
      const user = userCredential.user.uid;
      userToken.token.userToken = user
      getOwnedMovies(user)
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
      otherError.value = "Something went wrong, try again!";
    });
}

function eMailLogin() {
  if (email.value.length < 3 || password.value.length < 6) {
    emailError.value = "Invalid Username and/or Password";
    errWarn.value = true;
    setTimeout(() => {
      errWarn.value = false;
    }, 1500)
  } else {
    signInWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user.uid;
        userToken.token.userToken = user;
        getOwnedMovies(user)
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        emailError.value = "Invalid Username and/or Password";
        errWarn.value = true;
        setTimeout(() => {
          errWarn.value = false;
        }, 1500)
      });
  }
}

async function getOwnedMovies(id) {
  const docRef = doc(firestore, "movies", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    userMovies.myMovies = docSnap.data().movies;
  } else {
    userMovies.myMovies = [];
  }
}

function loginWApple() {
  otherError.value = "Apple signup currently unavailable, please use a different one"
}

function loginWFacebook() {
  otherError.value = "Facebook signup currently unavailable, please use a different one"
}

</script>

<template>
  <Header @clickedLogo="router.push('/')">
    <template #button2>
      <button id="signin-but" @click="router.push('/signup')">Signup</button>
    </template>
  </Header>
  <div class="aa-con">
    <img id="background" src="https://bloody-disgusting.com/wp-content/uploads/2016/10/horrorpostercollage.jpg">
    <div class="email-con">
      <h2>Login With Email</h2>
      <form id="input-holder" :class="{ shake: errWarn }">
        <input v-model="email" id="email" autocomplete="email" :class="{ red: errWarn != null }" placeholder="Email" />
        <input v-model="password" type="password" autocomplete="current-password" id="pass"
          :class="{ red: errWarn != null }" placeholder="Password">
      </form>
      <button id="sub-em" type="submit" @click="eMailLogin()">Login</button>
      <p id="email-err" v-if="emailError"> {{ emailError }}</p>
    </div>
    <div class="other-con">
      <h2>Other Options</h2>
      <button id="apple-login" @click="loginWApple()">
        <img id="logo-img"
          src="https://www.freepnglogos.com/uploads/apple-logo-png/apple-logo-png-dallas-shootings-don-add-are-speech-zones-used-4.png"
          alt="">
        <p id="google-text">Apple</p>
      </button>
      <button id="facebook-login" @click="loginWFacebook()">
        <img id="logo-img" src="https://cdn.freebiesupply.com/logos/large/2x/facebook-icon-logo-png-transparent.png"
          alt="">
        <p id="google-text">Facebook</p>
      </button>
      <button id="google-login" @click="loginWGoogle()">
        <img id="logo-img"
          src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSgq0o_Ul6ZHuLR2M2yqisjV_ysd83L63u-DKxK_2tEfvfMNlnm"
          alt="">
        <p id="google-text">Google</p>
      </button>
      <p id="other-err" v-if="otherError"> {{ otherError }}</p>
    </div>
  </div>
</template>

<style scoped>
.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}

.red {
  border-color: red;
}

@keyframes shake {

  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}



.aa-con {
  width: 100%;
  height: 80vh;
  display: grid;
  grid-template-columns: 1fr 250px 50px 250px 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  background-color: rgb(0, 0, 0, 0.8);
}

.aa-con #background {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -1;
}

#signin-but {
  height: 100%;
  width: 100%;
}

#email-err {
  color: rgb(255, 0, 0);
  text-align: center;
  font-family: serif;
  margin-top: 17.5px;
}

#other-err {
  color: rgb(255, 0, 0);
  text-align: center;
  font-family: serif;
}

#apple-login #logo-img {
  filter: invert(1);
}

.other-con button {
  display: flex;
  justify-content: center;
  text-align: center;
  width: 90%;
  margin: 5%;
}

.other-con button:disabled {
  background-color: grey;
  cursor: default;
}

.other-con #google-text {
  margin: auto;
}

.other-con #logo-img {
  width: 30px;
  height: 30px;
  margin: 5px;
  /* background-color: white; */
}

#sub-em {
  margin-left: 5%;
  margin-top: 4%;
  height: 40px;
  width: 90%;

}

.aa-con h2 {
  text-align: center;
}

.aa-con .email-con {
  /* background-color: rgba(35, 35, 35, 0.5); */
  backdrop-filter: blur(10px);
  background-color: rgba(0, 0, 0, 0.19);
  width: 250px;
  height: 250px;
  grid-column-start: 2;
  grid-row-start: 2;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19);
}

.aa-con .email-con input {
  background-color: transparent;
  border-radius: 0;
  border-width: 0 0 2px 0;
}

.aa-con .other-con {
  backdrop-filter: blur(10px);
  background-color: rgba(0, 0, 0, 0.19);
  width: 250px;
  height: 250px;
  grid-column-start: 4;
  grid-row-start: 2;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19);
}

#input-holder #pass,
#input-holder #email {
  margin: 3.8%;
  padding-left: 2%;
  padding-right: 2%;
  margin-left: 5%;
  width: 90%;
  height: 40px;
}

#input-holder {
  display: grid;
  grid-column: 1fr 1fr 1fr;
  align-items: right;
}

@media only screen and (max-width: 550px) {
  .aa-con {
    grid-template-columns: 1fr 250px 1fr;
    grid-template-rows: 1fr 250px 1fr 250px 1fr;
    justify-items: center;
    min-height: 550px;
  }

  .aa-con .email-con {
    grid-column-start: 2;
    grid-row-start: 2;
  }

  .aa-con .other-con {
    grid-column-start: 2;
    grid-row-start: 4;
  }

}

@media only screen and (min-width: 551px) {
  .aa-con {
    min-height: 300px;
  }
}
</style>