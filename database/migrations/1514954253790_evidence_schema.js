'use strict'

const Schema = use('Schema')

class EvidenceSchema extends Schema {
  up () {
    this.create('evidences', (table) => {
      table.increments()
      table.integer('unitId').unsigned()
      table.foreign('unitId').references('units.id')
      table.string('type').notNullable()
      table.string('name').notNullable()
      table.string('description').defaultTo('')
      table.timestamps()
    })
  }

  down () {
    this.drop('evidences')
  }
}

module.exports = EvidenceSchema
