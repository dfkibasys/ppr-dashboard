<template>
    <nav class="navbar navbar-light bg-light">
        <a class="navbar-brand" href="#">
            <img src="../assets/logo_190_52_30jahre.png" class="mr-3" width="150" alt="">
            <img src="../assets/BaSys-Logo.png" width="150" alt="">
        </a>

        <ul class="nav navbar-nav flex-row" id="pagination">
            <li class="nav-item active"><a id="devices-link" class="nav-link pr-3" href="#">{{$t("translation.menu_devices")}}</a></li>
            <li class="nav-item"><a id="service-link" class="nav-link pr-3" href="#">Services</a></li>
            <li class="nav-item"><a id="management-link" class="nav-link pr-3" href="#">Management</a></li>
            <!--<li class="nav-item"><a id="processes-link" class="nav-link" href="#">{{$t("translation.menu_processes")}}</a></li>-->
        </ul>

        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="container">
                <div class="row">
                    <div class="col">
                        <span data-bind="i18n: 'set_language'"></span>:
                    </div>
                    <div class="col">
                        <select data-bind="value: language">
                            <option value="en">English</option>
                            <option value="de">Deutsch</option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        Broker URL:
                    </div>
                    <div class="col broker">
                        <input class="form-control" data-bind="value: mqttConfig.hostname"/>
                        <input class="form-control" data-bind="value: mqttConfig.port"/>
                        <button type="button" class="btn btn-success"  data-bind="click: changeMQTTdata"><span data-bind="i18n: 'set_change'"></span></button>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        Mock data:
                    </div>
                    <div class="col">
                        <button type="button" class="btn btn-sm btn-toggle" data-toggle="button" data-bind="click: changeMockData" aria-pressed="false" autocomplete="off">
                            <div class="handle"></div>
                        </button>
                    </div>
                </div>
                <div class="row" data-bind="visible: !restConfig.mockData()">
                    <div class="col">
                        REST URL:
                    </div>
                    <div class="col rest">
                        <input class="form-control" data-bind="value: restConfig.hostname"/>
                        <button type="button" class="btn btn-success"  data-bind="click: changeRESTdata"><span data-bind="i18n: 'set_change'"></span></button>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        Camunda URL:
                    </div>
                    <div class="col">
                        <input class="form-control" data-bind="value: camundaConfig.hostname"/>
                    </div>
                </div>
                <button type="button" data-toggle="modal" data-target="#buildLicenses" class="btn btn-info float-right">
                    <i class="fas fa-question-circle fa-2x"></i>
                </button>
            </div>
        </div>

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