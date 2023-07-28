<template>
  <nav>
    <ol class="breadcrumb">
      <li
        class="breadcrumb-item"
        v-for="item in items"
        :key="item.text"
        :class="{ active: item.active }"
        ><router-link :to="item.to">{{ item.text }}</router-link></li
      >
    </ol>
  </nav>
</template>

<script>
export default {
  name: 'Breadcrumb',
  props: {
    items: Object,
  },
};
</script>

<style>
</style>