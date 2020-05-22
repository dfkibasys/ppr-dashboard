<template>
  <div ref="container" class="vue-bpmn-diagram-container"></div>
</template>

<script>
import BpmnJS from "bpmn-js/dist/bpmn-navigated-viewer.production.min.js";

export default {
  name: "bpmn-display",
  props: {
    url: {
      type: String
    },
    xml: {
      type: String
    }
  },
  data: function() {
    return {
      diagramXML: null,
      elementOverlays: []
    };
  },
  mounted: function() {
    var container = this.$refs.container;

    var self = this;

    this.bpmnViewer = new BpmnJS({
      container: container
    });

    this.bpmnViewer.on("import.done", function(event) {
      var error = event.error;
      var warnings = event.warnings;

      if (error) {
        self.$emit("error", error);
      } else {
        self.$emit("shown", warnings);
      }

      self.bpmnViewer.get("canvas").zoom("fit-viewport");
    });

    this.bpmnViewer.on("shape.added", function(event) {
      self.addBaSysLogo(event.element);
    });

    if (this.url) {
      this.fetchDiagram(this.url);
    }
    if (this.xml) {
      this.diagramXML = this.xml;
    }
  },
  beforeDestroy: function() {
    this.bpmnViewer.destroy();
  },
  watch: {
    url: function(val) {
      this.$emit("loading");
      this.fetchDiagram(url);
    },
    xml: function(val) {
      this.$emit("loading");
      this.diagramXML = this.xml;
    },
    diagramXML: function(val) {
      this.bpmnViewer.importXML(val);
    }
  },
  methods: {
    fetchDiagram: function(url) {
      var self = this;

      fetch(url)
        .then(function(response) {
          return response.text();
        })
        .then(function(text) {
          self.diagramXML = text;
        })
        .catch(function(err) {
          self.$emit("error", err);
        });
    },
    getOverlays: function() {
      return this.bpmnViewer.get("overlays");
    },
    addBaSysLogo: function(element) {
      let self = this;

      if (
        self.elementOverlays[element.id] !== undefined &&
        self.elementOverlays[element.id].length !== 0
      ) {
        for (let overlay in self.elementOverlays[element.id]) {
          self.getOverlays().remove(self.elementOverlays[element.id][overlay]);
        }
      }

      self.elementOverlays[element.id] = [];

      if (
        (typeof element.businessObject.$attrs["camunda:topic"] !== "undefined" &&
          element.businessObject.$attrs["camunda:topic"] === "BasysTask") ||
        (typeof element.businessObject.$attrs["camunda:modelerTemplate"] !== "undefined" &&
          element.businessObject.$attrs["camunda:modelerTemplate"].includes("de.dfki.cos.basys"))
      ) {
        self.elementOverlays[element.id].push(
          self.getOverlays().add(element, "badge", {
            position: {
              top: 6,
              right: 75
            },
            html: '<div class="basys-logo"></div>'
          })
        );
      }
    }
  }
};
</script>

<style lang="scss">
.vue-bpmn-diagram-container {
  height: 100%;
  width: 100%;
  .basys-logo {
    width: 70px;
    content: url("../../../assets/BaSys-Logo.png");
  }
}
</style>
