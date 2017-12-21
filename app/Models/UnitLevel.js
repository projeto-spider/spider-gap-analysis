'use strict'

const Model = use('Model')

class UnitLevel extends Model {
  unit() {
    return this.belongsTo('App/Models/Unit')
  }
}

module.exports = UnitLevel
