<template>
  <b-modal @shown="initGraph" @hide="clear" id="modal-pack" ref="modal" size="lg" title="PackML">
    <template v-slot:modal-header>
      <h5 class="modal-title">{{ $t('modal.packML.title') }}</h5>

      <div>
        <b-button
          variant="danger"
          size="sm"
          class="m-1"
          @click="stopButton"
          :disabled="!isAuthorized"
          >Stop</b-button
        >
        <b-button variant="warning" size="sm" @click="resetButton" :disabled="!isAuthorized"
          >Reset</b-button
        >
      </div>

      <b-form-group>
        <b-form-radio-group
          button-variant="info"
          id="btn-radios-1"
          v-model="selected"
          :options="options"
          buttons
          name="radios-btn-default"
          @change="modeButton"
          :disabled="!isAuthorized"
          class="my-1"
          size="sm"
        ></b-form-radio-group>
      </b-form-group>
    </template>

    <div class="mxgraph" ref="graphy" style="position: relative; overflow: auto"></div>

    <template v-slot:modal-footer="{ cancel }">
      <div class="mr-auto">
        <span class="mr-1">{{ $t('modal.packML.occupationState') }}: {{ asset.OCCST }}</span>
        <span v-if="asset.OCCST !== 'FREE'" class="mr-2">({{ asset.OCCUPIER }})</span>
        <span v-if="isAuthorized">
          <b-button v-if="asset.OCCST === 'FREE'" variant="info" size="sm" @click="occupyButton"
            >Occupy ({{ currentUser }})</b-button
          >
          <b-button
            v-if="
              (asset.OCCST === 'PRIORITY' || asset.OCCST === 'OCCUPIED') &&
              asset.OCCUPIER === currentUser
            "
            variant="info"
            size="sm"
            @click="freeButton"
            >Free ({{ currentUser }})</b-button
          >
          <b-button
            v-if="asset.OCCST === 'OCCUPIED' && asset.OCCUPIER !== currentUser"
            variant="info"
            size="sm"
            @click="prioButton"
            >Prio ({{ currentUser }})</b-button
          >
        </span>
      </div>
      <div class="mr-auto">
        <span class="mr-1">{{ $t('modal.packML.operationMode') }}: {{ asset.OPMODE }}</span>
      </div>
      <b-button @click="cancel" size="sm" variant="secondary">{{ $t('modal.close') }}</b-button>
    </template>
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue';
import * as mxgraph from 'mxgraph';
import axios from 'axios';
import { mapGetters } from 'vuex';
import { Data, Methods, Computed, Props } from '@/interfaces/IPackML';

const {
  mxClient,
  mxGraph,
  mxRubberband,
  mxUtils,
  mxEvent,
  mxCodec,
  mxConstants,
  mxGraphModel,
  mxGeometry,
} = mxgraph();

export default Vue.extend<Data, Methods, Computed, Props>({
  name: 'PackML',
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
      ],
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
    asset() {
      return this.$store.getters['assets/getAssetById'](this.openedAssetId);
    },
  },
  methods: {
    initGraph: function () {
      let that = this;
      if (mxClient.isBrowserSupported()) {
        let div = this.$refs.graphy;
        axios.get('data/PackML.XML').then((resp) => {
          let xml = resp.data;

          ((container: any) => {
            let xmlDocument = mxUtils.parseXml(xml);

            //decode method needs access to the following window params (VueJS hack)
            (<any>window)['mxGraphModel'] = mxGraphModel;
            (<any>window)['mxGeometry'] = mxGeometry;

            if (
              xmlDocument.documentElement != null &&
              xmlDocument.documentElement.nodeName == 'mxGraphModel'
            ) {
              let codec = new mxCodec(xmlDocument);
              let node = xmlDocument.documentElement;

              container.innerHTML = '';

              that.graph = new mxGraph(container);
              that.graph.setTooltips(true);
              that.graph.setEnabled(false);

              // Changes the default style for edges "in-place"
              let style = that.graph.getStylesheet().getDefaultEdgeStyle();
              style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;

              codec.decode(node, that.graph.getModel());

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
    markCurrentState: function (state) {
      let that = this;

      let vertices = that.graph.getChildCells(that.graph.getDefaultParent(), true, false);

      for (let i = 0; i < vertices.length; i++) {
        if (vertices[i].value === state) {
          that.currentCell = vertices[i];
        }
      }

      //change style of active state and save color for updates
      if (that.currentCell !== null) {
        that.oldBorderColor = that.graph.getCellStyle(that.currentCell)[
          mxConstants.STYLE_STROKECOLOR
        ];

        that.graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, '#F00', [that.currentCell]);
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
    modeButton: function (value) {
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
          this.graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, this.oldBorderColor, [
            this.currentCell,
          ]);
          //set new cell border to red
          this.markCurrentState(val.EXST);
        }
      },
    },
  },
});
</script>

<style scoped></style>
