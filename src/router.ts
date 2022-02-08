import Vue from 'vue';
import Router from 'vue-router';
import Assets from '@/components/views/Assets.vue';
import Services from '@/components/views/Services.vue';
import Management from '@/components/views/Management.vue';
import Processes from '@/components/views/Processes.vue';
import ProcessesDetails from '@/components/views/processes/ProcessesDetails.vue';
import ProcessesInstance from '@/components/views/processes/ProcessesInstance.vue';
import Registry from '@/components/views/Registry.vue';

Vue.use(Router);
const DEFAULT_TITLE = 'PPR Dashboard';

const router = new Router({
  routes: [
    {
      path: '/assets',
      name: 'Assets',
      component: Assets,
    },
    {
      path: '/services',
      name: 'Services',
      component: Services,
    },
    {
      path: '/management',
      name: 'Management',
      component: Management,
    },
    {
      path: '/processes',
      name: 'Processes',
      component: Processes,
    },
    {
      path: '/processes/:pid',
      name: 'ProcessesDetails',
      component: ProcessesDetails,
    },
    {
      path: '/processes/:pid/instance/:iid',
      name: 'ProcessesInstance',
      component: ProcessesInstance,
    },
    {
      path: '/registry',
      name: 'Registry',
      component: Registry,
    },
    { path: '*', redirect: '/assets' },
  ],
});

router.afterEach((to, from) => {
  Vue.nextTick(() => {
    document.title = to?.meta?.title || DEFAULT_TITLE;
  });
});

export default router;
