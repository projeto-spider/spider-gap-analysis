<template>
  <section class="container">
    <nuxt-link class="button" to="/role/new">
      Nova
    </nuxt-link>

    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th>ID</th>
          <th>Papel</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="proj in roles">
          <th>{{proj.id}}</th>
          <td>{{proj.name}}</td>
          <td>
            <nuxt-link :to="`/role/${proj.id}`">
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
  async asyncData({ app }) {
    const roles = await app.$axios.$get('/roles')

    return {
      roles
    }
  }
}
</script>
