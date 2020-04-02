<template>
  <b-modal @ok="createInstance" id="modal-instance" size="md" title="Create Process Instance">
    <label for="businessKeyInput">Business Key</label>
    <b-form-input
      id="businessKeyInput"
      :state="keyState"
      required
      v-model="businessKey"
      placeholder="Enter Business Key"
    ></b-form-input>
    <b-form-invalid-feedback id="input-live-feedback">The business key is required.</b-form-invalid-feedback>
    <template v-slot:modal-footer="{ok, cancel}">
      <b-button @click="cancel">Don't create</b-button>
      <b-button :disabled="!keyState" variant="success" @click="ok">Create</b-button>
    </template>
  </b-modal>
</template>

<script>
import axios from "axios";

export default {
  name: "CreateProcessInstance",
  data() {
    return {
      businessKey: ""
    };
  },
  computed: {
    keyState() {
      return this.businessKey.length > 0 ? true : false;
    }
  },
  methods: {
    createInstance() {
      axios
        .post(
          process.env.VUE_APP_AJAX_REQUEST_DOMAIN +
            "/process-definition/" +
            this.$route.params.pid +
            "/start",
          {
            businessKey: this.businessKey,
            variables: {
                
            }
          }
        )
        .then(res => {
          console.log("started", res);
        });
    }
  }
};
</script>

<style>
</style>