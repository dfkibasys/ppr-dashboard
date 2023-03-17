<template>
  <div>
    <b-navbar type="light" variant="light">
      <b-navbar-brand href="#">
        <img src="@/assets/DFKI_Logo.png" class="mr-3" height="40" alt />
        <img src="@/assets/Logo_BaSys4_1024px-300x79.png" height="40" alt />
      </b-navbar-brand>

      <b-navbar-nav is-nav class="flex-row ml-auto">
        <b-link class="pr-3" to="/assets">{{ $t('navbar.assets') }}</b-link>
        <!-- <b-link class="pr-3" to="/services">{{ $t('navbar.services') }}</b-link>
        <b-link class="pr-3" to="/management">{{ $t('navbar.management') }}</b-link> -->
        <b-link class="pr-3" to="/processes">{{ $t('navbar.processes') }}</b-link>
        <b-link class="pr-3" to="/basysafe">{{ $t('navbar.basysafe') }}</b-link>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto pr-3">
        <b-button v-if="!authorized" size="sm" type="button" v-b-modal.modal-login>{{
          $t('navbar.login')
        }}</b-button>
        <b-nav-item-dropdown v-if="authorized" :text="user" right>
          <b-dropdown-item @click="openSettings">{{ $t('navbar.settings') }}</b-dropdown-item>
          <b-dropdown-item @click="signout" href="#">{{ $t('navbar.logout') }}</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar>
    <Licences />
    <Login />
    <Settings />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Licences from '@/components/modals/Licences.vue';
import Login from '@/components/modals/Login.vue';
import Settings from '@/components/modals/Settings.vue';
import { Data, Methods, Computed, Props } from '@/interfaces/INavbar';

export default Vue.extend<Data, Methods, Computed, Props>({
  name: 'Navbar',
  components: {
    Licences,
    Login,
    Settings,
  },
  computed: {
    user: function () {
      return this.$store.getters['users/currentUser'];
    },
    authorized: function () {
      return this.$store.getters['users/isAuthorized'];
    },
  },

  methods: {
    signout() {
      this.$store.dispatch('users/logoutUser');
    },
    openSettings() {
      this.$bvModal.show('modal-settings');
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
