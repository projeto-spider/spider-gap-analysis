<template>
  <section class="container">
    <nuxt-link class="button" to="/project/new">
      Nova
    </nuxt-link>

    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th>ID</th>
          <th>Organização</th>
          <th>Unidade Organizacional</th>
          <th>Nome</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="proj in projects">
          <th>{{proj.id}}</th>
          <td>{{organizations[units[proj.unitId].organization_id].name}}</td>
          <td>{{units[proj.unitId].name}}</td>
          <td>{{proj.name}}</td>
          <td>
            <nuxt-link :to="`/project/${proj.id}`">
              <button class="button is-primary">Ver</button>
            </nuxt-link>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
export default {
  middleware: 'is-admin',

  async asyncData({ app }) {
    const projects = await app.$axios.$get('/projects')
    const units = (await app.$axios.$get('/units'))
      .reduce((acc, unit) => {
        acc[unit.id] = unit
        return acc
      }, {})
    const organizations = (await app.$axios.$get('/organizations'))
      .reduce((acc, org) => {
        acc[org.id] = org
        return acc
      }, {})

    return {
      projects,
      units,
      organizations
    }
  }
}
</script>
