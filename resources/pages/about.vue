<template>
  <section class="container" style="align-self: flex-start;">
    <div class="columns" style="flex-wrap: wrap; justify-content: space-around;">
      <div class="column is-one-third" v-for="(metric, i) in metricList" :key="i">
        <article class="message is-dark" :class="{[metric.color]: true}" style="box-shadow: 0 0 0.5rem rgba(83,78,76,.5);">
          <div class="message-header"></div>

          <div class="message-body has-text-centered">
            <p class="is-size-2">{{ metric.count }}</p>
            <p class="is-size-6">{{ metric.name }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import gapLogo from '~/assets/spider-gap-logo-alt.png'

const panels = [
  { key: 'organizations', singular: 'Organização', plural: 'Organizações' },
  { key: 'units', singular: 'Unidade Organizacional', plural: 'Unidades Organizacionais' },
  { key: 'projects', singular: 'Projeto', plural: 'Projetos' },
  { key: 'roles', singular: 'Fonte de Evidência', plural: 'Fontes de Evidências' },
  { key: 'members', singular: 'Membro', plural: 'Membros' },
  { key: 'evidences', singular: 'Evidência', plural: 'Evidências' },
  { key: 'projectEvidences', singular: 'Evidência em Projeto', plural: 'Evidências em Projetos' }
]

export default {
  middleware: 'logged-in',

  async asyncData ({ app }) {
    const { count } = await app.$axios.$get('/tables/homepage')

    return {
      gapLogo,
      count
    }
  },

  computed: {
    ...mapGetters(['loggedUser']),

    metricList () {
      const colorFor = [
        'is-link',
        'is-dark',
        'is-info',
        'is-primary',
        'is-danger',
        'is-success',
        'is-warning'
      ]

      return panels.map((panel, i) => {
        const count = this.count[panel.key]
        const name = count === 1
          ? panel.singular
          : panel.plural

        return {
          name,
          count,
          color: colorFor[i]
        }
      })
    }
  },

  head () {
    return {
      title: 'Dashboard'
    }
  }
}
</script>

<style scoped>
.page-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-container img {
  max-width: 240px;
}
</style>
