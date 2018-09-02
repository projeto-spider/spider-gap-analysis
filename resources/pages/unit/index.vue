<template>
  <section class="container">
    <nuxt-link class="button" to="/unit/new">
      Nova
    </nuxt-link>

    <div class="card">
      <div class="card-content">
        <div class="content">
          <table class="table is-fullwidth is-marginless">
            <thead>
              <tr>
                <th>ID</th>
                <th>Organização</th>
                <th>Nome</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="unit in units" :key="unit.id">
                <th>{{unit.id}}</th>
                <td>{{unit.organizationName}}</td>
                <td>{{unit.name}}</td>
                <td>
                  <nuxt-link :to="`/unit/${unit.id}`">
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
    const units = await app.$axios.$get('tables/units')

    return {
      units
    }
  }
}
</script>
