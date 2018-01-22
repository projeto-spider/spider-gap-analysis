'use strict'

const Model = use('Model')

class ProjectEvidence extends Model {
  project() {
    return this.belongsTo('App/Models/Project', 'projectId')
  }

  evidence() {
    return this.belongsTo('App/Models/Evidence', 'evidenceId')
  }

  role() {
    return this.belongsTo('App/Models/Role', 'roleId')
  }
}

module.exports = ProjectEvidence
