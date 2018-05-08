'use strict'

const Schema = use('Schema')

class AddUnitLevelIdColumnSchema extends Schema {
  up () {
    this.table('units', (table) => {
      table.string('levelId', 1)
        .defaultTo('G')
        .notNullable()
    })
  }

  down () {
    this.table('units', (table) => {
      table.dropColumn('levelId')
    })
  }
}

module.exports = AddUnitLevelIdColumnSchema
