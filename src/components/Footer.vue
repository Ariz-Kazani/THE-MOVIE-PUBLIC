<script setup>
import { auth } from "../firebase/index.js";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useUserToken } from '../store/store';
import { ref } from "vue";

const userToken = useUserToken();
const signedIn = ref(false);

async function logOut() {
  window.scroll(0, 0);
  signedIn.value = false;
  await signOut(auth);
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    userToken.token.userToken = "";
  } else {
    signedIn.value = true
  }
});

function toTop() {
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
}
</script>

<template>
  <div class="footer-con">
    <div class="but-con">
      <a href="https://ariz-kazani.web.app" target="_blank">
        <p id="about-but">About</p>
      </a>
      <p v-if="signedIn" id="log-out-but" @click="logOut()">Logout</p>
    </div>
    <div class="logo" @click="toTop()">
      <h1 id="the">The</h1>
      <p id="movie">Movie</p>
    </div>
    <p id="site-info">&copy; 2023 Ariz Kazani. Site data from <a href="https://www.themoviedb.org" target="_blank">TMDB</a>.
    </p>
  </div>
</template>
  
<style scoped>
.footer-con {
  width: 100%;
  height: 400px;
  background-color: rgb(35, 35, 35);
  color: white;
  display: grid;
  grid-template-columns: 20px 200px 1fr 135px 1fr 200px 20px;
  grid-template-rows: 20px 200px 1fr 20px 20px;
}

.footer-con .but-con {
  grid-row: 2;
  grid-column: 4;
  width: 135px;
  display: flex;
  margin: auto;
}

.footer-con .but-con > *{
  text-decoration: none;
}

.footer-con #log-out-but,
.footer-con #about-but {
  width: 60px;
  margin: auto;
  border-style: solid;
  border-color: white;
  text-align: center;
  cursor: pointer;
}

.footer-con .logo {
  grid-row: 2;
  grid-column: 2;
  overflow: hidden;
  height: 200px;
  width: 200px;
  cursor: pointer;
}

.footer-con .logo>* {
  font-family: 'Kanit', sans-serif;
  text-align: center;
}

.footer-con .logo #the {
  background-color: rgb(255, 255, 255);
  color: rgb(35, 35, 35);
  height: 50%;
  width: 100%;
  font-size: 70px;
}

.footer-con .logo #movie {
  font-size: 75px;
  height: 50%;
  width: 100%;
}

.footer-con #site-info {
  grid-column: 2 / span 5;
  grid-row: 4;
  text-align: center;
  font-family: serif;
}

@media only screen and (max-width: 600px) {
  .footer-con {
    grid-template-columns: 20px 200px 1fr 20px;
  }

  .footer-con .but-con {
    grid-column: 3 / span 2;
  }

  .footer-con #site-info {
    grid-column: 2 / span 2;
  }

}

@media only screen and (max-width: 394px) {
  .footer-con {
    grid-template-columns: 20px 1fr 200px 1fr 20px;
  }

  .footer-con .logo {
    grid-column: 3;
  }

  .footer-con .but-con {
    grid-row: 3;
    grid-column: 1 / span 5;
  }

  .footer-con #site-info {
    grid-column: 2 / span 3;
  }

}
</style>