<template>
  <b-modal id="modal-login" ref="modal" size="sm" title="Login">
    <b-input-group class="mb-2">
      <b-input-group-prepend>
        <b-icon-person font-scale="2" />
      </b-input-group-prepend>
      <b-form-input placeholder="Username" v-model="user" required />
    </b-input-group>

    <b-input-group>
      <b-input-group-prepend>
        <b-icon-lock font-scale="2" />
      </b-input-group-prepend>
      <b-form-input placeholder="Password" type="password" v-model="password" required />
    </b-input-group>

    <template #modal-footer="{ cancel }">
      <b-button @click="cancel">Cancel</b-button>
      <b-button variant="primary" @click="login">Login</b-button>
    </template>
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue';
import { Data, Methods, Computed, Props } from '@/interfaces/ILogin';

export default Vue.extend<Data, Methods, Computed, Props>({
  name: 'Login',
  data() {
    return {
      user: '',
      password: '',
    };
  },
  methods: {
    login() {
      console.log(`${this.user}:${this.password}`);
    },
  },
});
</script>

<style></style>
