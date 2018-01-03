'use strict'

const Model = use('Model')

class Member extends Model {
  project() {
    return this.belongsTo('App/Models/Project', 'projectId')
  }

  role() {
    return this.belongsTo('App/Models/Role', 'roleId')
  }
}

module.exports = Member
