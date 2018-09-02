<template>
  <section class="container">
    <nuxt-link class="button" to="/role/new">
      Nova
    </nuxt-link>

    <div class="card">
      <div class="card-content">
        <div class="content">
          <table class="table is-fullwidth is-marginless">
            <thead>
              <tr>
                <th>ID</th>
                <th>Papel</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="role in roles" :key="role.id">
                <th>{{role.id}}</th>
                <td>{{role.name}}</td>
                <td>
                  <nuxt-link :to="`/role/${role.id}`">
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
    const roles = await app.$axios.$get('/roles')

    return {
      roles
    }
  }
}
</script>
