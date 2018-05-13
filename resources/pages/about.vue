<template>
  <section class="container page-container">
    <h1 class="title">
      Bem vindo(a) <strong>{{ loggedUser.username }}</strong>
    </h1>

    <div class="logo-container">
      <a href="http://spider.ufpa.br/" target="_blank">
        <img :src="spiderLogo" alt="Projeto SPIDER">
      </a>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import spiderLogo from '~/assets/spider-logo.png'

export default {
  middleware: 'logged-in',

  data: () => ({
    spiderLogo,
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
  max-width: 150px;
}
</style>
