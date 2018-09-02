<template>
  <section class="container">
    <nuxt-link class="button" to="/organization/new">
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
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
              <tr v-for="org in organizations" :key="org.id">
          <th>{{org.id}}</th>
          <td>
            {{org.name}}
          </td>
          <td>
            <nuxt-link :to="`/organization/${org.id}`">
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

  async asyncData({ app }) {
    const organizations = await app.$axios.$get('/tables/organizations')

    return {
      organizations
    }
  }
}
</script>
