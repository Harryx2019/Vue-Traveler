<template>
  <div class="home">
    <el-carousel height="100vh" :interval="5000">
      <el-carousel-item v-for="item in images" :key="item.id">
        <el-image style="height: 100vh" :src="item.url" fit="cover"></el-image>
      </el-carousel-item>
    </el-carousel>
    <div class="container">
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      images: [
        {
          id: 1,
          url: require("../img/1.png"),
        },
        {
          id: 2,
          url: require("../img/4.png"),
        },
        {
          id: 3,
          url: require("../img/2.png"),
        },
        {
          id: 4,
          url: require("../img/5.png"),
        },
        {
          id: 5,
          url: require("../img/3.png"),
        },
      ],
    };
  },
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}
.container {
  position: absolute;
  z-index: 1000;
  top: 0;
  left: 10%;
  width: 80%;
  background-color: rgb(255, 255, 255, 0.5);
  height: 100vh;
}
</style>