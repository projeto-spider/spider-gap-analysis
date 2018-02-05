<template>
  <section class="hero is-fullheight">
    <!-- Hero head: will stick at the top -->
    <div class="hero-head">
      <section class="hero is-info">
        <div class="hero-head">
          <nav class="navbar">
            <div class="container">
              <div class="navbar-brand">
                <router-link class="navbar-item" to="/">
                  Pré Avaliação MPS - SW
                </router-link>

                <span class="navbar-burger burger" data-target="navbarMenuHeroB">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </div>

              <div class="navbar-menu">
                <div class="navbar-end">
                  <span v-if="isLoggedIn" class="navbar-item">
                    <button class="button is-danger" @click="logout">
                      <span class="icon">
                        <i class="fa fa-sign-out"></i>
                      </span>
                      <span>Logout</span>
                    </button>
                  </span>

                  <span class="navbar-item">
                    <a class="button is-info is-inverted" target="_blank" href="https://github.com/projeto-spider/spider-gap-analysis">
                      <span class="icon">
                        <i class="fa fa-github"></i>
                      </span>
                      <span>Código Fonte</span>
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </nav>
        </div>

        <div class="hero-foot">
          <nav class="tabs is-boxed is-fullwidth">
            <div class="container">
              <ul>
                <nuxt-link tag="li" to="/" exact v-if="isAdmin">
                  <a>Home</a>
                </nuxt-link>

                <nuxt-link tag="li" to="/organization" v-if="isAdmin">
                  <a>Organizações</a>
                </nuxt-link>

                <nuxt-link tag="li" to="/unit" v-if="isAdmin">
                  <a>Unidade Organizacional</a>
                </nuxt-link>

                <nuxt-link tag="li" to="/project" v-if="isAdmin">
                  <a>Projetos</a>
                </nuxt-link>

                <nuxt-link tag="li" to="/role" v-if="isAdmin">
                  <a>Fontes de Evidência</a>
                </nuxt-link>

                <nuxt-link tag="li" to="/member" v-if="isAdmin">
                  <a>Equipe</a>
                </nuxt-link>

                <nuxt-link tag="li" to="/evidence" v-if="isAdmin">
                  <a>Evidência</a>
                </nuxt-link>

                <nuxt-link tag="li" to="/project-evidences" v-if="isAdmin">
                  <a>Evidências e Projetos</a>
                </nuxt-link>

                <nuxt-link tag="li" to="/evaluation" v-if="isAdmin || isReviewer">
                  <a>Avaliação das Evidências</a>
                </nuxt-link>
              </ul>
            </div>
          </nav>
        </div>
      </section>
    </div>

    <!-- Hero content: will be in the middle -->
    <div class="hero-body">
      <nuxt/>
    </div>

    <!-- Hero footer: will stick at the bottom -->
    <div class="hero-foot">
      <section class="hero is-info">
        <div class="hero-body">
          <div class="container">
            <div class="columns">
              <div class="column">
                Programa de Pós-Graduação em Computação Aplicada - PPCA
              </div>
              <div class="column">
                <p>Mestrado Profissional em Computação Aplicada</p>
                <p>Mestrando: Silvia M. F. Brabo</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['loggedUser', 'isLoggedIn', 'isAdmin', 'isReviewer']),
  },

  methods: {
    async logout() {
      await this.$store.dispatch('logout')
      this.$router.push('/')
    }
  }
}
</script>

<style lang="sass" src="@/assets/overrides.scss"></style>
