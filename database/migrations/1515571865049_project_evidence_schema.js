'use strict'

const Schema = use('Schema')

class ProjectEvidenceSchema extends Schema {
  up () {
    this.create('project_evidences', (table) => {
      table.increments()
      table.integer('projectId').unsigned().notNullable()
      table.foreign('projectId').references('projects.id')
      table.integer('evidenceId').unsigned().notNullable()
      table.foreign('evidenceId').references('evidences.id')
      table.integer('roleId').unsigned().notNullable()
      table.foreign('roleId').references('roles.id')
      table.integer('process').notNullable()
      table.string('type').notNullable()
      table.integer('typeId').notNullable()
      table.string('filename')
      table.string('feedback')
      table.integer('approval').notNullable().defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('project_evidences')
  }
}

module.exports = ProjectEvidenceSchema
