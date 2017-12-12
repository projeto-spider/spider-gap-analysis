'use strict'

const Schema = use('Schema')

class OrganizationSchema extends Schema {
  up () {
    this.create('organizations', (table) => {
      table.increments()
      table.string('name')
      table.date('fundationDate')
      table.integer('colaborators')
      table.integer('softwareColaborators')
      table.string('description')
      table.string('cep')
      table.string('address')
      table.string('state')
      table.string('city')
      table.string('complement')
      table.string('neighborhood')
      table.timestamps()
    })
  }

  down () {
    this.drop('organizations')
  }
}

module.exports = OrganizationSchema
