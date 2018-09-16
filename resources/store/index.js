export const state = () => ({
  authUser: null
})

export const mutations = {
  SET_USER: function (state, user) {
    state.authUser = user
  }
}

export const actions = {
  nuxtServerInit ({ commit }, { req }) {
    const { auth } = req
    if (auth && auth.user) {
      commit('SET_USER', auth.user)
    }
  },

  async login ({ commit }, { username, password }) {
    try {
      const { data } = await this.$axios.post('/login', { username, password })
      commit('SET_USER', data)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }

      throw error
    }
  },

  async logout ({ commit }) {
    await this.$axios.post('/logout')
    commit('SET_USER', null)
  }
}

export const getters = {
  loggedUser (state) {
    return state.authUser
  },

  isLoggedIn (state) {
    return !!state.authUser
  },

  isAdmin (state) {
    return state.authUser && state.authUser.role === 10
  },

  isReviewer (state) {
    return state.authUser && state.authUser.role === 9
  }
}
