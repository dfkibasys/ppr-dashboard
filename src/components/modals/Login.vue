<template>
  <b-modal id="modal-login" ref="modal" size="sm" :title="$t('modal.login.title')">
    <b-input-group class="mb-2">
      <b-input-group-prepend>
        <b-icon-person font-scale="2" />
      </b-input-group-prepend>
      <b-form-input
        id="input-username"
        :placeholder="$t('modal.login.username')"
        v-model="user"
        :state="userState"
        required
      />
    </b-input-group>

    <b-input-group>
      <b-input-group-prepend>
        <b-icon-lock font-scale="2" />
      </b-input-group-prepend>
      <b-form-input
        id="input-password"
        :placeholder="$t('modal.login.password')"
        type="password"
        v-model="password"
        :state="passwordState"
        required
      />
      <b-form-invalid-feedback id="input-password-feedback">
        {{ $t('modal.login.feedback') }}
      </b-form-invalid-feedback>
    </b-input-group>

    <template #modal-footer="{ cancel }">
      <b-button @click="cancel">{{ $t('modal.cancel') }}</b-button>
      <b-button variant="primary" @click="login">{{ $t('modal.login.login') }}</b-button>
    </template>
  </b-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Data, Methods, Computed, Props } from '@/interfaces/ILogin';

export default defineComponent({
  name: 'Login',
  data() {
    return {
      user: '',
      password: '',
      userState: null,
      passwordState: null,
    };
  },
  methods: {
    login() {
      this.$store
        .dispatch('users/loginUser', { user: this.user, password: this.password })
        .then(() => {
          this.userState = null;
          this.passwordState = null;
          console.log(`Login accepted`);
          this.$bvModal.hide('modal-login');
        })
        .catch(() => {
          this.userState = false;
          this.passwordState = false;
          console.log(`Login denied`);
        });
    },
  },
});
</script>

<style></style>
