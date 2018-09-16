'use strict'

const Model = use('Model')

class Organization extends Model {
  static get dates () {
    return super.dates.concat(['fundationDate'])
  }

  units () {
    return this.hasMany('App/Models/Unit', 'id', 'organizationId')
  }
}

module.exports = Organization
