'use strict'

const Organization = use('App/Models/Organization')
const Unit = use('App/Models/Unit')
const Project = use('App/Models/Project')
const Member = use('App/Models/Member')

class TableController {
  async organizations () {
    return await Organization.query()
      .select('id', 'name')
  }

  async units () {
    return await Unit.query()
      .select('units.id', 'units.name', 'organizations.name as organizationName')
      .innerJoin('organizations', 'units.organizationId', 'organizations.id')
  }

  async projects () {
    return await Project.query()
      .select(
        'projects.id',
        'projects.name',
        'organizations.name as organizationName',
        'units.name as unitName'
      )
      .innerJoin('units', 'projects.unitId', 'units.id')
      .innerJoin('organizations', 'units.organizationId', 'organizations.id')
  }

  async members () {
    return await Member.query()
      .select(
        'members.id',
        'members.name',
        'projects.name as projectName',
        'roles.name as roleName',
      )
      .innerJoin('projects', 'members.projectId', 'projects.id')
      .innerJoin('roles', 'members.roleId', 'roles.id')
  }
}

module.exports = TableController
