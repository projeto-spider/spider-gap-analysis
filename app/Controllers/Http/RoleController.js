'use strict'

const Unit = use('App/Models/Unit')
const Role = use('App/Models/Role')

const attrs = [
  'name',
  'description',
  'unitId'
]

class RoleController {
  async index () {
    return await Role.all()
  }

  async fromUnit ({ request }) {
    return await Role.query()
      .where('unitId', request.params.unitId)
      .fetch()
  }

  async store ({ request }) {
    const data = request.only(attrs)
    const unit = await Unit.findOrFail(+data.unitId)
      .catch(() => {
        throw {status: 400, message: 'Invalid unitId'}
      })

    return await unit.roles().create(data)
  }

  async show ({ request }) {
    return await Role.findOrFail(request.params.id)
  }

  async update ({ request }) {
    const role = await Role.findOrFail(request.params.id)
    const data = request.only(attrs)
    role.merge(data)
    await role.save()
    return role
  }

  async destroy ({ request }) {
    const role = await Role.findOrFail(request.params.id)
    await role.delete()
  }
}

module.exports = RoleController
