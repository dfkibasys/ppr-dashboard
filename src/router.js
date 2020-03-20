import Vue from 'vue'
import Router from 'vue-router'
import Devices from "./components/views/Devices";
import Services from "./components/views/Services";
import Management from "./components/views/Management";
import Processes from "./components/views/Processes";
import ProcessesOverview from "./components/views/ProcessesOverview";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/devices',
            name: 'Devices',
            component: Devices
        },
        {
            path: '/services',
            name: 'Services',
            component: Services
        },
        {
            path: '/management',
            name: 'Management',
            component: Management
        },
        {
            path: '/processes',
            name: 'Processes',
            component: Processes
        },
        {
            path: '/processes/overview',
            name: 'ProcessesOverview',
            component: ProcessesOverview
        },
        { path: '*', redirect: '/devices' }
    ]
})