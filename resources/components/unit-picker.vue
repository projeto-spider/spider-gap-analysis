<template>
  <b-field label="Unidade Organizacional" expanded>
    <b-select v-model="selected" v-if="!disabled" placeholder="Unidade Organizacional" expanded required>
      <optgroup v-for="org in organizations" :label="org.label">
        <option
          v-for="unit in org.units"
          :value="unit.id"
          :key="unit.id"
        >
          {{ unit.name }}
        </option>
      </optgroup>
    </b-select>

    <p v-else-if="selectedUnit">{{ selectedUnit.name }}</p>
  </b-field>
</template>

<script>
export default {
  name: 'UnitPicker',

  props: {
    disabled: {
      type: Boolean,
      default: false
    },

    value: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      selected: false,
      organizations: [],
      units: [],
      selectedUnit: {}
    }
  },

  async created() {
    if (this.disabled) {
      this.selectedUnit = await this.$axios.$get(`/units/${this.value}`)
      return
    }

    const orgs = await this.$axios.$get('/organizations')
    const units = await this.$axios.$get('/units')

    this.organizations = orgs
      .map(org => ({
        label: org.name,
        units: units.filter(unit => unit.organization_id === org.id)
      }))
      .filter(org => org.units.length)

    this.units = units
  },

  watch: {
    selected() {
      this.$emit('input', this.selected)
    }
  }
}
</script>
