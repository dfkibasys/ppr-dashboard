<template>
  <div class="modal fade" id="modal-login" ref="modalRef" size="sm">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t('modal.login.title') }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
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
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{
            $t('modal.cancel')
          }}</button>
          <button type="button" class="btn btn-primary" @click="login">{{
            $t('modal.login.login')
          }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Modal } from 'bootstrap';
import { Data, Methods, Computed, Props } from '@/interfaces/ILogin';

export default defineComponent({
  name: 'Login',
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
          this.closeModal();
        })
        .catch(() => {
          this.invalid = true;
          console.log(`Login denied`);
        });
    },
  },
  setup() {
    const modalRef = ref(null);
    const closeModal = () => Modal.getInstance(modalRef.value)?.hide();
    return { modalRef, closeModal };
  },
});
</script>

<style></style>
