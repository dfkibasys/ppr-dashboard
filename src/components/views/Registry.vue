<template>
  <div>
    <div :key="asset.idShort" v-for="asset in registry">
      <div class="asset">{{ asset }}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  name: 'Registry',
  computed: mapGetters(['registryUrl']),
  data() {
    return {
      registry: [],
    };
  },
  methods: {},
  created() {
    console.log(this.registryUrl);
    axios.get(this.registryUrl).then((res) => {
      this.registry = res.data;
    });
  },
};
</script>

<style>
.asset {
  width: 100%;
  background-color: rgb(197, 196, 196);
  margin-bottom: 3em;
}
</style>
