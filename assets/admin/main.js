import './assets/sass/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import mitt from 'mitt'

import App from './App.vue'
import router from './router'
import i18n from './lib/i18n'
import responsive from './lib/responsive'
import config from './config/config'
import Requester from './lib/requester'
import Auth from './lib/auth'

import dateDirective from './directives/date'
import tooltipDirective from './directives/tooltip'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(responsive)
app.provide('emitter', mitt())

app.directive('date', dateDirective)
app.directive('tooltip', tooltipDirective)

const auth = new Auth('app')
app.provide('requester', new Requester('', auth))
app.provide('auth', auth)
app.provide('config', config)

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded')
  app.mount('#app')
})
