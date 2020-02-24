<template>
    <nav class="navbar navbar-light bg-light">
        <b-navbar-brand href="#">
            <img src="@/assets/logo_190_52_30jahre.png" class="mr-3" width="150" alt="">
            <img src="@/assets/BaSys-Logo.png" width="150" alt="">
        </b-navbar-brand>

        <b-navbar-nav is-nav class="flex-row">
            <b-link class="pr-3" to="/devices">{{$t("translation.menu_devices")}}</b-link>
            <b-link class="pr-3" to="/services">Services</b-link>
            <b-link to="/management">Management</b-link>
        </b-navbar-nav>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" class="navbar-collapse" is-nav>
            <b-container>
                <b-row>
                    <b-col>
                        {{$t('translation.set_language')}}:
                    </b-col>
                    <b-col>
                        <b-form-select v-model="$i18n.locale" :options="langs"></b-form-select>
                    </b-col>
                    <div class="w-100"></div>
                    <b-col>
                        Broker URL:
                    </b-col>
                    <b-col class="broker">
                        <input class="form-control" data-bind="value: mqttConfig.hostname"/>
                        <input class="form-control" data-bind="value: mqttConfig.port"/>
                        <button type="button" class="btn btn-success" data-bind="click: changeMQTTdata">
                            {{$t('translation.set_change')}}
                        </button>
                    </b-col>
                    <div class="w-100"></div>
                    <b-col>
                        Mock data:
                    </b-col>
                    <b-col>
                        <button type="button" class="btn btn-sm btn-toggle" data-toggle="button"
                                data-bind="click: changeMockData" aria-pressed="false" autocomplete="off">
                            <div class="handle"></div>
                        </button>
                    </b-col>
                    <div class="w-100"></div>
                    <b-col>
                        REST URL:
                    </b-col>
                    <b-col class="rest">
                        <input class="form-control" v-model="$store.state.hostname"/>
                        <button type="button" class="btn btn-success" data-bind="click: changeRESTdata">
                            {{$t('translation.set_change')}}
                        </button>
                    </b-col>
                    <div class="w-100"></div>
                    <b-col>
                        Camunda URL:
                    </b-col>
                    <b-col>
                        <input class="form-control" data-bind="value: camundaConfig.hostname"/>
                    </b-col>
                    <div class="w-100"></div>
                    <b-col>
                    </b-col>
                    <b-col>
                        <button type="button" data-toggle="modal" data-target="#buildLicenses"
                                class="btn btn-info float-right">
                            <b-icon-question font-scale="2"></b-icon-question>
                        </button>
                    </b-col>
                </b-row>

            </b-container>
        </b-collapse>

    </nav>
</template>

<script>
    export default {
        name: "Navbar",
        data() {
            return{
                langs: [
                    {value: 'de', text: 'Deutsch'},
                    {value: 'en', text: 'English'}
                ]
            }
        }
    }
</script>

<style scoped lang="less">
    .navbar-collapse {
        .row {
            margin-bottom: 5px;
        }

        .broker {
            input {
                width: 42%;
                float: left;
            }

            button {
                float: left;
            }
        }

        .rest {
            input {
                width: 84%;
                float: left;

            }

            button {
                float: left;
            }
        }

    }
</style>