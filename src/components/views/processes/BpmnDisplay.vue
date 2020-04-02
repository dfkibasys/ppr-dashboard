<template>
  <div ref="container" class="vue-bpmn-diagram-container"></div>
</template>

<script>
  import BpmnJS from 'bpmn-js/dist/bpmn-navigated-viewer.production.min.js';

  export default {
    name: 'bpmn-display',
    props: {
      url: {
        type: String,
      },
      xml: {
        type: String
      }
    },
    data: function() {
      return {
        diagramXML: null
      };
    },
    mounted: function () {
      var container = this.$refs.container;

      var self = this;

      this.bpmnViewer = new BpmnJS({
        container: container
      });

      this.bpmnViewer.on('import.done', function(event) {

        var error = event.error;
        var warnings = event.warnings;

        if (error) {
          self.$emit('error', error);
        } else {
          self.$emit('shown', warnings);
        }

        self.bpmnViewer.get('canvas').zoom('fit-viewport');
      });

      if (this.url) {
        this.fetchDiagram(this.url);
      }
      if (this.xml){ 
        this.diagramXML = this.xml;
      }
    },
    beforeDestroy: function() {
      this.bpmnViewer.destroy();
    },
    watch: {
      url: function(val) {
        this.$emit('loading');
        this.fetchDiagram(url);
      },
      xml: function(val){
        this.$emit('loading');
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
            self.$emit('error', err);
          });
      },
      getOverlays: function() {
        return this.bpmnViewer.get('overlays');
      }
    }
  };
</script>

<style>
  .vue-bpmn-diagram-container {
    height: 100%;
    width: 100%;
  }
</style>