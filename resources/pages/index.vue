<template>
  <section class="container">
    <div class="logo-container">
      <a href="http://spider.ufpa.br/" target="_blank">
        <img :src="spiderLogo" alt="Projeto SPIDER">
      </a>
    </div>

    <form action="fake" @submit.prevent="login">
      <b-field label="Nome de usuário">
        <b-input v-model="username"></b-input>
      </b-field>

      <b-field label="Senha">
        <b-input
          type="password"
          v-model="password"
          password-reveald
          autocomplete="password"
        ></b-input>
      </b-field>

      <button type="submit" class="button is-primary">Login</button>
    </form>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import spiderLogo from '~/assets/spider-logo.png'

export default {
  middleware: 'logged-off',

  data: () => ({
    spiderLogo,
    username: '',
    password: '',
  }),

  computed: {
    ...mapGetters(['loggedUser', 'isLoggedIn']),
  },

  methods: {
    async login() {
      const { username, password } = this
      await this.$store.dispatch('login', { username, password })
        .catch(this.$translateError('Falha no login'))

      this.$success('Login com sucesso!')

      this.$router.push({ path: '/about', success: true})
    },
  }
}
</script>

<style scoped>
.logo-container {
  text-align: center;
}

.logo-container img {
  max-width: 150px;
}
</style>
