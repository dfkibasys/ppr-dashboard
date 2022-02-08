<template>
  <div>
    <div id="json-root"></div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

const IMAGE_BLOB_LIMIT = 100;

export default {
  name: 'Registry',
  data() {
    return {
      registry: [],
    };
  },
  computed: {
    ...mapGetters('endpoints', {
      registryUrl: 'registryUrl',
    }),
    domain() {
      // get domain from e.g. https://domain:4001
      const a = this.registryUrl.split('//');
      const b = a[1].split(':');
      return b[0];
    },
  },
  methods: {
    isArray(data) {
      return Object.prototype.toString.call(data) === '[object Array]';
    },
    loadData(url = this.registryUrl) {
      axios.get(url).then((res) => {
        this.registry = res.data;
        // remove old data first in case of reloading
        document.getElementById('json-root').innerHTML = '';
        this.addJSONtoDOM('json-root', this.registry);
      });
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
          div.innerHTML = `<b>${attr}</b>: `;
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

        // Make AAS links interactable
        if (typeof element === 'string' && element.includes(this.domain)) {
          span.innerHTML = `<a href=".#${this.$router.currentRoute.path}/${encodeURIComponent(
            element
          )}">${element}</a>`;
        } else {
          span.innerHTML = element;
        }

        // Shorten Base64 Image Blob
        if (typeof element === 'string' && element.includes('data:image/png;base64')) {
          span.innerHTML = `${element.substring(0, IMAGE_BLOB_LIMIT)}...`;
        }

        document.getElementById(root).appendChild(span);
      }
    },
  },
  watch: {
    '$route.params.url': {
      handler: function (url) {
        this.loadData(url);
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.loadData(this.$route.params.url);
  },
};
</script>

<style lang="scss">
#json-root {
  word-wrap: break-word;
  width: 100%;
  background-color: rgb(238, 238, 238);
  padding: 1em;
  > .array {
    margin-bottom: 1em;
    padding: 1em 1em 1em 0em;
    background-color: rgb(197, 196, 196);
  }
  > .object,
  > .array {
    .array {
      background-color: rgb(212, 221, 252);
      margin-bottom: 1em;
    }
  }
  .array {
    div {
      margin-left: 1.5em;
    }
  }
  .object {
  }
}
</style>
