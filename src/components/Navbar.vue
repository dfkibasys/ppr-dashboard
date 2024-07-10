<template>
  <div>
    <nav class="navbar navbar-light bg-light navbar-expand">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <img src="@/assets/DFKI_Logo.png" class="me-3" height="40" />
          <img src="@/assets/Logo_BaSys4_1024px-300x79.png" height="40" />
        </a>

        <ul class="navbar-nav">
          <router-link class="pe-3" to="/assets">{{ $t('navbar.assets') }}</router-link>
          <router-link class="pe-3" to="/processes">{{ $t('navbar.processes') }}</router-link>
          <router-link class="pe-3" v-if="basysafeEnabled" to="/basysafe">{{
            $t('navbar.basysafe')
          }}</router-link>
        </ul>
        <ul class="navbar-nav pe-3">
          <button
            v-if="!authorized"
            type="button"
            @click="showLoginModal = true"
            class="btn btn-secondary btn-sm"
            >{{ $t('navbar.login') }}</button
          >
          <li v-if="authorized" class="nav-item dropdown"
            ><a
              role="button"
              href="#"
              class="nav-link dropdown-toggle"
              id="dropdownMenuLink"
              data-bs-toggle="dropdown"
              >{{ user }}</a
            ><ul class="dropdown-menu dropdown-menu-right"
              ><li
                ><a
                  href="#"
                  data-bs-toggle="modal"
                  data-bs-target="#modal-settings"
                  class="dropdown-item"
                  >{{ $t('navbar.settings') }}</a
                ></li
              ><li
                ><a @click="signout" href="#" class="dropdown-item">{{
                  $t('navbar.logout')
                }}</a></li
              ></ul
            ></li
          ></ul
        >
      </div>
    </nav>
    <Licences />
    <Login :show="showLoginModal" @close="showLoginModal = false" />
    <Settings />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Licences from '@/components/modals/Licences.vue';
import Login from '@/components/modals/Login.vue';
import Settings from '@/components/modals/Settings.vue';
import getEnv from '@/helpers/env';

export default defineComponent({
  name: 'Navbar',
  components: {
    Licences,
    Login,
    Settings,
  },
  data() {
    return {
      showLoginModal: false,
    };
  },
  computed: {
    user: function (): string {
      return this.$store.getters['users/currentUser'];
    },
    authorized: function (): boolean {
      return this.$store.getters['users/isAuthorized'];
    },
    basysafeEnabled: function (): boolean {
      return getEnv('VITE_ENABLE_BASYSAFE_INTEGRATION') === 'true';
    },
  },

  methods: {
    signout() {
      this.$store.dispatch('users/logoutUser');
    },
  },
});
</script>

<style scoped lang="scss">
a {
  color: gray;
}
.router-link-active {
  color: darken(gray, 50%);
}
</style>
