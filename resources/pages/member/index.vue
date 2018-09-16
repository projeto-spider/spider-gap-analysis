<template>
  <section class="container">
    <nuxt-link class="button" to="/member/new">
      Nova
    </nuxt-link>

    <div class="card">
      <div class="card-content">
        <div class="content">
          <table class="table is-fullwidth is-marginless">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Projeto</th>
                <th>Fonte de Evidência</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="member in members" :key="member.id">
                <th>{{member.id}}</th>
                <td>{{member.name}}</td>
                <td>{{member.projectName}}</td>
                <td>{{member.roleName}}</td>
                <td>
                  <nuxt-link :to="`/member/${member.id}`">
                    <button class="button is-primary">Ver</button>
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

  async asyncData ({ app }) {
    const members = await app.$axios.$get('/tables/members')

    return {
      members
    }
  }
}
</script>
