<template>
  <nav>
    <ol class="breadcrumb">
      <li
        class="breadcrumb-item"
        v-for="item in items"
        :key="item.text"
        :class="{ active: item.active }"
        ><router-link :to="item.to" v-if="!item.active"> {{ item.text }}</router-link>
        <span v-else>{{ item.text }}</span></li
      >
    </ol>
  </nav>
</template>

<script lang="ts">
export default {
  name: 'Breadcrumb',
  props: {
    items: Object,
  },
};
</script>

<style>
</style>