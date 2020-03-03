import Vue from 'vue'
import Router from 'vue-router'
import Devices from "./components/views/Devices";
import Services from "./components/views/Services";
import Management from "./components/views/Management";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/devices',
            name: 'Devices',
            component: Devices,
            props: {
                'ref': 'dev'
            }
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
        { path: '*', redirect: '/devices' }
    ]
})