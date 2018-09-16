import Vue from 'vue'

const Toast = {
  install (Vue, options) {
    Vue.prototype.$success = function toastSuccess (message) {
      Vue.prototype.$snackbar.open({
        type: 'is-success',
        position: 'is-bottom-left',
        message
      })
    }

    Vue.prototype.$fail = function toastFail (message) {
      Vue.prototype.$snackbar.open({
        type: 'is-danger',
        position: 'is-bottom-left',
        message
      })
    }

    Vue.prototype.$translateError = function toastTranslateError (message) {
      return err => {
        Vue.prototype.$fail(message)
        throw err
      }
    }
  }
}

Vue.use(Toast)
