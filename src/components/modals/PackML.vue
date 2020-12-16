<template>
  <b-modal @shown="initGraph" @hide="clear" id="modal-pack" ref="modal" size="lg" title="PackML">
    <template v-slot:modal-header>
      <h5 class="modal-title">{{$t("modal.packML.title")}}</h5>

      <b-button variant="danger" @click="stopButton">Stop</b-button>
      <b-button variant="warning" @click="resetButton">Reset</b-button>

      <b-form-group>
        <b-form-radio-group
          button-variant="info"
          id="btn-radios-1"
          v-model="selected"
          :options="options"
          buttons
          name="radios-btn-default"
          @change="modeButton"
        ></b-form-radio-group>
      </b-form-group>
    </template>

    <div class="mxgraph" ref="graphy" style="position:relative;overflow:auto;"></div>

    <template v-slot:modal-footer="{cancel}">
      <b-button @click="cancel" variant="secondary">{{$t("modal.close")}}</b-button>
    </template>
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue';
import * as mxgraph from "mxgraph";
import axios from "axios";
import {mapGetters} from "vuex";
import { Data, Methods, Computed, Props } from "@/interfaces/IPackML"

const {
  mxClient,
  mxGraph,
  mxRubberband,
  mxUtils,
  mxEvent,
  mxCodec,
  mxConstants,
  mxGraphModel,
  mxGeometry
} = mxgraph();

export default Vue.extend<Data, Methods, Computed, Props>({
  name: "PackML",
  data() {
    return {
      graph: {},
      oldBorderColor: "",
      currentCell: {},
      xmlLoaded: false,
      selected: "PRODUCTION",
      options: [
        { text: "PRODUCTION", value: "PRODUCTION", disabled: false },
        { text: "CHANGEOVER", value: "CHANGEOVER", disabled: false },
        { text: "SIMULATION", value: "SIMULATION", disabled: false }
      ]
    };
  },
  props: {
    openedIdShort: String
  },
  computed: mapGetters(["allAssets"]),
  methods: {
    initGraph: function() {
      let that = this;
      if (mxClient.isBrowserSupported()) {
        let div = this.$refs.graphy;
        axios.get("data/PackML.XML").then(resp => {
          let xml = resp.data;

          ((container: any) => {

            let xmlDocument = mxUtils.parseXml(xml);

            //decode method needs access to the following window params (VueJS hack)
            (<any>window)["mxGraphModel"] = mxGraphModel;
            (<any>window)["mxGeometry"] = mxGeometry;

            if (
              xmlDocument.documentElement != null &&
              xmlDocument.documentElement.nodeName == "mxGraphModel"
            ) {
              let codec = new mxCodec(xmlDocument);
              let node = xmlDocument.documentElement;

              container.innerHTML = "";

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

          this.markCurrentState(this.allAssets[this.openedIdShort].EXST);
          this.xmlLoaded = true;
        });
      }
      this.setModeButton(this.allAssets);
    },
    markCurrentState: function(state) {
      let that = this;

      let vertices = that.graph.getChildCells(
        that.graph.getDefaultParent(),
        true,
        false
      );

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

        that.graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, "#F00", [
          that.currentCell
        ]);
      } else {
        console.error(`Current state ${state} not found.`);
        that.oldBorderColor = "";
      }
    },
    clear: function() {
      this.xmlLoaded = false;
    },
    setModeButton: function(allAssets){
        //set mode toggle button
        this.selected = allAssets[this.openedIdShort].EXMODE;

        //avoid mode switching when not in stopped state
        if (allAssets[this.openedIdShort].EXST !== "STOPPED") {
          this.options.map(val => {
            if (val.value !== this.selected) {
              val.disabled = true;
            } else {
              val.disabled = false;
            }
          });
        } else {
          this.options.map(val => {
            val.disabled = false;
          });
        }
    },
    stopButton: function() {
      axios.get(`${this.allAssets[this.openedIdShort].ControlComponentInterfaceSubmodelEndpoint}/operations/Stop`);
    },
    resetButton: function() {
      axios.get(`${this.allAssets[this.openedIdShort].ControlComponentInterfaceSubmodelEndpoint}/operations/Reset`);
    },
    modeButton: function(value) {
      // let msg = {
      //   eClass:
      //     "http://www.dfki.de/iui/basys/model/component#//ChangeModeRequest",
      //   componentId: this.allDevices[this.openedDeviceIndex].componentId,
      //   mode: value
      // };

      // this.$mqtt.publish("basys/components/command", msg);
    }
  },
  watch: {
    allAssets: 
    {
      deep: true,
      handler(val) {
        if (this.xmlLoaded) {

          this.setModeButton(val);

          //set state cell
          //set old cell border to previous color
          this.graph.setCellStyles(
            mxConstants.STYLE_STROKECOLOR,
            this.oldBorderColor,
            [this.currentCell]
          );
          //set new cell border to red
          this.markCurrentState(val[this.openedIdShort].EXST);
        }
    }
    }
  }
});
</script>

<style scoped>
</style>