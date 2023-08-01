<template>
  <div class="input-group m-2 w-25" id="search-field">
    <input
      type="text"
      :value="modelValue"
      class="form-control"
      @input="handleInputEvent"
      :placeholder="$t('search')"
    />
    <span class="input-group-text">
      <i class="bi bi-search"></i>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SearchField',

  //TODO: Remove later
  compatConfig: { MODE: 3 },

  props: {
    /**
     * Used primarly here to provide v-model support
     */
    modelValue: { type: String, default: '' },
    /**
     * Length of time to wait before emitting the input value.
     */
    delayInput: { type: Number, default: 0 },
  },

  data() {
    return {
      timeout: typeof setTimeout,
    };
  },

  methods: {
    handleInputEvent($event) {
      if (this.delayInput > 0) {
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.$emit('update:modelValue', $event.target.value);
        }, this.delayInput * 1000);
        return;
      }

      this.$emit('update:modelValue', $event.target.value);
    },
  },
});
</script>

<style>
</style>