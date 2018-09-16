import Vue from 'vue'
import * as mps from '../../mps'

export default function ({ app }) {
  app.mps = mps
  Vue.prototype.$mps = mps
}
