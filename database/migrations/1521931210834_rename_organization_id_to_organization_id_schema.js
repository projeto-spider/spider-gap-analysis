'use strict'

const Schema = use('Schema')

class RenameOrganizationIdToOrganizationIdSchema extends Schema {
  up () {
    this.table('units', (table) => {
      table.renameColumn('organization_id', 'organizationId')
    })
  }

  down () {
    this.table('units', (table) => {
      table.renameColumn('organizationId', 'organization_id')
    })
  }
}

module.exports = RenameOrganizationIdToOrganizationIdSchema
