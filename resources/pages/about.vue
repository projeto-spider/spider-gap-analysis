<template>
  <section class="container" style="align-self: flex-start;">
    <div class="columns">
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

    <h1 class="title" v-if="false">
      Bem vindo(a) <strong>{{ loggedUser.username }}</strong>
    </h1>

    <div class="logo-container" v-if="false">
      <a href="https://github.com/projeto-spider/spider-gap-analysis" target="_blank">
        <img :src="gapLogo" alt="Projeto SPIDER">
      </a>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import gapLogo from '~/assets/spider-gap-logo-alt.png'

export default {
  middleware: 'logged-in',

  data: () => ({
    gapLogo,

    metrics: {
      'Organizações': 0,
      'Unidades Organizacionais': 0,
      'Projetos': 0
    }
  }),

  computed: {
    ...mapGetters(['loggedUser']),

    metricList () {
      const colorFor = {
        0: 'is-link',
        1: 'is-dark',
        2: 'is-info'
      }

      return Object.entries(this.metrics)
        .map(([key, value], i) => ({
          name: key,
          count: value,
          color: colorFor[i]
        }))
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
