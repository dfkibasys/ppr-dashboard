<template>
  <b-modal id="modal-licences" size="lg" title="Licences">
    <table class="table">
      <thead class="thead-dark">
        <tr>
          <th scope="col">Package</th>
          <th scope="col">Version</th>
          <th scope="col">License</th>
        </tr>
      </thead>
      <tbody v-for="licence in licences" :key="licence.name">
        <tr>
          <td>{{licence.name}}</td>
          <td>{{licence.version}}</td>
          <td>{{licence.summary}}</td>
        </tr>
      </tbody>
    </table>
    <template v-slot:modal-footer="{cancel}">
      <b-button variant="secondary" @click="cancel">{{$t("modal.close")}}</b-button>
    </template>
  </b-modal>
</template>

<script>
import axios from "axios";

export default {
  name: "Licences",
  data() {
    return {
      licences: []
    };
  },
  created() {
    axios.get("data/licences.json").then(res => {
      this.licences = res.data;
    });
  }
};
</script>

<style>
</style>