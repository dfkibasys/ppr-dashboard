<template>
  <b-modal
    @ok="createInstance"
    :id="modalId"
    size="md"
    :title="$t('modal.createProcessInstance.title')"
  >
    <label for="businessKeyInput">{{ $t('modal.createProcessInstance.businessKey.label') }}</label>
    <b-form-input
      id="businessKeyInput"
      :state="keyState"
      required
      v-model="businessKey"
      :placeholder="$t('modal.createProcessInstance.businessKey.placeholder')"
      class="mb-2"
    ></b-form-input>
    <b-form-invalid-feedback id="input-live-feedback" class="mb-2">{{
      $t('modal.createProcessInstance.businessKey.feedback')
    }}</b-form-invalid-feedback>

    <b-container class="p-0">
      <b-form-row class="mb-2" v-for="variable in processVariables" :key="variable.id">
        <b-col>
          <b-form-input
            v-model="variable.name"
            :placeholder="$t('modal.createProcessInstance.variable.name')"
          ></b-form-input>
        </b-col>
        <b-col>
          <b-form-select
            v-model="variable.type"
            :options="typeOptions"
            placeholder="Type"
          ></b-form-select>
        </b-col>
        <b-col>
          <b-form-input
            v-if="variable.type === VarType.String"
            v-model="variable.value"
            :placeholder="$t('modal.createProcessInstance.variable.placeholder')"
            :type="'text'"
          ></b-form-input>
          <b-form-input
            v-else-if="variable.type === VarType.Long"
            v-model="variable.value"
            :placeholder="$t('modal.createProcessInstance.variable.placeholder')"
            :type="'number'"
          ></b-form-input>
          <b-form-select
            v-else-if="variable.type === VarType.Boolean"
            v-model="variable.value"
            :options="boolOptions"
          ></b-form-select>
          <b-form-input
            :disabled="true"
            v-else
            :placeholder="$t('modal.createProcessInstance.variable.placeholder')"
          ></b-form-input>
        </b-col>
        <b-col cols="1">
          <b-button @click="deleteVariable(variable.id)" variant="danger">-</b-button>
        </b-col>
      </b-form-row>
    </b-container>

    <b-button @click="addVariable">{{
      $t('modal.createProcessInstance.variable.button')
    }}</b-button>

    <template v-slot:modal-footer="{ ok, cancel }">
      <b-button @click="cancel">{{ $t('modal.createProcessInstance.dontCreate') }}</b-button>
      <b-button :disabled="!keyState" variant="success" @click="ok">{{
        $t('modal.createProcessInstance.create')
      }}</b-button>
    </template>
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';
import {
  Data,
  Methods,
  Computed,
  Props,
  VarType,
  ProcessVariable,
} from '@/interfaces/ICreateProcessInstance';

export default Vue.extend<Data, Methods, Computed, Props>({
  name: 'CreateProcessInstance',
  data() {
    return {
      modalId: 'modal-instance',
      businessKey: '',
      processVariables: [],
      processVariableID: 0,
      typeOptions: [VarType.Placeholder, VarType.Boolean, VarType.String, VarType.Long],
      boolOptions: ['true', 'false'],
    };
  },
  computed: {
    VarType() {
      return VarType;
    },
    keyState() {
      return this.businessKey.length > 0 ? true : false;
    },
  },
  methods: {
    addVariable() {
      this.processVariables.push({
        id: this.processVariableID++,
        name: '',
        type: VarType.Placeholder,
        value: '',
      });
    },
    deleteVariable(id) {
      this.processVariables = this.processVariables.filter((pv: ProcessVariable) => pv.id !== id);
    },
    createInstance() {
      //format processVariables
      let variables = {} as any;
      this.processVariables.forEach((v: ProcessVariable) => {
        variables[v.name] = {
          value: v.value,
          type: v.type,
          valueInfo: {},
        };
      });

      axios
        .post(
          `${process.env.VUE_APP_AJAX_REQUEST_DOMAIN}/process-definition/${this.$route.params.pid}/start`,
          {
            businessKey: this.businessKey,
            variables: variables,
          }
        )
        .then((res) => {
          this.$emit('process-started');
        });
    },
    checkFormVariables() {
      let that = this;
      that.processVariables = [];

      axios
        .get(
          `${process.env.VUE_APP_AJAX_REQUEST_DOMAIN}/process-definition/${this.$route.params.pid}/form-variables`
        )
        .then((res) => {
          let keys = Object.keys(res.data);
          keys.forEach((key) => {
            that.processVariables.push({
              id: that.processVariableID++,
              name: key,
              type: res.data[key].type,
              value: res.data[key].value,
            });
          });
        });
    },
  },
  mounted() {
    // update form variables (in case process definition version has changed)
    this.$root.$on('bv::modal::show', (bvEvent, modalId) => {
      if (modalId === this.modalId) {
        this.checkFormVariables();
      }
    });
  },
  beforeDestroy() {
    // remove ALL listeners for that event
    this.$root.$off('bv::modal::show');
  },
});
</script>

<style></style>
