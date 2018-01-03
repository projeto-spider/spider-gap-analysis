'use strict'

const Schema = use('Schema')

class RoleSchema extends Schema {
  up () {
    this.create('roles', (table) => {
      table.increments()
      table.integer('unitId').unsigned()
      table.foreign('unitId').references('units.id')
      table.string('name').notNullable()
      table.string('description').defaultTo('')
      table.timestamps()
    })
  }

  down () {
    this.drop('roles')
  }
}

module.exports = RoleSchema
