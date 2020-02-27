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
      graph: ""
    };
  },
  props: {
    openedDevice: Object
  },
  methods: {
    testGraph() {
      // Checks if the browser is supported
      if (!mxClient.isBrowserSupported()) {
        // Displays an error message if the browser is not supported.
        mxUtils.error("Browser is not supported!", 200, false);
      }

      let container = document.getElementById("testgraph");

      let model = new mxGraphModel();
      let graph = new mxGraph(container, model);

      //var themes = new Object();
      //themes[Graph.prototype.defaultThemeName] = xhr[1].getDocumentElement();

      var data =
        '<mxGraphModel dx="759" dy="759" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" background="#ffffff" math="0" shadow="0"><root><mxCell id="2" value="Hello," vertex="1"><mxGeometry x="20" y="20" width="80" height="30" as="geometry"/></mxCell><mxCell id="3" value="World!" vertex="1"><mxGeometry x="200" y="150" width="80" height="30" as="geometry"/></mxCell><mxCell id="4" value="" edge="1" source="2" target="3"><mxGeometry relative="1" as="geometry"/></mxCell></root></mxGraphModel>';

      var codec = new mxCodec(doc);

      var elt = doc.documentElement.firstChild;
      var cells = [];

      while (elt != null) {
        console.log("elt:", elt);
        cells.push(codec.decodeCell(elt));
        elt = elt.nextSibling;
      }

      //mxCodec.prototype.insertIntoGraph = function(	cell	)
      console.log(cells);
      graph.addCells(cells);
      /*
                                // Gets the default parent for inserting new cells. This
                                // is normally the first child of the root (ie. layer 0).
                                var parent = graph.getDefaultParent();

                                // Adds cells to the model in a single step
                                model.beginUpdate();
                                try
                                {

                                    var xml = mxUtils.parseXml(data).documentElement;

                                    //var v1 = graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30);
                                   // var v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);
                                   // var e1 = graph.insertEdge(parent, null, '', v1, v2);
                                }
                                catch(e){
                                    console.log(e);
                                }
                                finally
                                {
                                    // Updates the display
                                   model.endUpdate();
                                }

                                //reverse
                                //var xml ='<root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="2" value="Hello," vertex="1" parent="1"><mxGeometry x="20" y="20" width="80" height="30" as="geometry"/> </mxCell><mxCell id="3" value="World!" vertex="1" parent="1"><mxGeometry x="200" y="150" width="80" height="30" as="geometry"/> </mxCell><mxCell id="4" value="" edge="1" parent="1" source="2" target="3"><mxGeometry relative="1" as="geometry"/></mxCell></root>';

                                let container2 = document.getElementById('modelgraph');

                                model.beginUpdate(); //oder ohne graph
                                try {
                                    var xml2 = '<mxGraphModel dx="759" dy="759" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" background="#ffffff" math="0" shadow="0"><root><mxCell id="2" value="Hello," vertex="1"><mxGeometry x="20" y="20" width="80" height="30" as="geometry"/></mxCell><mxCell id="3" value="World!" vertex="1"><mxGeometry x="200" y="150" width="80" height="30" as="geometry"/></mxCell><mxCell id="4" value="" edge="1" source="2" target="3"><mxGeometry relative="1" as="geometry"/></mxCell></root></mxGraphModel>';
                                    var xml = mxUtils.parseXml(xml2).documentElement;
                                    //Editor.setGraphXml(xml);
                                    this.setGraphXml(xml);
                                }
                                catch (e) {
                                    console.log(e);
                                }
                                finally {
                                    model.endUpdate();
                                }
                */
      /*
                var codec = new mxCodec(doc);


                var elt = doc.documentElement.firstChild;
                var cells = [];

                while (elt != null)
                {
                    console.log("elt:", elt);
                    cells.push(codec.decodeCell(elt));
                    elt = elt.nextSibling;
                }

                //mxCodec.prototype.insertIntoGraph = function(	cell	)
                console.log(cells);
                graph.addCells(cells);
*/
      /*
                let container2 = document.getElementById('modelgraph');
                let xml = mxUtils.getTextContent(container2);
                let xmlDocument = mxUtils.parseXml(xml);

                let codec = new mxCodec(xmlDocument);
                let node = xmlDocument.documentElement;

                mxUtils.popup(mxUtils.getPrettyXml(node), true);

                graph = new mxGraph(container2);

                codec.decode(node, graph.getModel());
*/
      //var encoder = new mxCodec();
      //var node = encoder.encode(graph.getModel());

      //mxUtils.popup(mxUtils.getPrettyXml(node), true);
    },
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
        });
      }
    },
    markCurrentState: function(state) {
      let that = this,
        currentCell;

      let vertices = that.graph.getChildCells(
        that.graph.getDefaultParent(),
        true,
        false
      );

      for (let i = 0; i < vertices.length; i++) {
        if (vertices[i].value === state) {
          currentCell = vertices[i];
        }
      }

      //change style of active state
      if (currentCell !== null) {
        let oldColor = that.graph.getCellStyle(currentCell)[
          mxConstants.STYLE_STROKECOLOR
        ];

        that.graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, "#F00", [
          currentCell
        ]);

        return oldColor;
      } else {
        console.error("Current state '" + state + "' not found.");
        return null;
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
  }
};
</script>

<style scoped>
</style>