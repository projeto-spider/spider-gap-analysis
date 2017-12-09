<template>
  <b-input
    :required="required"
    :expanded="expanded"
    :placeholder="placeholder"
    v-cleave="options"
    type="text"
  ></b-input>
</template>

<script>
import Cleave from 'cleave.js'

const cleave = {
  name: 'cleave',

  bind(el, binding) {
    const input = el.querySelector('input')
    input._vCleave = new Cleave(input, binding.value)
  },

  update(el, binding, vnode) {
    const input = el.querySelector('input')
    input._vCleave.destroy()
    input._vCleave = new Cleave(input, binding.value)
  },

  unbind(el) {
    const input = el.querySelector('input')
    input._vCleave.destroy()
  }
}

export default {
  directives: { cleave },

  props: {
    options: {
      type: Object,
      default: () => ({})
    },

    required: {
      type: Boolean,
      default: false
    },

    expanded: {
      type: Boolean,
      default: false
    },

    placeholder: String,
  },

  methods: {
    emitEvent (e) {
      this.$emit('input', e.target.value)
      this.$emit('rawValueChanged', e.target._vCleave.getRawValue())
    }
  },

  mounted() {
    const $input = this.$el.querySelector('input')
    $input.addEventListener('keyup', this.emitEvent)
  },

  beforeDestroy() {
    const $input = this.$el.querySelector('input')
    $input.removeEventListener('keyup', this.emitEvent)
  }
}
</script>
