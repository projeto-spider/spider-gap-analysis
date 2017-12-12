<template>
  <section class="container">
    <nuxt-link class="button" to="/organization/new">
      Nova
    </nuxt-link>

    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="org in organizations">
          <th>{{org.id}}</th>
          <td>
            <nuxt-link :to="`/organization/${org.id}`">
              {{org.name}}
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
    const organizations = await app.$axios.$get('/organizations')

    return {
      organizations
    }
  }
}
</script>
