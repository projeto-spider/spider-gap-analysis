'use strict'

const Schema = use('Schema')

class ProjectSchema extends Schema {
  up () {
    this.create('projects', (table) => {
      table.increments()
      table.integer('unitId').unsigned()
      table.foreign('unitId').references('units.id')
      table.string('name').notNullable()
      table.string('manager').defaultTo('')
      table.integer('collaborators').defaultTo(0)
      table.integer('duration').defaultTo(0)
      table.string('currentStep').defaultTo('')
      table.string('type').defaultTo('')
      table.string('description').defaultTo('')
      table.string('abbr').defaultTo('')
      table.string('lifeCycle').defaultTo('')
      table.datetime('startDate').defaultTo(this.fn.now())
      table.datetime('endDate').defaultTo(this.fn.now())
      table.string('clientType').defaultTo('')
      table.string('importance').defaultTo('')
      table.string('justification').defaultTo('')
      table.integer('levelId').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('projects')
  }
}

module.exports = ProjectSchema
