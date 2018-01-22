<template>
  <section class="container">
    <nuxt-link class="button" to="/project/new">
      Nova Unidade Organizacional
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
        <tr v-for="project in projects">
          <th>{{project.id}}</th>
          <td>{{project.name}}</td>
          <td>{{project.manager}}</td>
          <td>
            <nuxt-link :to="`/evaluation/${project.id}`">
              <button class="button is-primary">Avaliação</button>
            </nuxt-link>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
export default {
  async asyncData({ app }) {
    const projects = await app.$axios.$get('/projects')

    return {
      projects
    }
  }
}
</script>
