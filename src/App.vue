<template>
  <div id="app">
    <Navbar />
    <Devices />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import Devices from "./components/Devices";

export default {
  name: 'App',
  components: {
    Navbar,
    Devices
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  #margin-top: 60px;
}
</style>
