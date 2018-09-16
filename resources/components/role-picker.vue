<template>
  <b-field label="Fontes de Evidência" expanded>
    <b-select v-model="selected" v-if="!readOnly" placeholder="Fontes" expanded required>
      <option
        v-for="role in roles"
        :value="role.id"
        :key="role.id"
      >
        {{ role.name }}
      </option>
    </b-select>

    <p v-else-if="selectedRole">{{ selectedRole.name }}</p>
  </b-field>
</template>

<script>
export default {
  name: 'RolePicker',

  props: {
    readOnly: Boolean,

    value: {
      type: Number,
      default: 0
    },

    scope: Number
  },

  data () {
    return {
      selected: false,
      roles: [],
      selectedRole: {}
    }
  },

  async created () {
    if (this.editing) {
      this.selectedRole = await this.$axios.$get(`/roles/${this.value}`)
      return
    }

    const url = this.scope
      ? `/units/${this.scope}/roles`
      : '/roles'

    this.roles = await this.$axios.$get(url)
  },

  watch: {
    selected () {
      this.$emit('input', this.selected)
    },

    async scope () {
      this.roles = await this.$axios.$get(`/units/${this.scope}/roles`)
    }
  }
}
</script>
