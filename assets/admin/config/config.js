import { version, name } from '../../../package.json'
import { Files } from 'lucide-vue-next'
import useCatsStore from '../stores/cats'
import PageBrowse from '../components/cats/Browse.vue'

export default {
  application: {
    version,
    name,
    env: import.meta.env.MODE
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/DashboardView.vue')
    },
    {
      path: '/cats',
      name: 'cats:browse',
      component: () => import('../views/crud/BrowseView.vue'),
      props: {
        store: useCatsStore,
        template: PageBrowse,
        title: 'Cats'
      }
    }
  ],
  menu: [
    {
      name: 'cats',
      links: [
        {
          name: 'cats',
          icon: Files,
          url: '/cats'
        }
      ]
    }
  ]
}
