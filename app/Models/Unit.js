'use strict'

const Model = use('Model')
const levelIds = Object.keys(require('../../resources/static/levels.json'))

class Unit extends Model {
  getExpectedResults(str) {
    return str
      .split(',')
      .filter(x => x)
  }

  setExpectedResults(arr) {
    return arr.join(',')
  }

  setLevelId (levelId) {
    if (!levelIds.includes(levelId)) return 'G'
    return levelId
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
