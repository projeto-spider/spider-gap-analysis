<template>
  <section class="container">
    <template v-if="isLoggedIn">
      <h1 class="title">
        Bem vindo(a) {{ loggedUser.username }}
      </h1>
    </template>

    <template v-else>
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
    </template>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  middleware: 'logged-off',

  data: () => ({
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
.title
{
  margin: 50px 0;
}
</style>
