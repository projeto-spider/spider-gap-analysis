<template>
  <section class="hero is-fullheight auth-hero">
    <div class="hero-body is-paddingless" style="width: 100%;">
      <div class="columns is-marginless" style="width: 100%; min-height: 100vh">
        <div class="column column-form flex" style="flex-direction: column">
          <div class="is-hidden-desktop has-text-centered">
            <a href="https://github.com/projeto-spider/spider-gap-analysis" target="_blank">
              <img class="logo gap-logo" :src="gapLogo">
            </a>
          </div>

          <div class="login">
            <nuxt/>
          </div>
        </div>

        <div class="column is-hidden-touch column-wallpaper">
          <div class="oblique"></div>
          <div style="z-index: 2; text-align: center">
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
<style lang="sass" src="@/assets/auth-layout.sass" scoped></style>


<style scoped>
.auth-hero .column-form, .auth-hero .column-wallpaper {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Thanks: https://vuestic.epicmax.co/#/auth/login */
.auth-hero .column-wallpaper {
  background-color: #2c3e50;
  overflow: hidden;
  position: relative;
}

.auth-hero .column-wallpaper .oblique {
  position: absolute;
  background-color: #34495e;
  left: 36.5%;
  -webkit-transform: rotate(15deg);
  transform: rotate(15deg);
  width: 27%;
  height: 500vh;
}

.auth-hero .column-form .login {
  z-index: 2;
}

.logo {
  height: auto;
  margin-left: 32px;
}

.column-logos {
  text-align: right;
}

.gap-logo {
  max-width: 224px;
}

.spider-logo {
  max-width: 128px;
}

.ufpa-logo {
  width: 180px;
}
</style>
