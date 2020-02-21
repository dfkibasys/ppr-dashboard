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
                            <button type="button" id="remove-btn" class="btn btn-danger" v-if="capability.taught" data-bind="click: $parent.removeCapability, css:{disabled: name != 'Apply light blue cap'}">Remove</button>
                            <button type="button" id="teach-btn" class="btn btn-info" v-else data-bind="click: $parent.startTeaching, css:{disabled: name != 'UR3 PickAndPlace'}">Teach</button>
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