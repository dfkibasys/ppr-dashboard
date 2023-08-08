<template>
  <CModal
    name="modal-login"
    ref="loginModalRef"
    size="md"
    :title="$t('modal.login.title')"
    :show="show"
    @close="$emit('close')"
  >
    <template v-slot:body>
      <div class="input-group mb-2">
        <span class="input-group-text"><i class="bi bi-person"></i></span>
        <input
          type="text"
          class="form-control"
          :class="{ 'is-invalid': invalid }"
          id="input-username"
          :placeholder="$t('modal.login.username')"
          v-model="user"
          required
        />
      </div>

      <div class="input-group mb-2">
        <span class="input-group-text"><i class="bi bi-lock"></i></span>
        <input
          type="password"
          class="form-control"
          :class="{ 'is-invalid': invalid }"
          id="input-password"
          :placeholder="$t('modal.login.password')"
          v-model="password"
          required
        />
        <div class="invalid-feedback" id="input-password-feedback">
          {{ $t('modal.login.feedback') }}
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <button
        type="button"
        class="btn btn-secondary"
        @click="$emit('close')"
        data-bs-dismiss="modal"
        >{{ $t('modal.cancel') }}</button
      >
      <button type="button" class="btn btn-primary" @click="login">{{
        $t('modal.login.login')
      }}</button>
    </template>
  </CModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CModal from '../common/CModal.vue';

export default defineComponent({
  name: 'Login',
  components: { CModal },
  props: {
    show: Boolean,
  },
  data() {
    return {
      user: '',
      password: '',
      invalid: false,
    };
  },
  methods: {
    login() {
      this.$store
        .dispatch('users/loginUser', { user: this.user, password: this.password })
        .then(() => {
          this.invalid = false;
          console.log(`Login accepted`);
          this.$emit('close');
        })
        .catch(() => {
          this.invalid = true;
          console.log(`Login denied`);
        });
    },
  },
});
</script>

<style></style>
