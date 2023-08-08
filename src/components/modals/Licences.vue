<template>
  <CModal
    name="modal-licences"
    ref="licensesModalRef"
    size="lg"
    :title="$t('modal.licences.title')"
  >
    <template v-slot:body>
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
    </template>
  </CModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import Licence from '@/types/Licences';
import CModal from '../common/CModal.vue';

export default defineComponent({
  name: 'Licences',
  components: { CModal },
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
