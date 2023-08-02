<template>
  <div class="modal modal-lg fade" id="modal-licences" ref="licensesModalRef">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t('modal.licences.title') }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">{{ $t('modal.licences.name') }}</th>
                <th scope="col">{{ $t('modal.licences.version') }}</th>
                <th scope="col">{{ $t('modal.licences.summary') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="licence in licences" :key="licence.name">
                <td
                  ><a :href="licence.repository" target="_blank">{{ licence.name }}</a></td
                >
                <td>{{ licence.version }}</td>
                <td>{{ licence.summary }}</td>
              </tr>
            </tbody>
          </table>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{
              $t('modal.close')
            }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import Licence from '@/types/Licences';

export default defineComponent({
  name: 'Licences',
  data() {
    return {
      licences: [] as Licence[],
    };
  },
  created() {
    axios.get('data/licences.json').then((res) => {
      this.licences = res.data;
    });
  },
});
</script>

<style></style>
