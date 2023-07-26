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
import { defineComponent } from 'vue';
import { Data, Methods, Computed, Props } from '@/interfaces/IDeletionWarning';

export default defineComponent({
  name: 'DeletionWarning',
});
</script>

<style></style>
