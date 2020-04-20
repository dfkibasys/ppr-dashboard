<template>
  <b-modal id="modal-licences" size="lg" :title="$t('modal.licences.title')">
    <b-table striped :items="licences" :fields="fields">
      <template v-slot:head(name)>{{ $t('modal.licences.name') }}</template>
      <template v-slot:head(version)>{{ $t('modal.licences.version') }}</template>
      <template v-slot:head(summary)>{{ $t('modal.licences.summary') }}</template>
      <template v-slot:cell(name)="value">
        <b-link :href="value.item.repository" target="_blank">{{value.item.name}}</b-link>
      </template>
    </b-table>
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
      licences: [],
      fields: ["name", "version", "summary"]
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