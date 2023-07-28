<template>
  <div class="modal modal-md fade" id="modal-warning" ref="deleteModalRef">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t('modal.deletionWarning.title') }}</h5>
        </div>
        <div class="modal-body">
          {{ $t('modal.deletionWarning.content') }}
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="$emit('close')"
              data-bs-dismiss="modal"
              >{{ $t('modal.cancel') }}</button
            >
            <button type="button" class="btn btn-danger" @click="$emit('delete')">{{
              $t('modal.deletionWarning.delete')
            }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Modal } from 'bootstrap';
import { Data, Methods, Computed, Props } from '@/interfaces/IDeletionWarning';

export default defineComponent({
  name: 'DeletionWarning',
  props: {
    show: Boolean,
  },
  watch: {
    show(value) {
      value
        ? Modal.getInstance('#modal-warning')?.show()
        : Modal.getInstance('#modal-warning')?.hide();
    },
  },
  mounted() {
    const myModal = new Modal('#modal-warning');
  },
});
</script>

<style></style>
