'use strict'

const Schema = use('Schema')

class UnitLevelSchema extends Schema {
  up () {
    this.create('unit_levels', (table) => {
      table.increments()
      table.integer('unit_id').unsigned()
      table.foreign('unit_id').references('unit.id')
      table.integer('level_id').notNull()
      table.timestamps()
    })
  }

  down () {
    this.drop('unit_levels')
  }
}

module.exports = UnitLevelSchema
