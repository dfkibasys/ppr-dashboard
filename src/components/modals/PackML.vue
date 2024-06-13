<template>
  <CModal name="modal-pack" ref="packModalRef" size="lg">
    <template v-slot:header>
      <h5 class="modal-title">{{ $t('modal.packML.title') }}</h5>
      <div>
        <button
          type="button"
          class="btn btn-danger btn-sm me-1"
          @click="stopButton"
          :disabled="!isAuthorized"
          >Stop</button
        >
        <button class="btn btn-warning btn-sm" @click="resetButton" :disabled="!isAuthorized"
          >Reset</button
        >
      </div>

      <div class="btn-group my-1" role="group">
        <span v-for="option in options" :key="option.value">
          <input
            type="radio"
            :value="option.value"
            class="btn-check"
            v-model="selected"
            name="btnradio"
            :id="option.value"
            :disabled="!isAuthorized"
            :checked="selected === option.value"
            @change="modeButton(option.value)"
          />
          <label class="btn btn-outline-info btn-sm" :for="option.value">{{ option.text }}</label>
        </span>
      </div>
    </template>

    <template v-slot:body>
      <div class="maxgraph" ref="graphy" style="position: relative; overflow: auto"></div>
    </template>

    <template v-slot:footer>
      <div class="me-auto">
        <span class="me-1">{{ $t('modal.packML.occupationState') }}: {{ asset?.OCCST }}</span>
        <span v-if="asset?.OCCST !== 'FREE'" class="mr-2">({{ asset?.OCCUPIER }})</span>
        <span v-if="isAuthorized">
          <button
            type="button"
            class="btn btn-info btn-sm"
            v-if="asset?.OCCST === 'FREE'"
            @click="occupyButton"
            >Occupy ({{ currentUser }})</button
          >
          <button
            type="button"
            class="btn btn-info btn-sm"
            v-if="
              (asset?.OCCST === 'PRIORITY' || asset?.OCCST === 'OCCUPIED') &&
              asset?.OCCUPIER === currentUser
            "
            @click="freeButton"
            >Free ({{ currentUser }})</button
          >
          <button
            type="button"
            class="btn btn-info btn-sm"
            v-if="asset?.OCCST === 'OCCUPIED' && asset?.OCCUPIER !== currentUser"
            @click="prioButton"
            >Prio ({{ currentUser }})</button
          >
        </span>
      </div>
      <div class="mr-auto">
        <span class="mr-1">{{ $t('modal.packML.operationMode') }}: {{ asset?.OPMODE }}</span>
      </div>
      <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">{{
        $t('modal.close')
      }}</button>
    </template>
  </CModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Client, Graph, xmlUtils, Codec, GraphDataModel, Geometry } from '@maxgraph/core';
import axios from 'axios';
import { mapGetters } from 'vuex';
import OperationModeOptions from '@/types/OperationModeOptions';
import { Asset } from '@/types/AssetsState';
import CModal from '../common/CModal.vue';

export default defineComponent({
  name: 'PackML',
  components: { CModal },
  data() {
    return {
      graph: {},
      oldBorderColor: '',
      currentCell: {},
      xmlLoaded: false,
      selected: 'SIMULATE',
      options: [
        { text: 'AUTOMATIC', value: 'AUTO', disabled: false },
        //{ text: 'SEMI-AUTOMATIC', value: 'SEMIAUTO', disabled: false },
        { text: 'SIMULATE', value: 'SIMULATE', disabled: false },
      ] as OperationModeOptions[],
    };
  },
  props: {
    openedAssetId: String,
  },
  computed: {
    ...mapGetters('users', {
      currentUser: 'currentUser',
      isAuthorized: 'isAuthorized',
    }),
    asset(): Asset {
      return this.$store.getters['assets/getAssetById'](this.openedAssetId);
    },
  },
  methods: {
    initGraph: function () {
      let that = this;
      if (Client.isBrowserSupported()) {
        let div = this.$refs.graphy;
        axios.get('data/PackML.XML').then((resp) => {
          let xml = resp.data;

          ((container: any) => {
            let xmlDocument = xmlUtils.parseXml(xml);

            //decode method needs access to the following window params (VueJS hack)
            (<any>window)['mxGraphModel'] = GraphDataModel;
            (<any>window)['mxGeometry'] = Geometry;

            if (
              xmlDocument.documentElement != null &&
              xmlDocument.documentElement.nodeName == 'mxGraphModel'
            ) {
              let codec = new Codec(xmlDocument);
              let node = xmlDocument.documentElement;

              container.innerHTML = '';

              that.graph = new Graph(container);
              that.graph.setTooltips(true);
              that.graph.setEnabled(false);

              // Changes the default style for edges "in-place"
              let style = that.graph.getStylesheet().getDefaultEdgeStyle();
              style.verticalAlign = "top";

              codec.decode(node, that.graph.getDataModel());

              //zoom out to fit the modal size (leads to display errors on tablet)
              that.graph.zoomFactor = 1.15;
              that.graph.zoomOut();
            }
          })(div);

          if (this.asset.EXST) this.markCurrentState(this.asset.EXST);
          this.xmlLoaded = true;
        });
      }
      this.setModeButton();
    },
    markCurrentState: function (state: string) {
      let that = this;

      let vertices = that.graph.getChildCells(that.graph.getDefaultParent(), true, false);

      for (let i = 0; i < vertices.length; i++) {
        if (vertices[i].value === state) {
          that.currentCell = vertices[i];
        }
      }

      //change style of active state and save color for updates
      if (that.currentCell !== null) {
        that.oldBorderColor = that.graph.getCellStyle(that.currentCell).strokeColor;

        that.graph.setCellStyles('strokeColor', '#F00', [that.currentCell]);
      } else {
        console.error(`Current state ${state} not found.`);
        that.oldBorderColor = '';
      }
    },
    clear: function () {
      this.xmlLoaded = false;
    },
    setModeButton: function () {
      if (this.asset.EXMODE) this.selected = this.asset.EXMODE;

      //avoid mode switching when not in stopped state
      if (this.asset.EXST !== 'STOPPED') {
        this.options.map((val) => {
          if (val.value !== this.selected) {
            val.disabled = true;
          } else {
            val.disabled = false;
          }
        });
      } else {
        this.options.map((val) => {
          val.disabled = false;
        });
      }
    },
    stopButton: function () {
      axios
        .post(`${this.asset.CCInterfaceSubmodelEndpoint}/submodelElements/Operations/STOP/invoke`, [
          this.currentUser,
        ])
        .then((res) => {
          if (res.data === 'ACCEPTED') {
            console.log('Accepted');
          } else if (res.data === 'REJECTED') {
            console.log('Rejected');
          }
        });
    },
    resetButton: function () {
      axios
        .post(
          `${this.asset.CCInterfaceSubmodelEndpoint}/submodelElements/Operations/RESET/invoke`,
          [this.currentUser]
        )
        .then((res) => {
          if (res.data === 'ACCEPTED') {
            console.log('Accepted');
          } else if (res.data === 'REJECTED') {
            console.log('Rejected');
          }
        });
    },
    modeButton: function (value: string) {
      axios
        .post(
          `${this.asset.CCInterfaceSubmodelEndpoint}/submodelElements/Operations/${value}/invoke`,
          [this.currentUser]
        )
        .then((res) => {
          if (res.data === 'ACCEPTED') {
            console.log('Accepted');
          } else if (res.data === 'REJECTED') {
            console.log('Rejected');
          }
        });
    },
    freeButton: function () {
      axios
        .post(`${this.asset.CCInterfaceSubmodelEndpoint}/submodelElements/Operations/FREE/invoke`, [
          this.currentUser,
        ])
        .then((res) => {
          if (res.data === 'DONE') {
            this.asset.OCCST = 'FREE';
            this.asset.OCCUPIER = 'INIT';
          }
        });
    },
    occupyButton: function () {
      axios
        .post(
          `${this.asset.CCInterfaceSubmodelEndpoint}/submodelElements/Operations/OCCUPY/invoke`,
          [this.currentUser]
        )
        .then((res) => {
          if (res.data === 'DONE') {
            this.asset.OCCST = 'OCCUPIED';
            this.asset.OCCUPIER = this.currentUser;
          }
        });
    },
    prioButton: function () {
      axios
        .post(`${this.asset.CCInterfaceSubmodelEndpoint}/submodelElements/Operations/PRIO/invoke`, [
          this.currentUser,
        ])
        .then((res) => {
          if (res.data === 'DONE') {
            this.asset.OCCST = 'PRIORITY';
            this.asset.OCCUPIER = this.currentUser;
          }
        });
    },
  },
  watch: {
    asset: {
      deep: true,
      handler(val) {
        if (this.xmlLoaded) {
          this.setModeButton();

          //set state cell
          //set old cell border to previous color
          this.graph.setCellStyles('strokeColor', this.oldBorderColor, [
            this.currentCell,
          ]);
          //set new cell border to red
          this.markCurrentState(val.EXST);
        }
      },
    },
  },
  mounted() {
    const PackModal = document.getElementById('modal-pack');
    PackModal?.addEventListener('shown.bs.modal', this.initGraph);
    PackModal?.addEventListener('hide.bs.modal', this.clear);
  },

  beforeUnmount() {
    //TODO: Should also be executed when modal is hidden
    const PackModal = document.getElementById('modal-pack');
    PackModal?.removeEventListener('shown.bs.modal', this.initGraph);
    PackModal?.removeEventListener('hide.bs.modal', this.clear);
  },
});
</script>

<style scoped></style>
