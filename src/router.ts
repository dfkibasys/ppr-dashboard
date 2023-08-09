import { h } from 'vue';
import { createRouter as _createRouter, createWebHistory, RouterView } from 'vue-router';
import Assets from '@/components/views/Assets.vue';
import Processes from '@/components/views/Processes.vue';
import ProcessesDetails from '@/components/views/processes/ProcessesDetails.vue';
import ProcessesInstance from '@/components/views/processes/ProcessesInstance.vue';
import Basysafe from '@/components/views/Basysafe.vue';

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
        path: '/basysafe',
        name: 'Basysafe',
        component: Basysafe,
      },
      { path: '/:catchAll(.*)', redirect: '/assets' },
    ],
  });
}
