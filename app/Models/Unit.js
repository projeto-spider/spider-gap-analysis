'use strict'

const Model = use('Model')

class Unit extends Model {
  organization() {
    return this.belongsTo('App/Models/Organization')
  }
}

module.exports = Unit
