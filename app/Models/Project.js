'use strict'

const Model = use('Model')

class Project extends Model {
  unit() {
    return this.belongsTo('App/Models/Unit', 'unitId')
  }
}

module.exports = Project
