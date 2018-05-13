'use strict'

const Model = use('Model')
const levels = require('../../resources/static/levels.json')
const levelIds = Object.keys(levels)

class Unit extends Model {
  getSelectedProcesses (str) {
    return str
      .split(',')
      .filter(x => x)
  }

  setSelectedProcesses (arr) {
    return arr.join(',')
  }

  setLevelId (levelId) {
    if (!levelIds.includes(levelId)) return 'G'
    return levelId
  }

  getSelectedFeatures (str) {
    return JSON.parse(str)
  }

  setSelectedFeatures (obj) {
    if (typeof obj !== 'object' || Array.isArray(obj)) {
      throw new Error('Invalid selectedFeatures type')
    }

    if (levelIds.some(id => !obj[id])) {
      throw new Error('selectedFeatures must have all levels')
    }

    if (!Object.values(obj).every(level =>
      level.processes && Array.isArray(level.processes) &&
      level.attributes && Array.isArray(level.attributes)
    )) {
      throw new Error('selectedFeatures levels must have processes and attributes props as arrays')
    }

    return JSON.stringify(obj)
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
