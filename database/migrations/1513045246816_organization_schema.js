'use strict'

const Schema = use('Schema')

class OrganizationSchema extends Schema {
  up () {
    this.create('organizations', (table) => {
      table.increments()
      table.string('name').notNullable()
      table.datetime('fundationDate').defaultTo(this.fn.now())
      table.integer('colaborators').defaultTo(0)
      table.integer('softwareColaborators').defaultTo(0)
      table.string('description').defaultTo('')
      table.string('cep').defaultTo('')
      table.string('address').defaultTo('')
      table.string('state').defaultTo('')
      table.string('city').defaultTo('')
      table.string('complement').defaultTo('')
      table.string('neighborhood').defaultTo('')
      table.timestamps()
    })
  }

  down () {
    this.drop('organizations')
  }
}

module.exports = OrganizationSchema
