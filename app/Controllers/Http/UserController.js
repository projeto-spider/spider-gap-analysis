'use strict'

class UserController {
  async login ({ request, auth }) {
    const { username, password } = request.all()
    return await auth.attempt(username, password)
  }

  async me ({ auth, params }) {
    return auth.user
  }

  async logout ({ auth, params }) {
    return await auth.logout()
  }

  async index () {
  }

  async create () {
  }

  async store () {
  }

  async show () {
  }

  async edit () {
  }

  async update () {
  }

  async destroy () {
  }
}

module.exports = UserController
