import Vue from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    $mqtt: any;
    $Progress: any;
  }
}
