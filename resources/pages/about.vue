<template>
  <section class="container page-container">
    <h1 class="title">
      Bem vindo(a) <strong>{{ loggedUser.username }}</strong>
    </h1>

    <div class="logo-container">
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
  }),

  computed: {
    ...mapGetters(['loggedUser']),
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
