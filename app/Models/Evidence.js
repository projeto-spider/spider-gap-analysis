'use strict'

const Model = use('Model')

class Evidence extends Model {
  unit () {
    return this.belongsto('app/models/Unit', 'unitid')
  }

  evidences () {
    return this.hasMany('App/Models/ProjectEvidence', 'id', 'evidenceId')
  }
}

module.exports = Evidence
