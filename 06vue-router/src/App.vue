<template>
  <div id="app">
    <img
      alt="Vue logo"
      width="500px"
      src="http://edu-image.nosdn.127.net/e4ebc486f7454d22870e0b79b824fdf1.png?imageView&quality=100
"
    >
    <router-link to="/foo">foo</router-link>
    <router-link to="/bar">bar</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
