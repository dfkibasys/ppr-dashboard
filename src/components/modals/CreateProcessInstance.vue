<template>
  <b-modal @ok="createInstance" id="modal-instance" size="md" title="Create Process Instance">
    <label for="businessKeyInput">Business Key</label>
    <b-form-input
      id="businessKeyInput"
      :state="keyState"
      required
      v-model="businessKey"
      placeholder="Enter Business Key"
      class="mb-2"
    ></b-form-input>
    <b-form-invalid-feedback id="input-live-feedback" class="mb-2">The business key is required.</b-form-invalid-feedback>

      <b-container class="p-0">
        <b-form-row class="mb-2" v-for="variable in processVariables" :key="variable.id">
          <b-col>
            <b-form-input v-model="variable.name" placeholder="Name"></b-form-input>
          </b-col>
          <b-col>
            <b-form-select v-model="variable.type" :options="typeOptions"></b-form-select>
          </b-col>
          <b-col>
            <b-form-input
              v-if="variable.type === 'string'"
              v-model="variable.value"
              placeholder="Value"
              :type="'text'"
            ></b-form-input>
            <b-form-input
              v-else-if="variable.type === 'integer'"
              v-model="variable.value"
              placeholder="Value"
              :type="'number'"
            ></b-form-input>
            <b-form-select
              v-else-if="variable.type === 'boolean'"
              v-model="variable.value"
              :options="boolOptions"
            ></b-form-select>
            <b-form-input :disabled="true" v-else></b-form-input>
          </b-col>
          <b-col cols="1">
            <b-button @click="deleteVariable(variable.id)" variant="danger">-</b-button>
          </b-col>
        </b-form-row>
      </b-container>

    <b-button @click="addVariable">Add Variable</b-button>

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
      businessKey: "",
      processVariables: [],
      processVariableID: 0,
      typeOptions: ["boolean", "string", "integer"],
      boolOptions: ["true", "false"]
    };
  },
  computed: {
    keyState() {
      return this.businessKey.length > 0 ? true : false;
    }
  },
  methods: {
    addVariable() {
      this.processVariables.push({
        id: this.processVariableID++,
        name: "",
        type: "",
        value: ""
      });
    },
    deleteVariable(id) {
      this.processVariables = this.processVariables.filter(pv => pv.id !== id);
    },
    createInstance() {
      axios
        .post(
          process.env.VUE_APP_AJAX_REQUEST_DOMAIN +
            "/process-definition/" +
            this.$route.params.pid +
            "/start",
          {
            businessKey: this.businessKey,
            variables: {}
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