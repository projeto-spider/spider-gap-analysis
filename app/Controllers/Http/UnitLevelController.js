'use strict'

const Unit = use('App/Models/Unit')
const UnitLevel = use('App/Models/UnitLevel')

const attrs = [
  'unit_id',
  'level_id'
]

class UnitLevelController {
  async index ({ request }) {
    const unit = await Unit.findOrFail(request.params.units_id)
    return await UnitLevel.query().where({unit_id: unit.id}).fetch()
  }

  async store ({ request }) {
    const data = request.only(attrs)
    const unit = await Unit.findOrFail(data.unit_id)
      .catch(() => {
        throw {status: 400, message: 'Invalid organizationId'} // eslint-disable-line
      })

    const exists = await UnitLevel.query().where({
      unit_id: unit.id,
      level_id: data.level_id
    }).fetch()

    if (exists.length) {
      throw {status: 400, message: 'Already exists'} // eslint-disable-line
    }

    return await unit.levels().create(data)
  }

  async show ({ request }) {
    return await UnitLevel.findOrFail(request.params.id)
  }

  async update ({ request }) {
    const unit = await UnitLevel.findOrFail(request.params.id)
    const data = request.only(attrs)
    unit.merge(data)
    await unit.save()
    return unit
  }

  async destroy ({ request }) {
    // const unit = await UnitLevel.findOrFail(request.params.id)
    const level = await UnitLevel.query().where({
      unit_id: request.params.units_id,
      level_id: request.params.id
    }).first()
    await level.delete()
  }
}

module.exports = UnitLevelController
