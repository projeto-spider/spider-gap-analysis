<template>
  <section class="container">
    <nuxt-link class="button" to="/project/new">
      Novo Projeto
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
        <tr v-for="project in projects">
          <th>{{project.id}}</th>
          <td>{{project.organizationName}}</td>
          <td>{{project.unitName}}</td>
          <td>{{project.name}}</td>
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
  middleware: 'is-reviewer',

  async asyncData({ app }) {
    const projects = await app.$axios.$get('/tables/projects')

    return {
      projects,
    }
  }
}
</script>
