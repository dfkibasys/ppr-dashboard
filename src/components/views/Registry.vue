<template>
  <div>
    <div id="json-root"></div>
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
  methods: {
    isArray(data) {
      return Object.prototype.toString.call(data) === '[object Array]';
    },
    addJSONtoDOM(root, element) {
      if (this.isArray(element)) {
        // Array
        for (let i = 0; i < element.length; i++) {
          const elementID = root + '-' + i;
          let div = document.createElement('div');
          div.id = elementID;
          div.classList.add('array');
          document.getElementById(root).appendChild(div);
          this.addJSONtoDOM(elementID, element[i]);
        }

        // Empty Array
        if (element.length == 0) {
          const elementID = root + '-emptyArray';
          let span = document.createElement('span');
          span.id = elementID;
          span.innerHTML = '[]';
          document.getElementById(root).appendChild(span);
        }
      } else if (typeof element === 'object') {
        // Object
        for (const attr in element) {
          const elementID = root + '-' + attr;
          let div = document.createElement('div');
          div.id = elementID;
          div.classList.add('object');
          div.innerHTML = `${attr}: `;
          document.getElementById(root).appendChild(div);

          if (element[attr] === null) element[attr] = 'null'; //workaround to trigger function call

          this.addJSONtoDOM(elementID, element[attr]);
        }
      } else {
        // (Empty) String, Boolean, Number, 'null'
        if (element === '') element = '""';

        const elementID = root + '-' + element;
        let span = document.createElement('span');
        span.id = elementID;
        span.innerHTML = element;
        document.getElementById(root).appendChild(span);
      }
    },
  },
  created() {
    axios.get(this.registryUrl).then((res) => {
      this.registry = res.data;
      this.addJSONtoDOM('json-root', this.registry);
    });
  },
};
</script>

<style lang="scss">
.array {
  width: 100%;
  background-color: rgb(197, 196, 196);
  div {
    margin-left: 2em;
  }
}
.object {
}
</style>
