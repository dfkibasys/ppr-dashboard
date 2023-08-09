<template>
  <CModal
    name="modal-warning"
    ref="deleteModalRef"
    size="md"
    :show="show"
    :title="$t('modal.deletionWarning.title')"
  >
    <template v-slot:body>
      {{ $t('modal.deletionWarning.content') }}
    </template>
    <template v-slot:footer>
      <button type="button" class="btn btn-secondary" @click="$emit('close')">{{
        $t('modal.cancel')
      }}</button>
      <button type="button" class="btn btn-danger" @click="$emit('delete')">{{
        $t('modal.deletionWarning.delete')
      }}</button>
    </template>
  </CModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CModal from '../common/CModal.vue';

export default defineComponent({
  name: 'DeletionWarning',
  props: {
    show: Boolean,
  },
  components: { CModal },
});
</script>

<style></style>
