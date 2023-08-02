<template>
  <div class="modal modal-md fade" :id="modalId" ref="createModalRef">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t('modal.createProcessInstance.title') }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <label for="input-business-key">{{
            $t('modal.createProcessInstance.businessKey.label')
          }}</label>
          <input
            class="form-control mb-2"
            id="input-business-key"
            :class="{ 'is-invalid': invalid }"
            :placeholder="$t('modal.createProcessInstance.businessKey.placeholder')"
            v-model="businessKey"
            required
          />
          <div class="invalid-feedback mb-2" id="input-business-key-feedback">{{
            $t('modal.createProcessInstance.businessKey.feedback')
          }}</div>

          <div class="container p-0">
            <div class="row mb-2" v-for="variable in processVariables" :key="variable.id">
              <div class="col">
                <input
                  class="form-control"
                  v-model="variable.name"
                  :placeholder="$t('modal.createProcessInstance.variable.name')"
                />
              </div>
              <div class="col">
                <select class="form-select" v-model="variable.type" placeholder="Type">
                  <option v-for="option in typeOptions" :value="option" :key="option">{{
                    option
                  }}</option></select
                >
              </div>
              <div class="col">
                <input
                  class="form-control"
                  v-if="variable.type === VarType.String"
                  v-model="variable.value"
                  :placeholder="$t('modal.createProcessInstance.variable.placeholder')"
                  :type="'text'"
                />
                <input
                  class="form-control"
                  v-else-if="variable.type === VarType.Long"
                  v-model="variable.value"
                  :placeholder="$t('modal.createProcessInstance.variable.placeholder')"
                  :type="'number'"
                />
                <select
                  class="form-select"
                  v-else-if="variable.type === VarType.Boolean"
                  v-model="variable.value"
                >
                  <option v-for="option in boolOptions" :value="option" :key="option">{{
                    option
                  }}</option></select
                >
                <input
                  class="form-control"
                  :disabled="true"
                  v-else
                  :placeholder="$t('modal.createProcessInstance.variable.placeholder')"
                />
              </div>
              <div class="col-1">
                <button type="button" class="btn btn-danger" @click="deleteVariable(variable.id)"
                  >-</button
                >
              </div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary" @click="addVariable">{{
            $t('modal.createProcessInstance.variable.button')
          }}</button>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{
              $t('modal.createProcessInstance.dontCreate')
            }}</button>
            <button
              type="button"
              class="btn btn-success"
              :disabled="invalid"
              @click="createInstance"
              >{{ $t('modal.createProcessInstance.create') }}</button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Modal } from 'bootstrap';
import axios from 'axios';
import getEnv from '@/helpers/env';
import { VarType, ProcessVariable } from '@/types/ProcessVariable';

export default defineComponent({
  name: 'CreateProcessInstance',
  setup() {
    const createModalRef = ref(null);
    const closeModal = () => Modal.getInstance(createModalRef.value)?.hide();
    return { createModalRef, closeModal };
  },
  data() {
    return {
      modalId: 'modal-instance',
      businessKey: '',
      processVariables: [] as ProcessVariable[],
      processVariableID: 0,
      typeOptions: [VarType.Placeholder, VarType.Boolean, VarType.String, VarType.Long],
      boolOptions: ['true', 'false'],
    };
  },
  computed: {
    VarType() {
      return VarType;
    },
    invalid() {
      return this.businessKey.length === 0 ? true : false;
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
    deleteVariable(id: number) {
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
          `${getEnv('VITE_AJAX_REQUEST_DOMAIN')}/process-definition/${
            this.$route.params.pid
          }/start`,
          {
            businessKey: this.businessKey,
            variables: variables,
          }
        )
        .then((res) => {
          this.$emit('process-started');
          this.closeModal();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    checkFormVariables() {
      let that = this;
      that.processVariables = [];

      axios
        .get(
          `${getEnv('VITE_AJAX_REQUEST_DOMAIN')}/process-definition/${
            this.$route.params.pid
          }/form-variables`
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
    const InstanceModal = document.getElementById(this.modalId);
    InstanceModal?.addEventListener('show.bs.modal', this.checkFormVariables);
  },
  beforeUnmount() {
    // remove listeners for that event
    //TODO: Should also be executed when modal is hidden
    const InstanceModal = document.getElementById(this.modalId);
    InstanceModal?.removeEventListener('show.bs.modal', this.checkFormVariables);
  },
});
</script>

<style></style>
