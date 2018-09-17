<template>
  <section class="hero is-fullheight">
    <!-- Hero head: will stick at the top -->
    <div class="hero-head">
      <section class="hero is-info">
        <div class="hero-head">
          <nav class="navbar">
            <div class="container">
              <div class="navbar-brand">
                <router-link class="navbar-item" to="/" exact>
                  SPIDER Gap Analysis
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
                <nuxt-link tag="li" :to="isLoggedIn ? '/about' : '/'" exact v-if="isAdmin">
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
    <div class="hero-body main-content">
      <nuxt/>
    </div>

    <!-- Hero footer: will stick at the bottom -->
    <div class="hero-foot">
      <section class="hero is-info">
        <div class="hero-body">
          <div class="container">
            <div class="columns">
              <div class="column">
                <p>Universidade Federal do Pará</p>
                <p>Programa de Pós-Graduação em Computação Aplicada - PPCA</p>
                <p>Faculdade de Computação</p>
              </div>

              <div class="column column-logos">
                <a href="http://spider.ufpa.br/" target="_blank">
                  <img class="logo spider-logo" :src="spiderLogo">
                </a>

                <a href="https://portal.ufpa.br/" target="_blank">
                  <img class="logo ufpa-logo" :src="ufpaLogo">
                </a>

                <a href="https://github.com/projeto-spider/spider-gap-analysis" target="_blank">
                  <img class="logo gap-logo" :src="gapLogo">
                </a>
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
import gapLogo from '~/assets/spider-gap-logo-alt.png'
import spiderLogo from '~/assets/spider-logo.png'
import ufpaLogo from '~/assets/ufpa-logo.png'

export default {
  data: () => ({
    gapLogo,
    spiderLogo,
    ufpaLogo
  }),

  computed: {
    ...mapGetters(['loggedUser', 'isLoggedIn', 'isAdmin', 'isReviewer'])
  },

  methods: {
    async logout () {
      await this.$store.dispatch('logout')
      this.$router.push('/')
    }
  }
}
</script>

<style lang="sass" src="@/assets/overrides.scss"></style>

<style scoped>
.main-content {
  background-color: #f1f1f1;
}

.logo {
  height: auto;
  margin-left: 32px;
}

.column-logos {
  text-align: right;
}

.gap-logo {
  width: 72px;
}

.spider-logo {
  width: 48px;
}

.ufpa-logo {
  width: 60px;
}
</style>

<style>
/* Fix not evenly separated form items */

.field.is-grouped .field.is-expanded {
  flex-basis: 0;
}
</style>
