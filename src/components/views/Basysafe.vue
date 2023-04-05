<template>
  <b-container>    
    <b-row>
      <b-col sm="3">
        <label label-for="btn-radios-estop">{{ $t('basysafe.estop') }}</label>
      </b-col>
      <b-col>
        <b-form-radio-group
          id="btn-radios-estop"              
          name="btn-radios-estop"
          v-model="states.estopbutton"
          buttons>
            <b-form-radio value="true" class="btn-success" @change="setEstopButtonState($event)" >{{ $t('basysafe.estopReleased') }}</b-form-radio>
            <b-form-radio value="false" class="btn-danger" @change="setEstopButtonState($event)">{{ $t('basysafe.estopPressed') }}</b-form-radio>
        </b-form-radio-group>
      </b-col>
    </b-row>
    
    <br/>

    <b-row>
      <b-col sm="3">
        <label>{{ $t('basysafe.safetylightcurtain') }}</label>
      </b-col>
      <b-col>
        <b-form-radio-group
          id="btn-radios-safetylightcurtain"       
          name="btn-radios-safetylightcurtain"
          v-model="states.safetylightcurtain"
          buttons>
            <b-form-radio value="true" class="btn-success" @change="setSafetyLightCurtainState($event)" >{{ $t('basysafe.safetylightcurtainFree') }}</b-form-radio>
            <b-form-radio value="false" class="btn-danger" @change="setSafetyLightCurtainState($event)">{{ $t('basysafe.safetylightcurtainDetection') }}</b-form-radio>
        </b-form-radio-group>
      </b-col>
    </b-row>
    
    <br/>

    <b-row>
      <b-col sm="3">
        <label>{{ $t('basysafe.initiator') }}</label>
      </b-col>
      <b-col>
        <b-form-radio-group
          id="btn-radios-initiator"       
          name="btn-radios-initiator"
          v-model="states.initiator"
          buttons>
            <b-form-radio value="false" @change="setInitiatorState($event)" >{{ $t('basysafe.initiatorFree') }}</b-form-radio>
            <b-form-radio value="true" @change="setInitiatorState($event)">{{ $t('basysafe.initiatorOccupied') }}</b-form-radio>
        </b-form-radio-group>
      </b-col>
    </b-row>
    
    <br/>

    <b-row>
      <b-col sm="3">
        <label>{{ $t('basysafe.ack') }}</label>
      </b-col>
      <b-col>
        <b-button variant="info" @click="ackButton()" >{{ $t('basysafe.ackPressed') }}</b-button>       
      </b-col>
    </b-row>
    
    <br/>

    <b-row>
      <b-col sm="3">
        <label>{{ $t('basysafe.signalLights') }}</label>
      </b-col>
      <b-col>
        <b-form-radio-group
        id="btn-signalcolumn.red"       
        name="btn-signalcolumn.red"
        v-model="states.signalcolumn.red"
        buttons >
          <b-form-radio value="false" class="btn-danger" @change="setSignalColumnState()" >{{ $t('basysafe.lightOff') }}</b-form-radio>
          <b-form-radio value="true" class="btn-danger" @change="setSignalColumnState()">{{ $t('basysafe.lightOn') }}</b-form-radio>
          <!--
          <b-form-radio value="2" class="btn-danger" @change="setSignalColumnState()">{{ $t('basysafe.lightBlinking') }}</b-form-radio>
          -->
      </b-form-radio-group>      
      <br/>
      <b-form-radio-group
        id="btn-signalcolumn.yellow"       
        name="btn-signalcolumn.yellow"
        v-model="states.signalcolumn.yellow"
        buttons >        
          <b-form-radio value="false" class="btn-warning" @change="setSignalColumnState()" >{{ $t('basysafe.lightOff') }}</b-form-radio>
          <b-form-radio value="true" class="btn-warning" @change="setSignalColumnState()">{{ $t('basysafe.lightOn') }}</b-form-radio>
          <!--
          <b-form-radio value="2" class="btn-warning" @change="setSignalColumnState()">{{ $t('basysafe.lightBlinking') }}</b-form-radio>
          -->
      </b-form-radio-group>
      <br/>
      <b-form-radio-group
        id="btn-signalcolumn.white"       
        name="btn-signalcolumn.white"
        v-model="states.signalcolumn.white"
        buttons >
          <b-form-radio value="false" class="btn-light" @change="setSignalColumnState()" >{{ $t('basysafe.lightOff') }}</b-form-radio>
          <b-form-radio value="true" class="btn-light" @change="setSignalColumnState()">{{ $t('basysafe.lightOn') }}</b-form-radio>
          <!--
          <b-form-radio value="2" class="btn-light" @change="setSignalColumnState()">{{ $t('basysafe.lightBlinking') }}</b-form-radio>
          -->
      </b-form-radio-group>     
      <br/>
      <b-form-radio-group
        id="btn-signalcolumn.green"       
        name="btn-signalcolumn.green"
        v-model="states.signalcolumn.green"
        buttons >
          <b-form-radio value="0" class="btn-success" @change="setSignalColumnState()" >{{ $t('basysafe.lightOff') }}</b-form-radio>
          <b-form-radio value="1" class="btn-success" @change="setSignalColumnState()">{{ $t('basysafe.lightOn') }}</b-form-radio>
          <!--
          <b-form-radio value="2" class="btn-light" @change="setSignalColumnState()">{{ $t('basysafe.lightBlinking') }}</b-form-radio>
          -->
      </b-form-radio-group>
      </b-col>
    </b-row>

    <br/>

    <b-row>
      <b-col sm="3">
        <label>{{ $t('basysafe.press') }}</label>
      </b-col>
      <b-col>
        <b-form-radio-group
          id="btn-radios-press"       
          name="btn-radios-press"
          v-model="states.press.opmode"
          buttons>
            <b-form-radio value="retract" @change="simulateRetract()">{{ $t('basysafe.pressRetract') }}</b-form-radio>
            <b-form-radio value="press" @change="simulatePress()" >{{ $t('basysafe.pressPress') }}</b-form-radio>
        </b-form-radio-group>
      </b-col>
    </b-row>
    
    <br/>

    <b-row>
      <b-col sm="3">
        <label>{{ $t('basysafe.signalLightsYellowCommand') }}</label>
      </b-col>
      <b-col>
        <b-form-radio-group
          id="btn-radios-yellow-light"       
          name="btn-radios-yellow-light"
          buttons>
            <b-form-radio value="false"  @change="setYellowLight($event)">{{ $t('basysafe.lightOff') }}</b-form-radio>
            <b-form-radio value="true" class="btn-warning" @change="setYellowLight($event)" >{{ $t('basysafe.lightOn') }}</b-form-radio>
        </b-form-radio-group>
      </b-col>
    </b-row>

  </b-container>    
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';
import { createLogger, mapGetters } from 'vuex';
import { Data, Methods, Computed, Props } from '@/interfaces/IBasysafe';

export default Vue.extend<Data, Methods, Computed, Props>({
  name: 'Basysafe',
  data() {
    return {      
      config: {
        press: {
          maxCounter: 50,
          freqHz: 10
        }
      },
      states: {
        estopbutton: true,
        safetylightcurtain: true,
        initiator: false,        
        signalcolumn: {
          red: false,
          yellow: false,
          green: false,
          white: false
        },
        press: {
          counter: 0,
          opmode: "retract",
          state: "stopped"
        }
      },      
      topics: {
        statusSafetyLightCurtain: "basysafe/safetylightcurtain/status",
        statusSignalColumn: "basysafe/signalcolumn/status",
        statusInitiator: "basysafe/initiator/status",
        statusEstopButton: "basysafe/estopbutton/status",
        statusAckButton: "basysafe/ackbutton/status",
        statusPress: "basysafe/press/status",
        commandSignalColumn: "basysafe/signalcolumn/command"
      }
    };
  },
  methods: {
    ackButton: function () {
      console.log("ackButton: " );     
      var msg = {
        "timestamp": new Date().toISOString(),
        "status": true
      };
      this.$mqtt.publish(this.topics.statusAckButton, msg);
    
      setTimeout(()=> {
        var msg = {
          "timestamp": new Date().toISOString(),
          "status": false
        };
        this.$mqtt.publish(this.topics.statusAckButton, msg);
      }, 500);
    
    },
    setEstopButtonState: function (state) {
      console.log("setEstopButtonState: " + state); 
      var msg = {
        "timestamp": new Date().toISOString(),
        "status": state
      };
      this.$mqtt.publish(this.topics.statusEstopButton, msg);
    },
    setSafetyLightCurtainState: function (state) {
      console.log("setSafetyLightCurtainState: " + state); 
      var msg = {
        "timestamp": new Date().toISOString(),
        "status": state
      };
      this.$mqtt.publish(this.topics.statusSafetyLightCurtain, msg);
    },
    setInitiatorState: function(state) {
      console.log("setInitiatorState: " + state);     
      var msg = {
        "timestamp": new Date().toISOString(),
        "status": state
      };
      this.$mqtt.publish(this.topics.statusInitiator, msg);
    },
    setSignalColumnState: function() {
      console.log("setSignalColumnState: " + JSON.stringify(this.states.signalcolumn)); 
      var msg = {
        "timestamp": new Date().toISOString(),
        "red": this.states.signalcolumn.red,
        "yellow": this.states.signalcolumn.yellow,
        "green": this.states.signalcolumn.green,
        "white": this.states.signalcolumn.white,
      };
      this.$mqtt.publish(this.topics.statusSignalColumn, msg);
    },    
    setYellowLight: function (state) {
      console.log("setYellowLight: " + state); 
      var msg = {
        "timestamp": new Date().toISOString(),
        "status": state
      };
      this.$mqtt.publish(this.topics.commandSignalColumn, msg);
    },
    simulatePress: async function() {
      console.log("simulatePress: "); 
      
      var msg = {
        "timestamp": new Date().toISOString(),
        "counter": Number(this.states.press.counter),
        "opmode": "press",
        "state": "starting"
      };

      this.$mqtt.publish(this.topics.statusPress, msg);
      await new Promise(resolve => setTimeout(resolve, 1000));
      msg.state = "execute";

      while (this.states.press.counter < this.config.press.maxCounter
       && this.states.estopbutton && this.states.safetylightcurtain) {         
        this.states.press.counter += 1;      
        console.log("counter: ",  this.states.press.counter); 

        msg.timestamp = new Date().toISOString();
        msg.counter = this.states.press.counter;        
        this.$mqtt.publish(this.topics.statusPress, msg);
        await new Promise(resolve => setTimeout(resolve, 1000/this.config.press.freqHz));
      }
      
      if (this.states.press.counter == this.config.press.maxCounter) {
        console.log("counter finally: ",  this.states.press.counter); 
        msg.state = "completing";
        this.$mqtt.publish(this.topics.statusPress, msg);        
        await new Promise(resolve => setTimeout(resolve, 1000));
        msg.state = "complete";
        this.$mqtt.publish(this.topics.statusPress, msg);
      }
    },
    simulateRetract: async function() {
      console.log("simulateRetract: "); 
      
      var msg = {
        "timestamp": new Date().toISOString(),
        "counter": Number(this.states.press.counter),
        "opmode": "retract",
        "state": "starting"
      };

      this.$mqtt.publish(this.topics.statusPress, msg);
      await new Promise(resolve => setTimeout(resolve, 1000));
      msg.state = "execute";

      while (this.states.press.counter > 0
       && this.states.estopbutton && this.states.safetylightcurtain) {         
        this.states.press.counter -= 1;      
        console.log("counter: ",  this.states.press.counter); 

        msg.timestamp = new Date().toISOString();
        msg.counter = this.states.press.counter;        
        this.$mqtt.publish(this.topics.statusPress, msg);
        await new Promise(resolve => setTimeout(resolve, 1000/this.config.press.freqHz));
      }
      
      if (this.states.press.counter == 0) {
        console.log("counter finally: ",  this.states.press.counter); 
        msg.state = "completing";
        this.$mqtt.publish(this.topics.statusPress, msg);        
        await new Promise(resolve => setTimeout(resolve, 1000));
        msg.state = "complete";
        this.$mqtt.publish(this.topics.statusPress, msg);
      }

    }   
  } 
});
</script>

<style lang="scss"></style>
