<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {};
  },
  methods: {
  }
};
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
  background: #fff;
}
#app {
  font-family: "PingFangSC-Medium,PingFang SC;", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  width: 100%;
  min-height: 100%;
  font-size: 0.14rem;
  /* overflow: hidden; */
}
* {
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
}
</style>
