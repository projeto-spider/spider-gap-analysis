'use strict'

const Organization = use('App/Models/Organization')
const Unit = use('App/Models/Unit')

const attrs = [
  'organization_id',
  'name',
  'description',
  'activity',
  'manager',
  'coordinator',
  'colaborators',
]

class UnitController {
  async index () {
    return await Unit.all()
  }

  async store ({ request }) {
    const data = request.only(attrs)
    const org = await Organization.findOrFail(data.organization_id)
      .catch(() => {
        throw {status: 400, message: 'Invalid organization_id'}
      })

    return await org.units().create(data)
  }

  async show ({ request }) {
    return await Unit.findOrFail(request.params.id)
  }

  async update ({ request }) {
    const unit = await Unit.findOrFail(request.params.id)
    const data = request.only(attrs)
    unit.merge(data)
    await unit.save()
    return unit
  }

  async destroy ({ request }) {
    const unit = await Unit.findOrFail(request.params.id)
    await unit.delete()
  }
}

module.exports = UnitController
