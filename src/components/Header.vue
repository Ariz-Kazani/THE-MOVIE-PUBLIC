<script setup>

const emits = defineEmits(['clickedLogo']);

</script>

<template>
  <div class="header-con">
    <div class="logo" @click="emits('clickedLogo')">
      <h1 id="the">The</h1>
      <p id="movie">Movie</p>
    </div>
    <div id="head-but">
      <slot name="button"></slot>
    </div>
    <div id="head-but-2">
      <slot name="button2"></slot>
    </div>
    <div id="search-bar">
      <slot name="search-bar"></slot>
    </div>
  </div>
</template>

<style scoped>
.header-con #search-bar {
  grid-row: 2;
  grid-column: 3;
  width: 95%;
  height: 25px;
  margin: auto;
}

.header-con #head-but {
  grid-row: 2;
  grid-column: 4;
  margin: auto;
  width: 95%;
  height: 25px;
}

.header-con #head-but-2 {
  grid-row: 2;
  grid-column: 6;
  margin: auto;
  width: 95%;
  height: 25px;
}

.header-con {
  width: 100%;
  height: 100px;
  background-color: rgb(35, 35, 35);
  color: white;
  display: grid;
  grid-template-columns: 5px 90px 1fr 90px 5px 90px 5px;
  grid-template-rows: 5px 90px 5px;
}

.header-con .logo {
  width: 90px;
  height: 90px;
  grid-column: 2;
  grid-row: 2
}

.header-con .logo>* {
  font-family: 'Kanit', sans-serif;
  text-align: center;
  cursor: pointer;
  overflow: hidden;
}

.header-con .logo #the {
  color: rgb(35, 35, 35);
  background-color: rgb(255, 255, 255);
  /* font-size: 2.1em;  */
  height: 50%;
}

.header-con .logo #movie {
  width: 100%;
  height: 50%;
  font-size: 25.2pt;
  text-align: center;
}

@media only screen and (max-width: 550px) {
  .header-con {
    height: 140px;
    grid-template-rows: 15px 45px 45px 30px 10px;
    grid-template-columns: 10px 90px 1fr 90px 10px;
  }

  .header-con #search-bar {
    grid-row: 4;
    grid-column: 2 / span 3;
  }

  .header-con #head-but {
    grid-row: 3;
    grid-column: 4;
  }
  .header-con #head-but-2 {
    grid-row: 2;
    grid-column: 4;
  }


}
</style>