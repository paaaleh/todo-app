import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar } from 'quasar'
import quasarIconSet from 'quasar/icon-set/material-icons'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import router from './router'
import App from './App.vue'
import { initSentry, captureException } from './utils/monitoring'
import { setupGlobalErrorHandlers, logError } from './utils/errorHandling'

initSentry()

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(Quasar, {
  plugins: {},
  iconSet: quasarIconSet,
})

app.config.errorHandler = (err, _instance, info) => {
  logError(`Vue [${info}]`, err)
  captureException(err, { info })
}

setupGlobalErrorHandlers((message, severity) => {
  import('./stores').then(({ useUiStore }) => {
    const uiStore = useUiStore()
    const type = severity === 'warning' ? 'warning' : severity === 'info' ? 'info' : 'error'
    uiStore.addNotification(type, message, 6000)
  })
})

app.mount('#app')
