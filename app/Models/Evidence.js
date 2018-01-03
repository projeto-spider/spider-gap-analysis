'use strict'

const Model = use('Model')

class Evidence extends Model {
  unit() {
    return this.belongsto('app/models/unit', 'unitid')
  }
}

module.exports = Evidence
