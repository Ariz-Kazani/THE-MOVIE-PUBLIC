<script setup>
import router from "../router";
import Header from '../components/Header.vue'
</script>

<template>
  <Header></Header>
  <div class="lp-con">
    <img id="background" src="https://bloody-disgusting.com/wp-content/uploads/2016/10/horrorpostercollage.jpg">
    <div id="darken">
      <h1>Want it? Buy it. Own it!</h1>
      <h3>Login to get access to thousands of movies now!</h3>
      <div>
        <div id="line"></div>
        <div class="option-con">
          <button id="login" @click="router.push('Login')">Login</button>
          <p>or</p>
          <button id="signup" @click="router.push('Signup')">Signup</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lp-con {
  height: 80vh;
  position: relative;
}

.lp-con #darken {
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0, 0.8);
}

.lp-con #darken h1 {
  text-align: center;
  font-size: 15vmin;
  width: 100%;
}

.lp-con .option-con {
  width: 100%;
  margin-top: 4vmin;
  display: grid;
  grid-template-columns: 1fr minmax(180px, 20%) 50px minmax(180px, 20%) 1fr;
}

.lp-con .option-con #login {
  grid-column: 2;
  height: 30px;
  min-width: 180px;
}

.lp-con .option-con #signup {
  grid-column: 4;
  height: 30px;
  min-width: 180px;
}

.option-con p {
  align-self: center;
  text-align: center;
  grid-column: 3;
  width: 100%;
}

@media only screen and (max-width: 450px) {

  .lp-con {
    min-height: 300px;
  }
  .lp-con .option-con {
    display: grid;
    grid-template-columns: 80vw;
    grid-template-rows: 10vmin 3vmin 10vmin;
    justify-content: center;
  }

  .lp-con .option-con #login {
    grid-row: 1;
    grid-column: 1;

  }

  .lp-con .option-con p {
    display: none;
  }

  .lp-con .option-con #signup {
    grid-column: 1;
    grid-row: 3;
  }
}

.lp-con #line {
  height: 3px;
  width: 80%;
  background-color: 80%;
  margin-left: 10%;
  margin-top: 4vmin;
  background-color: rgb(255, 255, 255);
}

.lp-con #darken h3 {
  text-align: center;
  font-size: 7vmin;
  margin-top: 4vmin;
  width: 100%;
}



.lp-con #background {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -1;
}
</style>