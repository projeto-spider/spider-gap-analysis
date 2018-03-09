import Vue from 'vue'
import Cleave from 'cleave.js'

Vue.directive('cleave', (el, binding) => {
  const input = el.querySelector('input')
  new Cleave(input, binding.value)
})
