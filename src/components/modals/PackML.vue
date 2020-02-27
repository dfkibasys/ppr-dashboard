<template>
  <b-modal @shown="initGraph" id="modal-pack" ref="modal" size="lg" title="BootstrapVue">
    <template v-slot:modal-header>
      <h5 class="modal-title">PackML Automaton</h5>
      <button class="btn btn-danger ml-3" id="stop-btn" type="button">Stop</button>
      <button class="btn btn-warning ml-3" id="reset-btn" type="button">Reset</button>

      <div class="btn-group btn-group-toggle ml-3 mode-group" data-toggle="buttons">
        <label class="btn btn-info active" data-mode="PRODUCTION" id="l_PRODUCTION">
          <input autocomplete="off" checked name="options" type="radio" /> PRODUCTION
        </label>
        <label class="btn btn-info" data-mode="CHANGE_OVER" id="l_CHANGE_OVER">
          <input autocomplete="off" name="options" type="radio" /> CHANGEOVER
        </label>
        <label class="btn btn-info" data-mode="SIMULATION" id="l_SIMULATION">
          <input autocomplete="off" name="options" type="radio" /> SIMULATION
        </label>
      </div>
    </template>

    <div class="mxgraph" ref="graphy" style="position:relative;overflow:auto;"></div>

    <template v-slot:modal-footer="{cancel}">
      <b-button @click="cancel" variant="secondary">{{$t("translation.modal_close")}}</b-button>
    </template>
  </b-modal>
</template>

<script>
import * as mxgraph from "mxgraph";
import axios from "axios";

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

export default {
  name: "PackML",
  data() {
    return {
      graph: Object,
      oldBorderColor: String,
      currentCell: Object,
      xmlLoaded: false
    };
  },
  props: {
    openedDevice: Object
  },
  methods: {
    initGraph: function() {
      let that = this;
      if (mxClient.isBrowserSupported()) {
        let div = this.$refs.graphy;
        axios.get("data/PackML.XML").then(resp => {
          let xml = resp.data;

          (container => {
            //let xml = mxUtils.getTextContent(container);
            let xmlDocument = mxUtils.parseXml(xml);

            //decode method needs access to the following window params (VueJS hack)
            window["mxGraphModel"] = mxGraphModel;
            window["mxGeometry"] = mxGeometry;

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

          this.markCurrentState(this.openedDevice.currentState);
          this.xmlLoaded = true;

        });
      }
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
        console.error("Current state '" + state + "' not found.");
        that.oldBorderColor = null;
      }
    }
  },
  mounted() {
  
    //this.initGraph();
    /*
                        let button = $(event.relatedTarget); // Button that triggered the modal
                        // Extract info from data-* attributes
                        let state = button.data('state');
                        openedIndex = button.data('index');

                        oldStyle = markCurrentState(state);

                        //set toggle buttons
                        $(".mode-group > label.active").removeClass("active");
                        $(".mode-group > label").addClass("disabled");

                        $("#l_" + viewModel.devices()[openedIndex].currentMode()).addClass('active').removeClass('disabled');

                        if (state === "STOPPED") {
                            $(".mode-group > label.disabled").removeClass("disabled");
                        }

                        //detect changes on currently opened instance for further UI updates
                        sub = ko.computed( () => {
                            return ko.toJSON(viewModel.devices()[openedIndex]);
                        }).subscribe( () => {
                            let unmapped = ko.mapping.toJS(viewModel.devices);
                            console.log("changed to ", unmapped[openedIndex].currentState);
                            graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, oldStyle, [currentCell]);
                            oldStyle = markCurrentState(unmapped[openedIndex].currentState);

                            //set toggle buttons
                            $(".mode-group > label.active").removeClass("active");
                            $(".mode-group > label").addClass("disabled");

                            $("#l_" + unmapped[openedIndex].currentMode).addClass('active').removeClass('disabled');

                            if (unmapped[openedIndex].currentState === "STOPPED") {
                                $(".mode-group > label.disabled").removeClass("disabled");
                            }
                        });
                        */
  },
  watch: {
      openedDevice: function(val){
          if (this.xmlLoaded){
            //set old cell border to previous color
            this.graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, this.oldBorderColor, [this.currentCell]);
            //set new cell border to red
            this.markCurrentState(val.currentState);
          }
      }
  }
};
</script>

<style scoped>
</style>