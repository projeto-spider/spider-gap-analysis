'use strict'

const Schema = use('Schema')

class UnitSchema extends Schema {
  up () {
    this.create('units', (table) => {
      table.increments()
      table.integer('organization_id').unsigned()
      table.foreign('organization_id').references('organizations.id')
      table.string('name').defaultTo('')
      table.string('description').defaultTo('')
      table.string('activity').defaultTo('')
      table.string('manager').defaultTo(null)
      table.string('coordinator').defaultTo(null)
      table.integer('colaborators').defaultTo(0)
      table.string('expectedResults', 600).defaultTo('')
      table.timestamps()
    })
  }

  down () {
    this.drop('units')
  }
}

module.exports = UnitSchema
