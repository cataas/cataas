import { createRouter, createWebHashHistory } from 'vue-router'
import config from '../config/config'

const router = createRouter({
  history: createWebHashHistory(),
  routes: config.routes
})

export default router
