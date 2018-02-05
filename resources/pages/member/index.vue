<template>
  <section class="container">
    <nuxt-link class="button" to="/member/new">
      Nova
    </nuxt-link>

    <table class="table is-fullwidth">
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
        <tr v-for="member in members">
          <th>{{member.id}}</th>
          <td>{{member.name}}</td>
          <td>{{member.project.name}}</td>
          <td>{{member.role.name}}</td>
          <td>
            <nuxt-link :to="`/member/${member.id}`">
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
    const members = await app.$axios.$get('/members')

    return {
      members
    }
  }
}
</script>
