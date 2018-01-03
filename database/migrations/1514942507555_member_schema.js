'use strict'

const Schema = use('Schema')

class MemberSchema extends Schema {
  up () {
    this.create('members', (table) => {
      table.increments()
      table.integer('projectId').unsigned()
      table.foreign('projectId').references('projects.id')
      table.integer('roleId').unsigned()
      table.foreign('roleId').references('roles.id')
      table.string('name').notNullable()
      table.string('cpf').defaultTo('')
      table.string('email').defaultTo('')
      table.string('telephone').defaultTo('')
      table.string('superior').defaultTo('')
      table.timestamps()
    })
  }

  down () {
    this.drop('members')
  }
}

module.exports = MemberSchema
