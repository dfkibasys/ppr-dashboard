<template>
  <div class="modal fade" :class="`modal-${size}`" :id="name" :ref="ref">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <slot name="header">
            <h5 class="modal-title">{{ title }}</h5>
          </slot>
        </div>
        <div class="modal-body">
          <slot name="body"></slot>
          <div class="modal-footer">
            <slot name="footer">
              <button
                type="button"
                class="btn btn-secondary"
                @click="$emit('close')"
                data-bs-dismiss="modal"
                >{{ $t('modal.close') }}</button
              >
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Modal } from 'bootstrap';
export default defineComponent({
  name: 'CModal',
  // setup() {
  //   const ModalRef = ref(null);
  //   const closeModal = () => Modal.getInstance(ModalRef.value)?.hide();
  //   return { ModalRef, closeModal };
  // },
  props: {
    name: String,
    ref: String,
    title: String,
    size: String,
    show: Boolean,
  },
  watch: {
    show(value) {
      value
        ? Modal.getInstance(`#${this.name}`)?.show()
        : Modal.getInstance(`#${this.name}`)?.hide();
    },
  },
  mounted() {
    const myModal = new Modal(`#${this.name}`, { backdrop: 'static', keyboard: false });
  },
});
</script>

<style lang="scss" scoped>
</style>
