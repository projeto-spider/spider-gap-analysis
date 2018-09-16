<template>
  <section class="container">
    <nuxt-link class="button" to="/evidence/new">
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
                <th>Tipo</th>
                <th>Descrição</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="evidence in evidences" :key="evidence.id">
                <th>{{evidence.id}}</th>
                <td>{{evidence.name}}</td>
                <td>{{evidence.type || '??'}}</td>
                <td>{{evidence.description || '??'}}</td>
                <td>
                  <nuxt-link :to="`/evidence/${evidence.id}`">
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
    const evidences = await app.$axios.$get('/evidences')

    return {
      evidences
    }
  }
}
</script>
