<template>

    <b-modal id="modal-pack" title="BootstrapVue" size="lg" ref="modal" @shown="initGraph" >
        <template v-slot:modal-header>
            <h5 class="modal-title">PackML Automaton</h5>
            <button type="button" id="stop-btn" class="btn btn-danger ml-3">Stop</button>
            <button type="button" id="reset-btn" class="btn btn-warning ml-3">Reset</button>

            <div class="btn-group btn-group-toggle ml-3 mode-group" data-toggle="buttons">
                <label class="btn btn-info active" data-mode="PRODUCTION" id="l_PRODUCTION">
                    <input type="radio" name="options" autocomplete="off" checked> PRODUCTION
                </label>
                <label class="btn btn-info" data-mode="CHANGE_OVER" id="l_CHANGE_OVER">
                    <input type="radio" name="options" autocomplete="off"> CHANGEOVER
                </label>
                <label class="btn btn-info" data-mode="SIMULATION" id="l_SIMULATION">
                    <input type="radio" name="options" autocomplete="off"> SIMULATION
                </label>
            </div>

        </template>

        <div ref="graphy" class="mxgraph" style="position:relative;overflow:auto;">&lt;mxGraphModel dx="759" dy="759"
            grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1"
            pageWidth="827" pageHeight="1169" background="#ffffff" math="0" shadow="0"&gt;&lt;root&gt;&lt;mxCell id="0"/&gt;&lt;mxCell
            id="1" parent="0"/&gt;&lt;mxCell id="23" value="Hold"
            style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;exitX=0.75;exitY=0;entryX=0.5;entryY=1;jettySize=auto;orthogonalLoop=1;"
            parent="1" source="2" target="8" edge="1"&gt;&lt;mxGeometry relative="1" as="geometry"/&gt;&lt;/mxCell&gt;&lt;mxCell
            id="26" value="SC"
            style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;exitX=1;exitY=0.5;entryX=0;entryY=0.5;jettySize=auto;orthogonalLoop=1;"
            parent="1" source="2" target="11" edge="1"&gt;&lt;mxGeometry relative="1" as="geometry"/&gt;&lt;/mxCell&gt;&lt;mxCell
            id="29" value="Suspend"
            style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;exitX=0.75;exitY=1;entryX=0.5;entryY=0;jettySize=auto;orthogonalLoop=1;"
            parent="1" source="2" target="12" edge="1"&gt;&lt;mxGeometry relative="1" as="geometry"/&gt;&lt;/mxCell&gt;&lt;mxCell
            id="2" value="EXECUTE" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;"
            parent="1" vertex="1"&gt;&lt;mxGeometry x="380" y="150" width="120" height="60" as="geometry"/&gt;&lt;/mxCell&gt;&lt;mxCell
            id="21" value="Unhold"
            style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;entryX=1;entryY=0.5;jettySize=auto;orthogonalLoop=1;"
            parent="1" source="3" target="5" edge="1"&gt;&lt;mxGeometry relative="1" as="geometry"/&gt;&lt;/mxCell&gt;&lt;mxCell
            id="3" value="HELD" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;"
            parent="1" vertex="1"&gt;&lt;mxGeometry x="380" y="40" width="120" height="60" as="geometry"/&gt;&lt;/mxCell&gt;&lt;mxCell
            id="31" value="Unsuspend"
            style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;exitX=0;exitY=0.5;entryX=1;entryY=0.5;jettySize=auto;orthogonalLoop=1;"
            parent="1" source="4" target="7" edge="1"&gt;&lt;mxGeometry relative="1" as="geometry"/&gt;&lt;/mxCell&gt;&lt;mxCell
            id="4" value="SUSPENDED" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;"
            parent="1" vertex="1"&gt;&lt;mxGeometry x="380" y="270" width="120" height="60" as="geometry"/&gt;&lt;/mxCell&gt;&lt;mxCell
            id="24" value="SC"
            style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;exitX=0.5;exitY=1;entryX=0.25;entryY=0;jettySize=auto;orthogonalLoop=1;"
            parent="1" source="5" target="2" edge="1"&gt;&lt;mxGeometry relative="1" as="geometry"/&gt;&lt;/mxCell&gt;&lt;mxCell
            id="5" value="UNHOLDING" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;"
            parent="1" vertex="1"&gt;&lt;mxGeometry x="180" y="40" width="120" height="60" as="geometry"/&gt;&lt;/mxCell&gt;&lt;mxCell
            id="25" value="SC"
            style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;exitX=1;exitY=0.5;entryX=0;entryY=0.5;jettySize=auto;orthogonalLoop=1;"
            parent="1" source="6" target="2" edge="1"&gt;&lt;mxGeometry relative="1" as="geometry"/&gt;&lt;/mxCell&gt;&lt;mxCell
            id="6" value="STARTING" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;"
            parent="1" vertex="1"&gt;&lt;mxGeometry x="180" y="150" width="120" height="60" as="geometry"/&gt;&lt;/mxCell&gt;&lt;mxCell
            id="40" value="SC"
            style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;exitX=0.5;exitY=0;entryX=0.183;entryY=1.033;entryPerimeter=0;jettySize=auto;orthogonalLoop=1;"
            parent="1" source="7" target="2" edge="1"&gt;&lt;mxGeometry relative="1" as="geometry"/&gt;&lt;/mxCell&gt;&lt;mxCell
            id="7" value="UNSUSPENDING" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;"
            parent="1" vertex="1"&gt;&lt;mxGeometry x="180" y="270" width="120" height="60" as="geometry"/&gt;&lt;/mxCell&gt;&lt;mxCell
            id="22" value="SC"
            style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;exitX=0;exitY=0.5;entryX=1;entryY=0.5;jettySize=auto;orthogonalLoop=1;"
            parent="1" source="8" target="3" edge="1"&gt;&lt;mxGeometry relative="1" as="geometry"/&gt;&lt;/mxCell&gt;&lt;mxCell
            id="8" value="HOLDING" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;"
            parent="1" vertex="1"&gt;&lt;mxGeometry x="570" y="40" width="120" height="60" as="geometry"/&gt;&lt;/mxCell&gt;&lt;mxCell
            id="33" value="Start"
            style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;exitX=1;exitY=0.5;entryX=0;entryY=0.5;jettySize=auto;orthogonalLoop=1;"
            parent="1" source="9" target="6" edge="1"&gt;&lt;mxGeometry relative="1" as="geometry"/&gt;&lt;/mxCell&gt;&lt;mxCell
            id="9" value="IDLE" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;"
            parent="1" vertex="1"&gt;&lt;mxGeometry x="20" y="150" width="120" height="60" as="geometry"/&gt;&lt;/mxCell&gt;&lt;mxCell
            id="32" value="SC"
            style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;exitX=0.5;exitY=0;entryX=0.5;entryY=1;jettySize=auto;orthogonalLoop=1;"
            parent="1" source="10" target="9" edge="1"&gt;&lt;mxGeometry relative="1" as="geometry"/&gt;&lt;/mxCell&gt;&lt;mxCell
            id="10" value="RESETTING" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;"
            parent="1" vertex="1"&gt;&lt;mxGeometry x="20" y="270" width="120" height="60" as="geometry"/&gt;&lt;/mxCell&gt;&lt;mxCell
            id="27" value="SC"
            style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;exitX=1;exitY=0.5;jettySize=auto;orthogonalLoop=1;"
            parent="1" source="11" target="15" edge="1"&gt;&lt;mxGeometry relative="1" as="geometry"/&gt;&lt;/mxCell&gt;&lt;mxCell
            id="11" value="COMPLETING" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;"
            parent="1" vertex="1"&gt;&lt;mxGeometry x="570" y="150" width="120" height="60" as="geometry"/&gt;&lt;/mxCell&gt;&lt;mxCell
            id="30" value="SC"
            style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;exitX=0;exitY=0.5;entryX=1;entryY=0.5;jettySize=auto;orthogonalLoop=1;"
            parent="1" source="12" target="4" edge="1"&gt;&lt;mxGeometry relative="1" as="geometry"/&gt;&lt;/mxCell&gt;&lt;mxCell
            id="12" value="SUSPENDING" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;"
            parent="1" vertex="1"&gt;&lt;mxGeometry x="570" y="270" width="120" height="60" as="geometry"/&gt;&lt;/mxCell&gt;&lt;mxCell
            id="35" value="Reset"
            style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;exitX=0.25;exitY=0;entryX=0.25;entryY=1;jettySize=auto;orthogonalLoop=1;"
            parent="1" source="13" target="10" edge="1"&gt;&lt;mxGeometry relative="1" as="geometry"/&gt;&lt;/mxCell&gt;&lt;mxCell
            id="13" value="STOPPED" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;"
            parent="1" vertex="1"&gt;&lt;mxGeometry x="20" y="417" width="120" height="60" as="geometry"/&gt;&lt;/mxCell&gt;&lt;mxCell
            id="36" value="SC"
            style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;exitX=0;exitY=0.5;jettySize=auto;orthogonalLoop=1;"
            parent="1" source="14" target="13" edge="1"&gt;&lt;mxGeometry relative="1" as="geometry"/&gt;&lt;/mxCell&gt;&lt;mxCell
            id="14" value="STOPPING" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;"
            parent="1" vertex="1"&gt;&lt;mxGeometry x="200" y="417" width="120" height="60" as="geometry"/&gt;&lt;/mxCell&gt;&lt;mxCell
            id="28" value="Reset"
            style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;exitX=0.5;exitY=1;entryX=0.5;entryY=1;jettySize=auto;orthogonalLoop=1;"
            parent="1" source="15" target="10" edge="1"&gt;&lt;mxGeometry relative="1" as="geometry"&gt;&lt;Array
            as="points"&gt;&lt;mxPoint x="790" y="350"/&gt;&lt;mxPoint x="80" y="350"/&gt;&lt;/Array&gt;&lt;/mxGeometry&gt;&lt;/mxCell&gt;&lt;mxCell
            id="15" value="COMPLETE" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;"
            parent="1" vertex="1"&gt;&lt;mxGeometry x="730" y="150" width="120" height="60" as="geometry"/&gt;&lt;/mxCell&gt;&lt;mxCell
            id="37" value="SC"
            style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;exitX=0;exitY=0.5;entryX=0.75;entryY=1;jettySize=auto;orthogonalLoop=1;"
            parent="1" source="16" target="13" edge="1"&gt;&lt;mxGeometry relative="1" as="geometry"&gt;&lt;Array
            as="points"&gt;&lt;mxPoint x="380" y="427"/&gt;&lt;mxPoint x="350" y="427"/&gt;&lt;mxPoint x="350" y="500"/&gt;&lt;mxPoint
            x="110" y="500"/&gt;&lt;/Array&gt;&lt;/mxGeometry&gt;&lt;/mxCell&gt;&lt;mxCell id="16" value="CLEARING"
            style="rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;" parent="1" vertex="1"&gt;&lt;mxGeometry
            x="380" y="417" width="120" height="60" as="geometry"/&gt;&lt;/mxCell&gt;&lt;mxCell id="38" value="Clear"
            style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;exitX=0;exitY=0.5;entryX=1;entryY=0.5;jettySize=auto;orthogonalLoop=1;"
            parent="1" source="17" target="16" edge="1"&gt;&lt;mxGeometry relative="1" as="geometry"/&gt;&lt;/mxCell&gt;&lt;mxCell
            id="17" value="ABORTED" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;"
            parent="1" vertex="1"&gt;&lt;mxGeometry x="570" y="417" width="120" height="60" as="geometry"/&gt;&lt;/mxCell&gt;&lt;mxCell
            id="39" value="SC"
            style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;exitX=0;exitY=0.5;entryX=1;entryY=0.5;jettySize=auto;orthogonalLoop=1;"
            parent="1" target="17" edge="1"&gt;&lt;mxGeometry relative="1" as="geometry"&gt;&lt;mxPoint x="730" y="447"
            as="sourcePoint"/&gt;&lt;/mxGeometry&gt;&lt;/mxCell&gt;&lt;mxCell id="18" value="ABORTING"
            style="rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;" parent="1" vertex="1"&gt;&lt;mxGeometry
            x="730" y="420" width="120" height="60" as="geometry"/&gt;&lt;/mxCell&gt;&lt;mxCell id="41" value="SC =
            State Change"
            style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;"
            vertex="1" parent="1"&gt;&lt;mxGeometry x="20" y="60" width="130" height="20" as="geometry"/&gt;&lt;/mxCell&gt;&lt;mxCell
            id="47" value="Abort"
            style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;exitX=0.919;exitY=1.012;jettySize=auto;orthogonalLoop=1;exitPerimeter=0;"
            edge="1" parent="1" source="43" target="18"&gt;&lt;mxGeometry relative="1" as="geometry"/&gt;&lt;/mxCell&gt;&lt;mxCell
            id="48" value="Stop"
            style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;entryX=0.5;entryY=0;jettySize=auto;orthogonalLoop=1;exitX=0.294;exitY=1;exitPerimeter=0;"
            edge="1" parent="1" source="43" target="14"&gt;&lt;mxGeometry relative="1" as="geometry"&gt;&lt;mxPoint
            x="260" y="380" as="sourcePoint"/&gt;&lt;/mxGeometry&gt;&lt;/mxCell&gt;&lt;mxCell id="43" value=""
            style="rounded=1;arcSize=10;dashed=1;strokeColor=#000000;fillColor=none;gradientColor=none;dashPattern=8 3 1
            3;strokeWidth=2;" vertex="1" parent="1"&gt;&lt;mxGeometry x="10" y="30" width="850" height="338"
            as="geometry"/&gt;&lt;/mxCell&gt;&lt;/root&gt;&lt;/mxGraphModel&gt;
        </div>

        <template v-slot:modal-footer={cancel}>
            <b-button variant="secondary" @click="cancel">
                {{$t("translation.modal_close")}}
            </b-button>
        </template>

    </b-modal>

</template>

<script>
    import * as mxgraph from 'mxgraph';
    import Vue from 'vue'

    const {
        mxClient, mxGraph, mxRubberband, mxUtils, mxEvent, mxCodec, mxConstants, mxGraphModel, mxGeometry
    } = mxgraph();


    export default {
        name: "PackML",
        data() {
            return {
                graph: ""
            }
        },
        props: {
            openedDevice: Object,
        },
        methods: {
            testGraph() {
                // Checks if the browser is supported
                if (!mxClient.isBrowserSupported()) {
                    // Displays an error message if the browser is not supported.
                    mxUtils.error('Browser is not supported!', 200, false);
                }

                let container = document.getElementById('testgraph');

                let model = new mxGraphModel();
                let graph = new mxGraph(container, model);

                //var themes = new Object();
                //themes[Graph.prototype.defaultThemeName] = xhr[1].getDocumentElement();


                var data = '<mxGraphModel dx="759" dy="759" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" background="#ffffff" math="0" shadow="0"><root><mxCell id="2" value="Hello," vertex="1"><mxGeometry x="20" y="20" width="80" height="30" as="geometry"/></mxCell><mxCell id="3" value="World!" vertex="1"><mxGeometry x="200" y="150" width="80" height="30" as="geometry"/></mxCell><mxCell id="4" value="" edge="1" source="2" target="3"><mxGeometry relative="1" as="geometry"/></mxCell></root></mxGraphModel>';

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
            initGraph: function () {
                let that = this;
                if (mxClient.isBrowserSupported()) {
                    let div = this.$refs.graphy;

                    (container => {
                        let xml = mxUtils.getTextContent(container);
                        let xmlDocument = mxUtils.parseXml(xml);

                        //decode method needs access to the following window params (VueJS hack)
                        window['mxGraphModel'] = mxGraphModel;
                        window['mxGeometry'] = mxGeometry;

                        if (xmlDocument.documentElement != null && xmlDocument.documentElement.nodeName == 'mxGraphModel') {
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

                }

                this.markCurrentState(this.openedDevice.currentState);

            },
            markCurrentState: function (state) {

                let that = this,
                    currentCell;

                let vertices = that.graph.getChildCells(that.graph.getDefaultParent(), true, false);

                for (let i = 0; i < vertices.length; i++) {
                    if (vertices[i].value === state) {
                        currentCell = vertices[i];
                    }
                }

                //change style of active state
                if (currentCell !== null) {

                    let oldColor = that.graph.getCellStyle(currentCell)[mxConstants.STYLE_STROKECOLOR];

                    that.graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, "#F00", [currentCell]);

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
        },
    };

</script>

<style scoped>

</style>