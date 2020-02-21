<template>
    <nav class="navbar navbar-light bg-light">
        <b-navbar-brand href="#">
            <img src="@/assets/logo_190_52_30jahre.png" class="mr-3" width="150" alt="">
            <img src="@/assets/BaSys-Logo.png" width="150" alt="">
        </b-navbar-brand>

        <b-navbar-nav is-nav class="flex-row">
            <b-nav-item class="pr-3" href="#">{{$t("translation.menu_devices")}}</b-nav-item>
            <b-nav-item class="pr-3" href="#">Services</b-nav-item>
            <b-nav-item class="pr-3" href="#">Management</b-nav-item>

            <!--<li class="nav-item"><a id="processes-link" class="nav-link" href="#">{{$t("translation.menu_processes")}}</a></li>-->
        </b-navbar-nav>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" class="navbar-collapse" is-nav>
            <b-container>
                <b-row>
                    <b-col>
                        {{$t('translation.set_language')}}:
                    </b-col>
                    <b-col>
                        <select data-bind="value: language">
                            <option value="en">English</option>
                            <option value="de">Deutsch</option>
                        </select>
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
                        <input class="form-control" data-bind="value: restConfig.hostname"/>
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
        name: "Navbar"
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