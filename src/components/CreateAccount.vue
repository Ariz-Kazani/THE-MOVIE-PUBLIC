<script setup>
import router from "../router";
import { ref } from 'vue';
import { auth } from "../firebase/index.js";
import Header from '../components/Header.vue'
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useUserToken, useUserMovies, useUserCart } from '../store/store';

// Store
const userToken = useUserToken();
const userMovies = useUserMovies();
const userCart = useUserCart();

// Auth
const googleAuth = new GoogleAuthProvider();
const email = ref("");
const password = ref("");
const password2 = ref("");
const emailError = ref("");
const eError = ref({
  has: false,
  type: null,
})
const otherError = ref("");

// Check if user is already logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    router.push('/shop')
  } else {
    userToken.token.userToken = "";
    cart.cart = new Map()
    userMovies.myMovies = []
  }
});

// log user in with google
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
    });
}

// create user with email
async function eMailSignin() {
  const data = () => {
    createUserWithEmailAndPassword(auth, email.value, password2.value)
      .then((userCredential) => {
        const user = userCredential.user.uid;
        userToken.token.userToken = user
        getOwnedMovies(user)
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };
  if (email.value.length < 3) {
    eError.value.type = "email";
    eError.value.has = true;
    emailError.value = "Invallid email"
  } else if (password.value != password2.value) {
    eError.value.type = "pass";
    eError.value.has = true;
    emailError.value = "Passwords do not match"
  } else if (password2.value.length < 6) {
    eError.value.type = "pass";
    eError.value.has = true;
    emailError.value = "Password(s) must be at least 6 characters long"
  } else {
    data();
  }
  setTimeout(() => {
    eError.value.has = false;
  }, 1500)

}

// get user owned movies
async function getOwnedMovies(id) {
  const docRef = doc(firestore, "movies", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    userMovies.myMovies = docSnap.data().movies;
  }else {
    userMovies.myMovies = [];
  }
}

// other login options
function loginWApple() {
  otherError.value = "Apple signin currently unavailable, please use a different one"
}

function loginWFacebook() {
  otherError.value = "Facebook signin currently unavailable, please use a different one"
}
</script>

<template>
  <Header @clickedLogo="router.push('/')">
    <template #button2>
      <button id="login-but" @click="router.push('/login')">Login</button>
    </template>
  </Header>
  <div class="con">
    <img id="background" src="https://bloody-disgusting.com/wp-content/uploads/2016/10/horrorpostercollage.jpg">
    <div class="email-con">
      <h2>Signup With Email</h2>
      <form id="input-holder">
        <input v-model="email" type="email" id="email" autocomplete="email" placeholder="  Username/Email"
          :class="{ red: eError.type == 'email', shake: eError.type == 'email' && eError.has }" />
        <input v-model="password" type="password" autocomplete="current-password" id="pass" placeholder="  Password"
          :class="{ red: eError.type == 'pass', shake: eError.type == 'pass' && eError.has }" />
        <input v-model="password2" type="password" autocomplete="current-password" id="pass2"
          placeholder="  Re-Enter Password"
          :class="{ red: eError.type == 'pass', shake: eError.type == 'pass' && eError.has }" />
      </form>
      <button v-show="!eError.has" id="sub-em" type="submit" @click="eMailSignin()">Signup</button>
      <p v-if="emailError" id="email-err">{{ emailError }}</p>
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
      <p v-if="otherError" id="other-err">{{ otherError }}</p>
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




.con {
  width: 100%;
  height: 80vh;
  display: grid;
  grid-template-columns: 1fr 250px 50px 250px 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  background-color: rgb(0, 0, 0, 0.8);
}

.con #background {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -1;
}

#login-but {
  height: 100%;
  width: 100%;
}

#email-err {
  position: relative;
  color: rgb(255, 0, 0);
  text-align: center;
  font-family: serif;
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
  margin: 3% 5% 3% 5%;
  width: 90%;
  padding: 1%;
}

.con h2 {
  text-align: center;
}

.con .email-con {
  backdrop-filter: blur(10px);
  background-color: rgba(0, 0, 0, 0.19);
  width: 250px;
  height: 250px;
  grid-column-start: 2;
  grid-row-start: 2;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19);
}

.con .email-con input {
  background-color: transparent;
  border-radius: 0;
  border-width: 0 0 2px 0;
}

.con .other-con {
  backdrop-filter: blur(10px);
  background-color: rgba(0, 0, 0, 0.19);
  width: 250px;
  height: 250px;
  grid-column-start: 4;
  grid-row-start: 2;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19);
}

#input-holder>* {
  margin: 3% 5% 3% 5%;
  padding: 2%;
  width: 90%;
}

#input-holder {
  display: grid;
  grid-column: 1fr 1fr 1fr;
  align-items: right;
}

@media only screen and (max-width: 550px) {
  .con {
    grid-template-columns: 1fr 250px 1fr;
    grid-template-rows: 1fr 250px 1fr 250px 1fr;
    justify-items: center;
    min-height: 550px;
  }

  .con .email-con {
    grid-column-start: 2;
    grid-row-start: 2;
  }

  .con .other-con {
    grid-column-start: 2;
    grid-row-start: 4;
  }

}

@media only screen and (min-width: 551px) {
  .con {
    min-height: 300px;
  }
}
</style>