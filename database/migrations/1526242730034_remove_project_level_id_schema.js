'use strict'

const Schema = use('Schema')

class RemoveProjectLevelIdSchema extends Schema {
  up () {
    this.table('projects', (table) => {
      table.dropColumn('levelId')
    })
  }

  down () {
    this.table('projects', (table) => {
      table.integer('levelId').notNullable()
    })
  }
}

module.exports = RemoveProjectLevelIdSchema
