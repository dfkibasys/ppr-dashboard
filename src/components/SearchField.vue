<template>
  <div class="input-group m-2 w-25">
    <input
      type="text"
      :value="value"
      class="form-control"
      @input="handleInputEvent"
      :placeholder="$t('search')"
    />
    <div class="input-group-append">
      <span class="input-group-text">
        <b-icon-search></b-icon-search>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Data, Methods, Computed, Props } from '@/interfaces/ISearchField';

export default defineComponent({
  name: 'SearchField',

  props: {
    /**
     * Used primarly here to provide v-model support
     */
    value: { type: String, default: '' },
    /**
     * Length of time to wait before emitting the input value.
     */
    delayInput: { type: Number, default: 0 },
  },

  data() {
    return {
      timeout: null,
    };
  },

  methods: {
    handleInputEvent($event) {
      if (this.delayInput > 0) {
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.$emit('input', $event.target.value);
        }, this.delayInput * 1000);
        return;
      }

      this.$emit('input', $event.target.value);
    },
  },
});
</script>

<style>
</style>