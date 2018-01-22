<template>
  <section class="container">
    <nuxt-link class="button" to="/project/new">
      Novo Projeto
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
            <nuxt-link :to="`/project-evidences/${proj.id}`">
              <button class="button is-primary">Ver Evidências</button>
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
