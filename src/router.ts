import { h } from 'vue';
import { createRouter as _createRouter, createWebHistory, RouterView } from 'vue-router';
import Assets from '@/components/views/Assets.vue';
import Services from '@/components/views/Services.vue';
import Management from '@/components/views/Management.vue';
import Processes from '@/components/views/Processes.vue';
import ProcessesDetails from '@/components/views/processes/ProcessesDetails.vue';
import ProcessesInstance from '@/components/views/processes/ProcessesInstance.vue';
import Registry from '@/components/views/Registry.vue';
import Basysafe from '@/components/views/Basysafe.vue';

const DEFAULT_TITLE = 'PPR Dashboard';

export function createRouter() {
  return _createRouter({
    history: createWebHistory(),
    scrollBehavior: () => ({ top: 0 }),
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
        component: { render: () => h(RouterView) },
        children: [
          {
            path: '',
            name: 'Processes',
            component: Processes,
          },
          {
            path: ':pid',
            name: 'ProcessesDetails',
            component: ProcessesDetails,
          },
          {
            path: ':pid/instance/:iid',
            name: 'ProcessesInstance',
            component: ProcessesInstance,
          },
        ],
      },

      {
        path: '/registry/:url?',
        name: 'Registry',
        component: Registry,
      },
      {
        path: '/basysafe',
        name: 'Basysafe',
        component: Basysafe,
      },
      { path: '/:pathMatch(.*)*', redirect: '/assets' },
    ],
  });
}

// router.afterEach((to, from) => {
//   Vue.nextTick(() => {
//     document.title = to?.meta?.title || DEFAULT_TITLE;
//   });
// });
