<template>
  <div class="container">
    <div class="row">
      <div class="col-3">
        <label label-for="btn-radios-estop">{{ $t('basysafe.estop') }}</label>
      </div>
      <div class="col">
        <div id="btn-radios-estop" class="btn-group" role="group">
          <input
            type="radio"
            id="estop-1"
            value="true"
            class="btn-check"
            v-model="states.estopbutton"
            name="btn-radios-estop"
            @change="setEstopButtonState($event)"
          />
          <label class="btn btn-success" for="estop-1"> {{ $t('basysafe.estopReleased') }}</label>

          <input
            type="radio"
            id="estop-2"
            value="false"
            class="btn-check"
            v-model="states.estopbutton"
            name="btn-radios-estop"
            @change="setEstopButtonState($event)"
          />
          <label class="btn btn-danger" for="estop-2">{{ $t('basysafe.estopPressed') }}</label>
        </div>
      </div>
    </div>

    <br />

    <div class="row">
      <div class="col-3">
        <label>{{ $t('basysafe.safetylightcurtain') }}</label>
      </div>
      <div class="col">
        <div id="btn-radios-safetylightcurtain" class="btn-group" role="group">
          <input
            type="radio"
            id="safetylightcurtain-1"
            value="true"
            class="btn-check"
            v-model="states.safetylightcurtain"
            name="btn-radios-safetylightcurtain"
            @change="setSafetyLightCurtainState($event)"
          />
          <label class="btn btn-success" for="safetylightcurtain-1">
            {{ $t('basysafe.safetylightcurtainFree') }}</label
          >

          <input
            type="radio"
            id="essafetylightcurtaintop-2"
            value="false"
            class="btn-check"
            v-model="states.estopbutton"
            name="btn-radios-safetylightcurtain"
            @change="setSafetyLightCurtainState($event)"
          />
          <label class="btn btn-danger" for="safetylightcurtain-2">{{
            $t('basysafe.safetylightcurtainDetection')
          }}</label>
        </div>
      </div>
    </div>

    <br />

    <div class="row">
      <div class="col-3">
        <label>{{ $t('basysafe.initiator') }}</label>
      </div>
      <div class="col">
        <div id="btn-radios-initiator" class="btn-group" role="group">
          <input
            type="radio"
            id="initiator-1"
            value="false"
            class="btn-check"
            v-model="states.initiator"
            name="btn-radios-initiator"
            @change="setInitiatorState($event)"
          />
          <label class="btn btn-secondary" for="initiator-1">
            {{ $t('basysafe.initiatorFree') }}</label
          >

          <input
            type="radio"
            id="initiator-2"
            value="true"
            class="btn-check"
            v-model="states.initiator"
            name="btn-radios-initiator"
            @change="setInitiatorState($event)"
          />
          <label class="btn btn-secondary" for="initiator-2">{{
            $t('basysafe.initiatorOccupied')
          }}</label>
        </div>
      </div>
    </div>

    <br />

    <div class="row">
      <div class="col-3">
        <label>{{ $t('basysafe.ack') }}</label>
      </div>
      <div class="col">
        <button class="btn btn-info" @click="ackButton()">{{ $t('basysafe.ackPressed') }}</button>
      </div>
    </div>

    <br />

    <div class="row">
      <div class="col-3">
        <label>{{ $t('basysafe.signalLights') }}</label>
      </div>
      <div class="col">
        <div id="btn-radios-signalcolumn.red" class="btn-group" role="group">
          <input
            type="radio"
            id="signalcolumn.red-1"
            value="false"
            class="btn-check"
            v-model="states.signalcolumn.red"
            name="btn-radios-signalcolumn.red"
            @change="setSignalColumnState()"
          />
          <label class="btn btn-danger" for="signalcolumn.red-1">
            {{ $t('basysafe.lightOff') }}</label
          >

          <input
            type="radio"
            id="signalcolumn.red-2"
            value="true"
            class="btn-check"
            v-model="states.signalcolumn.red"
            name="btn-radios-signalcolumn.red"
            @change="setSignalColumnState()"
          />
          <label class="btn btn-danger" for="signalcolumn.red-2">{{
            $t('basysafe.lightOn')
          }}</label>
        </div>
        <br />

        <div id="btn-radios-signalcolumn.yellow" class="btn-group" role="group">
          <input
            type="radio"
            id="signalcolumn.yellow-1"
            value="false"
            class="btn-check"
            v-model="states.signalcolumn.yellow"
            name="btn-radios-signalcolumn.yellow"
            @change="setSignalColumnState()"
          />
          <label class="btn btn-warning" for="signalcolumn.yellow-1">
            {{ $t('basysafe.lightOff') }}</label
          >

          <input
            type="radio"
            id="signalcolumn.yellow-2"
            value="true"
            class="btn-check"
            v-model="states.signalcolumn.yellow"
            name="btn-radios-signalcolumn.yellow"
            @change="setSignalColumnState()"
          />
          <label class="btn btn-warning" for="signalcolumn.yellow-2">{{
            $t('basysafe.lightOn')
          }}</label>
        </div>

        <br />
        <div id="btn-radios-signalcolumn.white" class="btn-group" role="group">
          <input
            type="radio"
            id="signalcolumn.white-1"
            value="false"
            class="btn-check"
            v-model="states.signalcolumn.white"
            name="btn-radios-signalcolumn.white"
            @change="setSignalColumnState()"
          />
          <label class="btn btn-light" for="signalcolumn.white-1">
            {{ $t('basysafe.lightOff') }}</label
          >

          <input
            type="radio"
            id="signalcolumn.white-2"
            value="true"
            class="btn-check"
            v-model="states.signalcolumn.white"
            name="btn-radios-signalcolumn.white"
            @change="setSignalColumnState()"
          />
          <label class="btn btn-light" for="signalcolumn.white-2">{{
            $t('basysafe.lightOn')
          }}</label>
        </div>

        <br />

        <div id="btn-radios-signalcolumn.green" class="btn-group" role="group">
          <input
            type="radio"
            id="signalcolumn.green-1"
            value="false"
            class="btn-check"
            v-model="states.signalcolumn.green"
            name="btn-radios-signalcolumn.green"
            @change="setSignalColumnState()"
          />
          <label class="btn btn-success" for="signalcolumn.green-1">
            {{ $t('basysafe.lightOff') }}</label
          >

          <input
            type="radio"
            id="signalcolumn.green-2"
            value="true"
            class="btn-check"
            v-model="states.signalcolumn.green"
            name="btn-radios-signalcolumn.green"
            @change="setSignalColumnState()"
          />
          <label class="btn btn-success" for="signalcolumn.green-2">{{
            $t('basysafe.lightOn')
          }}</label>
        </div>
      </div>
    </div>

    <br />

    <div class="row">
      <div class="col-3">
        <label>{{ $t('basysafe.press') }}</label>
      </div>
      <div class="col">
        <div id="btn-radios-press" class="btn-group" role="group">
          <input
            type="radio"
            id="press-1"
            value="retract"
            class="btn-check"
            v-model="states.press.opmode"
            name="btn-radios-press"
            @change="simulateRetract()"
          />
          <label class="btn btn-secondary" for="press-1"> {{ $t('basysafe.pressRetract') }}</label>

          <input
            type="radio"
            id="press-2"
            value="press"
            class="btn-check"
            v-model="states.press.opmode"
            name="btn-radios-press"
            @change="simulatePress()"
          />
          <label class="btn btn-secondary" for="press-2">{{ $t('basysafe.pressPress') }}</label>
        </div>
      </div>
    </div>

    <br />

    <div class="row">
      <div class="col-3">
        <label>{{ $t('basysafe.signalLightsYellowCommand') }}</label>
      </div>
      <div class="col">
        <div id="btn-radios-yellow-light" class="btn-group" role="group">
          <input
            type="radio"
            id="yellow-light-1"
            value="false"
            class="btn-check"
            v-model="states.signalcolumn.yellow"
            name="btn-radios-yellow-light"
            @change="setYellowLight($event)"
          />
          <label class="btn btn-secondary" for="yellow-light-1">
            {{ $t('basysafe.lightOff') }}</label
          >

          <input
            type="radio"
            id="yellow-light-2"
            value="true"
            class="btn-check"
            v-model="states.signalcolumn.yellow"
            name="btn-radios-yellow-light"
            @change="setYellowLight($event)"
          />
          <label class="btn btn-warning" for="yellow-light-2">{{ $t('basysafe.lightOn') }}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Basysafe',
  data() {
    return {
      config: {
        press: {
          maxCounter: 50,
          freqHz: 10,
        },
      },
      states: {
        estopbutton: true,
        safetylightcurtain: true,
        initiator: false,
        signalcolumn: {
          red: false,
          yellow: false,
          green: false,
          white: false,
        },
        press: {
          counter: 0,
          opmode: 'retract',
          state: 'stopped',
        },
      },
      topics: {
        statusSafetyLightCurtain: 'basysafe/safetylightcurtain/status',
        statusSignalColumn: 'basysafe/signalcolumn/status',
        statusInitiator: 'basysafe/initiator/status',
        statusEstopButton: 'basysafe/estopbutton/status',
        statusAckButton: 'basysafe/ackbutton/status',
        statusPress: 'basysafe/press/status',
        commandSignalColumn: 'basysafe/signalcolumn/command',
      },
    };
  },
  methods: {
    ackButton: function () {
      console.log('ackButton: ');
      var msg = {
        timestamp: new Date().toISOString(),
        status: true,
      };
      this.$mqtt.publish(this.topics.statusAckButton, msg);

      setTimeout(() => {
        var msg = {
          timestamp: new Date().toISOString(),
          status: false,
        };
        this.$mqtt.publish(this.topics.statusAckButton, msg);
      }, 500);
    },
    setEstopButtonState: function (state: boolean) {
      console.log('setEstopButtonState: ' + state);
      var msg = {
        timestamp: new Date().toISOString(),
        status: state,
      };
      this.$mqtt.publish(this.topics.statusEstopButton, msg);
    },
    setSafetyLightCurtainState: function (state: boolean) {
      console.log('setSafetyLightCurtainState: ' + state);
      var msg = {
        timestamp: new Date().toISOString(),
        status: state,
      };
      this.$mqtt.publish(this.topics.statusSafetyLightCurtain, msg);
    },
    setInitiatorState: function (state: boolean) {
      console.log('setInitiatorState: ' + state);
      var msg = {
        timestamp: new Date().toISOString(),
        status: state,
      };
      this.$mqtt.publish(this.topics.statusInitiator, msg);
    },
    setSignalColumnState: function () {
      console.log('setSignalColumnState: ' + JSON.stringify(this.states.signalcolumn));
      var msg = {
        timestamp: new Date().toISOString(),
        red: this.states.signalcolumn.red,
        yellow: this.states.signalcolumn.yellow,
        green: this.states.signalcolumn.green,
        white: this.states.signalcolumn.white,
      };
      this.$mqtt.publish(this.topics.statusSignalColumn, msg);
    },
    setYellowLight: function (state: boolean) {
      console.log('setYellowLight: ' + state);
      var msg = {
        timestamp: new Date().toISOString(),
        status: state,
      };
      this.$mqtt.publish(this.topics.commandSignalColumn, msg);
    },
    simulatePress: async function () {
      console.log('simulatePress: ');

      var msg = {
        timestamp: new Date().toISOString(),
        counter: Number(this.states.press.counter),
        opmode: 'press',
        state: 'starting',
      };

      this.$mqtt.publish(this.topics.statusPress, msg);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      msg.state = 'execute';

      while (
        this.states.press.counter < this.config.press.maxCounter &&
        this.states.estopbutton &&
        this.states.safetylightcurtain
      ) {
        this.states.press.counter += 1;
        console.log('counter: ', this.states.press.counter);

        msg.timestamp = new Date().toISOString();
        msg.counter = this.states.press.counter;
        this.$mqtt.publish(this.topics.statusPress, msg);
        await new Promise((resolve) => setTimeout(resolve, 1000 / this.config.press.freqHz));
      }

      if (this.states.press.counter == this.config.press.maxCounter) {
        console.log('counter finally: ', this.states.press.counter);
        msg.state = 'completing';
        this.$mqtt.publish(this.topics.statusPress, msg);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        msg.state = 'complete';
        this.$mqtt.publish(this.topics.statusPress, msg);
      }
    },
    simulateRetract: async function () {
      console.log('simulateRetract: ');

      var msg = {
        timestamp: new Date().toISOString(),
        counter: Number(this.states.press.counter),
        opmode: 'retract',
        state: 'starting',
      };

      this.$mqtt.publish(this.topics.statusPress, msg);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      msg.state = 'execute';

      while (
        this.states.press.counter > 0 &&
        this.states.estopbutton &&
        this.states.safetylightcurtain
      ) {
        this.states.press.counter -= 1;
        console.log('counter: ', this.states.press.counter);

        msg.timestamp = new Date().toISOString();
        msg.counter = this.states.press.counter;
        this.$mqtt.publish(this.topics.statusPress, msg);
        await new Promise((resolve) => setTimeout(resolve, 1000 / this.config.press.freqHz));
      }

      if (this.states.press.counter == 0) {
        console.log('counter finally: ', this.states.press.counter);
        msg.state = 'completing';
        this.$mqtt.publish(this.topics.statusPress, msg);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        msg.state = 'complete';
        this.$mqtt.publish(this.topics.statusPress, msg);
      }
    },
  },
});
</script>

<style lang="scss"></style>
