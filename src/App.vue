<template>
  <div id="app">
    <Navbar />
    <vue-progress-bar></vue-progress-bar>
    <router-view></router-view>
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";

export default {
  name: "App",
  components: {
    Navbar
  },
  created() {
    this.$mqtt.connect();
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  $cardWidth: 500px;

  .cardContainer {
    padding-top: 10px;
    display: grid;
    grid-template-columns: $cardWidth;
    @media (min-width: 1010px) {
      grid-template-columns: $cardWidth $cardWidth;
    }
    @media (min-width: 1520px) {
      grid-template-columns: $cardWidth $cardWidth $cardWidth;
    }
    @media (min-width: 2030px) {
      grid-template-columns: $cardWidth $cardWidth $cardWidth $cardWidth;
    }

    justify-content: center;
    grid-gap: 10px;

    .card {
      background-color: lighten(#555555, 15%);
      color: white;

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

  .clickable-table {
    tr {
      cursor: pointer;
    }
  }
}
</style>
