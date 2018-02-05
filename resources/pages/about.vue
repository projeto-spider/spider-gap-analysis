<template>
  <section class="container">
    <h1 class="title">
      Bem vindo(a) {{ loggedUser.username }}
    </h1>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  middleware: 'logged-in',

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
