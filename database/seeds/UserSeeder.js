'use strict'

const User = use('App/Models/User')

class UserSeeder {
  async run () {
    console.log('Setting up default users') // eslint-disable-line

    const userPromises = Promise.all([
      ensureUser({
        username: 'admin',
        password: 'admin',
        role: 10
      }),

      ensureUser({
        username: 'reviewer',
        password: 'reviewer',
        role: 9
      })
    ])

    await Promise.all([
      userPromises
    ])
  }
}

function ensureUser ({ username, password, role }) {
  return User.findOrCreate(
    { username },
    { username, password, role }
  )
}

module.exports = UserSeeder
