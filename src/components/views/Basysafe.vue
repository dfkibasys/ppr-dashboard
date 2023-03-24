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
            <b-form-radio value="0" class="btn-success" @change="setEstopButtonState($event)" >{{ $t('basysafe.estopReleased') }}</b-form-radio>
            <b-form-radio value="1" class="btn-danger" @change="setEstopButtonState($event)">{{ $t('basysafe.estopPressed') }}</b-form-radio>
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
            <b-form-radio value="0" class="btn-success" @change="setSafetyLightCurtainState($event)" >{{ $t('basysafe.safetylightcurtainFree') }}</b-form-radio>
            <b-form-radio value="1" class="btn-danger" @change="setSafetyLightCurtainState($event)">{{ $t('basysafe.safetylightcurtainDetection') }}</b-form-radio>
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
            <b-form-radio value="0" @change="setInitiatorState($event)" >{{ $t('basysafe.initiatorFree') }}</b-form-radio>
            <b-form-radio value="1" @change="setInitiatorState($event)">{{ $t('basysafe.initiatorOccupied') }}</b-form-radio>
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
          <b-form-radio value="0" class="btn-danger" @change="setSignalColumnState()" >{{ $t('basysafe.lightOff') }}</b-form-radio>
          <b-form-radio value="1" class="btn-danger" @change="setSignalColumnState()">{{ $t('basysafe.lightOn') }}</b-form-radio>
          <b-form-radio value="2" class="btn-danger" @change="setSignalColumnState()">{{ $t('basysafe.lightBlinking') }}</b-form-radio>
      </b-form-radio-group>      
      <br/>
      <b-form-radio-group
        id="btn-signalcolumn.yellow"       
        name="btn-signalcolumn.yellow"
        v-model="states.signalcolumn.yellow"
        buttons >        
          <b-form-radio value="0" class="btn-warning" @change="setSignalColumnState()" >{{ $t('basysafe.lightOff') }}</b-form-radio>
          <b-form-radio value="1" class="btn-warning" @change="setSignalColumnState()">{{ $t('basysafe.lightOn') }}</b-form-radio>
          <b-form-radio value="2" class="btn-warning" @change="setSignalColumnState()">{{ $t('basysafe.lightBlinking') }}</b-form-radio>
      </b-form-radio-group>
      <br/>
      <b-form-radio-group
        id="btn-signalcolumn.white"       
        name="btn-signalcolumn.white"
        v-model="states.signalcolumn.white"
        buttons >
          <b-form-radio value="0" class="btn-light" @change="setSignalColumnState()" >{{ $t('basysafe.lightOff') }}</b-form-radio>
          <b-form-radio value="1" class="btn-light" @change="setSignalColumnState()">{{ $t('basysafe.lightOn') }}</b-form-radio>
          <b-form-radio value="2" class="btn-light" @change="setSignalColumnState()">{{ $t('basysafe.lightBlinking') }}</b-form-radio>
      </b-form-radio-group>     
      <br/>
      <b-form-radio-group
        id="btn-signalcolumn.green"       
        name="btn-signalcolumn.green"
        v-model="states.signalcolumn.green"
        buttons >
          <b-form-radio value="0" class="btn-success" @change="setSignalColumnState()" >{{ $t('basysafe.lightOff') }}</b-form-radio>
          <b-form-radio value="1" class="btn-success" @change="setSignalColumnState()">{{ $t('basysafe.lightOn') }}</b-form-radio>
          <b-form-radio value="2" class="btn-success" @change="setSignalColumnState()">{{ $t('basysafe.lightBlinking') }}</b-form-radio>
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
            <b-form-radio value="press" @change="simulatePress()" >{{ $t('basysafe.pressPress') }}</b-form-radio>
            <b-form-radio value="retract" @change="simulateRetract()">{{ $t('basysafe.pressRetract') }}</b-form-radio>
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
          maxCounter: 200,
          freqHz: 10
        }
      },
      states: {
        estopbutton: 0,
        safetylightcurtain: 0,
        initiator: 0,        
        signalcolumn: {
          red: 0,
          yellow: 0,
          green: 0,
          white: 0
        },
        press: {
          counter: 0,
          opmode: "retract",
          state: "stopped"
        }
      },      
      topics: {
        safetylightcurtain: "basysafe/safetylightcurtain/status",
        signalcolumn: "basysafe/signalcolumn/status",
        initiator: "basysafe/initiator/status",
        estopbutton: "basysafe/estopbutton/status",
        ackbutton: "basysafe/ackbutton/status",
        press: "basysafe/press/status",
      }
    };
  },
  methods: {
    ackButton: function () {
      console.log("ackButton: " );     
      var msg = {
        "timestamp": new Date().toISOString(),
        "status": Number(1)
      };
      this.$mqtt.publish(this.topics.ackbutton, msg);
      setTimeout(()=> {
        var msg = {
          "timestamp": new Date().toISOString(),
          "status": Number(0)
        };
        this.$mqtt.publish(this.topics.ackbutton, msg);
      }, 500);
    },
    setEstopButtonState: function (state) {
      console.log("setEstopButtonState: " + state); 
      var msg = {
        "timestamp": new Date().toISOString(),
        "status": Number(state)
      };
      this.$mqtt.publish(this.topics.estopbutton, msg);
    },
    setSafetyLightCurtainState: function (state) {
      console.log("setSafetyLightCurtainState: " + state); 
      var msg = {
        "timestamp": new Date().toISOString(),
        "status": !!Number(state)
      };
      this.$mqtt.publish(this.topics.safetylightcurtain, msg);
    },
    setInitiatorState: function(state) {
      console.log("setInitiatorState: " + state);     
      var msg = {
        "timestamp": new Date().toISOString(),
        "status": !!Number(state)
      };
      this.$mqtt.publish(this.topics.initiator, msg);
    },
    setSignalColumnState: function() {
      console.log("setSignalColumnState: "); 
      var msg = {
        "timestamp": new Date().toISOString(),
        "red": Number(this.states.signalcolumn.red),
        "yellow": Number(this.states.signalcolumn.yellow),
        "green": Number(this.states.signalcolumn.green),
        "white": Number(this.states.signalcolumn.white),
      };
      this.$mqtt.publish(this.topics.signalcolumn, msg);
    },
    simulatePress: async function() {
      console.log("simulatePress: "); 
      
      var msg = {
        "timestamp": new Date().toISOString(),
        "counter": Number(this.states.press.counter),
        "opmode": "press",
        "state": "starting"
      };

      this.$mqtt.publish(this.topics.press, msg);
      await new Promise(resolve => setTimeout(resolve, 1000));
      msg.state = "execute";

      while (this.states.press.counter < this.config.press.maxCounter
       && this.states.estopbutton == 0 
       && this.states.safetylightcurtain == 0) {         
        this.states.press.counter += 1;      
        console.log("counter: ",  this.states.press.counter); 

        msg.timestamp = new Date().toISOString();
        msg.counter = this.states.press.counter;        
        this.$mqtt.publish(this.topics.press, msg);
        await new Promise(resolve => setTimeout(resolve, 1000/this.config.press.freqHz));
      }
      
      if (this.states.press.counter == this.config.press.maxCounter) {
        console.log("counter finally: ",  this.states.press.counter); 
        msg.state = "completing";
        this.$mqtt.publish(this.topics.press, msg);        
        await new Promise(resolve => setTimeout(resolve, 1000));
        msg.state = "complete";
        this.$mqtt.publish(this.topics.press, msg);
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

      this.$mqtt.publish(this.topics.press, msg);
      await new Promise(resolve => setTimeout(resolve, 1000));
      msg.state = "execute";

      while (this.states.press.counter > 0
       && this.states.estopbutton == 0 
       && this.states.safetylightcurtain == 0) {         
        this.states.press.counter -= 1;      
        console.log("counter: ",  this.states.press.counter); 

        msg.timestamp = new Date().toISOString();
        msg.counter = this.states.press.counter;        
        this.$mqtt.publish(this.topics.press, msg);
        await new Promise(resolve => setTimeout(resolve, 1000/this.config.press.freqHz));
      }
      
      if (this.states.press.counter == 0) {
        console.log("counter finally: ",  this.states.press.counter); 
        msg.state = "completing";
        this.$mqtt.publish(this.topics.press, msg);        
        await new Promise(resolve => setTimeout(resolve, 1000));
        msg.state = "complete";
        this.$mqtt.publish(this.topics.press, msg);
      }

    }   
  } 
});
</script>

<style lang="scss"></style>
