'use strict'

const Model = use('Model')

class Unit extends Model {
  organization() {
    return this.belongsTo('App/Models/Organization')
  }

  levels() {
    return this.hasMany('App/Models/UnitLevel')
  }

  projects() {
    return this.hasMany('App/Models/Project', 'id', 'unitId')
  }
}

module.exports = Unit
