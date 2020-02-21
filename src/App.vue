<template>
  <div id="app">
    <Navbar />
    <PageContent />

  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import PageContent from "./components/PageContent";

export default {
  name: 'App',
  components: {
    Navbar,
    PageContent
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
