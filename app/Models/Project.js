'use strict'

const Model = use('Model')

class Project extends Model {
  unit() {
    return this.belongsTo('App/Models/Unit', 'unitId')
  }

  members() {
    return this.hasMany('App/Models/Member', 'id', 'roleId')
  }

  evidences() {
    return this.hasMany('App/Models/ProjectEvidence', 'id', 'projectId')
  }
}

module.exports = Project
