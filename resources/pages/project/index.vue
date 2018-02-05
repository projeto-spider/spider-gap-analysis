<template>
  <section class="container">
    <nuxt-link class="button" to="/project/new">
      Nova
    </nuxt-link>

    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Coordenador</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="proj in projects">
          <th>{{proj.id}}</th>
          <td>{{proj.name}}</td>
          <td>{{proj.manager}}</td>
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

    return {
      projects
    }
  }
}
</script>
