<template>
  <section class="container">
    <nuxt-link class="button" to="/unit/new">
      Nova
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
        <tr v-for="unit in units">
          <th>{{unit.id}}</th>
          <td>{{unit.name}}</td>
          <td>{{unit.coordinator}}</td>
          <td>
            <nuxt-link :to="`/unit/${unit.id}`">
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
    const units = await app.$axios.$get('/units')

    return {
      units
    }
  }
}
</script>
