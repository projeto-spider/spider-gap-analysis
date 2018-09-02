<template>
  <div class="login">
    <form @submit.prevent="login">
      <div class="field">
        <label class="label has-text-centered is-size-4">Usuário</label>
        <div class="control">
          <input class="input is-large" type="text" v-model="username" autofocus>
        </div>
      </div>

      <div class="field">
        <label class="label has-text-centered is-size-4">Senha</label>
        <div class="control">
          <input class="input is-large" type="password" v-model="password">
        </div>
      </div>


      <div class="field is-grouped is-grouped-centered">
        <button class="button is-primary is-large is-fullwidth">
          Entrar
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import gapLogo from '~/assets/spider-gap-logo-alt.png'

export default {
  middleware: 'logged-off',

  layout: 'auth',

  data: () => ({
    gapLogo,
    username: '',
    password: '',
  }),

  mounted () {
    this.username = localStorage.getItem('lastUsername') || ''
  },

  computed: {
    ...mapGetters(['loggedUser', 'isLoggedIn']),
  },

  methods: {
    async login() {
      const { username, password } = this

      this.$store.dispatch('login', { username, password })
        .then(this.success)
        .catch(this.$translateError('Usuário ou senha incorretos.'))


    },

    success () {
      localStorage.setItem('lastUsername', this.username)

      this.$success('Login com sucesso!')

      this.$router.push({ path: '/about', success: true})
    }
  }
}
</script>

<style scoped>
.logo-container {
  text-align: center;
}

.logo-container img {
  max-width: 240px;
}
</style>
