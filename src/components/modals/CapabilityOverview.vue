<template>
    <b-modal id="modal-cap" size="lg" title="Capability Overview">
        <div class="modal-body">
            <div id="currentCapability">
                <table class="table">
                    <thead class="thead-dark">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Status</th>
                    </tr>
                    </thead>
                    <tbody v-for="(capability, index) in currentCapabilities">
                    <tr>
                        <th scope="row">{{index}}</th>
                        <td>{{capability.name}}</td>
                        <td>
                            <button type="button" id="remove-btn" class="btn btn-danger" v-if="capability.taught" v-bind:disabled="true" data-bind="click: $parent.removeCapability">Remove</button>
                            <button type="button" id="teach-btn" class="btn btn-info" v-else v-bind:disabled="true" data-bind="click: $parent.startTeaching">Teach</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <template v-slot:modal-footer={cancel}>
            <b-button variant="secondary" @click="cancel">
                {{$t("translation.modal_close")}}
            </b-button>
        </template>
    </b-modal>
</template>

<script>
    export default {
        name: "CapabilityOverview",
        props: {
            currentCapabilities: Array
        }
    }
</script>

<style scoped>

</style>