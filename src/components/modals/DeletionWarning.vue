<template>
  <b-modal
    @ok="$emit('delete')"
    id="modal-warning"
    size="md"
    :title="$t('modal.deletionWarning.title')"
  >
    {{ $t('modal.deletionWarning.content') }}
    <template v-slot:modal-footer="{ ok, cancel }">
      <b-button @click="cancel">{{ $t('modal.cancel') }}</b-button>
      <b-button variant="danger" @click="ok">{{ $t('modal.deletionWarning.delete') }}</b-button>
    </template>
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue';
import { Data, Methods, Computed, Props } from '@/interfaces/IDeletionWarning';

export default Vue.extend<Data, Methods, Computed, Props>({
  name: 'DeletionWarning',
});
</script>

<style></style>
