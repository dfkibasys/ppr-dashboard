<template>
  <div id="app">
    <Navbar />
    <router-view></router-view>
  </div>
</template>



<script>
import Navbar from './components/Navbar.vue'

export default {
  name: 'App',
  components: {
    Navbar
  }
}
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  .cardContainer {
    .card {
      width: 500px;
      margin: 10px;
      float: left;
      background-color: lighten(#555555, 15%);
      color: white;
      text-align: left;

      .card-body {
        padding-left: 0;
        padding-right: 0;
        height: 145px;

        .image {
          align-self: center;

          img {
            max-height: 90px;
            max-width: 160px;
          }
        }

        .properties {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          a {
            color: #1fc8e3;
          }
        }
      }

    }
  }
}
</style>
