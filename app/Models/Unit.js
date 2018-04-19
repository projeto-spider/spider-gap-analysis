'use strict'

const Model = use('Model')

class Unit extends Model {
  getExpectedResults(str) {
    return str
      .split(',')
      .filter(x => x)
  }

  setExpectedResults(arr) {
    return arr.join(',')
  }

  organization() {
    return this.belongsTo('App/Models/Organization')
  }

  levels() {
    return this.hasMany('App/Models/UnitLevel')
  }

  projects() {
    return this.hasMany('App/Models/Project', 'id', 'unitId')
  }

  roles() {
    return this.hasMany('App/Models/Role', 'id', 'unitId')
  }

  evidences() {
    return this.hasMany('App/Models/Evidence', 'id', 'unitId')
  }

}

module.exports = Unit
