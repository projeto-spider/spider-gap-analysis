<template>
  <section class="container">
    <nuxt-link class="button" to="/project/new">
      Novo Projeto
    </nuxt-link>

    <div class="card">
      <div class="card-content">
        <div class="content">
          <table class="table is-fullwidth is-marginless">
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
              <tr v-for="proj in projects" :key="proj.id">
                <th>{{proj.id}}</th>
                <td>{{proj.organizationName}}</td>
                <td>{{proj.unitName}}</td>
                <td>{{proj.name}}</td>
                <td>
                  <nuxt-link :to="`/project-evidences/${proj.id}`">
                    <button class="button is-primary">Ver Evidências</button>
                  </nuxt-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  middleware: 'is-admin',

  async asyncData({ app }) {
    const projects = await app.$axios.$get('/tables/projects')

    return {
      projects,
    }
  }
}
</script>
