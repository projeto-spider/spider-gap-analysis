'use strict'

const Schema = use('Schema')

class AddUnitSelectedProcessesSchema extends Schema {
  up () {
    this.table('units', (table) => {
      table.renameColumn('expectedResults', 'selectedProcesses')
    })
  }

  down () {
    this.table('units', (table) => {
      table.renameColumn('selectedProcesses', 'expectedResults')
    })
  }
}

module.exports = AddUnitSelectedProcessesSchema
