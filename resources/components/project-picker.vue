<template>
  <b-field label="Projeto" expanded>
    <b-select v-model="selected" v-if="!readOnly" placeholder="Projeto" expanded required>
      <option
        v-for="proj in projects"
        :value="proj.id"
        :key="proj.id"
      >
        {{ proj.name }}
      </option>
    </b-select>

    <p v-else-if="selectedProject">{{ selectedProject.name }}</p>
  </b-field>
</template>

<script>
export default {
  name: 'ProjectPicker',

  props: {
    readOnly: Boolean,

    scope: Number
  },

  data () {
    return {
      selected: false,
      projects: []
    }
  },

  async created () {
    const url = this.scope
      ? `/units/${this.scope}/projects`
      : '/projects'

    this.projects = await this.$axios.$get(url)
  },

  watch: {
    selected () {
      this.$emit('input', this.selected)
    },

    async scope () {
      this.projects = await this.$axios.$get(`/units/${this.scope}/projects`)
    }
  }
}
</script>
