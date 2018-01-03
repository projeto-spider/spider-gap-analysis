'use strict'

const Model = use('Model')

class Role extends Model {
  unit() {
    return this.belongsTo('App/Models/Unit', 'unitId')
  }
}

module.exports = Role
