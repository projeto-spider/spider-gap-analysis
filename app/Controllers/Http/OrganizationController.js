'use strict'

const Organization = use('App/Models/Organization')

class OrganizationController {
  async index () {
    return await Organization.all()
  }

  async store ({ request }) {
    const data = request.post()
    return await Organization.create(data)
  }

  async show ({ request }) {
    return await Organization.findOrFail(request.params.id)
  }

  async update ({ request }) {
    const org = await Organization.findOrFail(request.params.id)
    const data = request.post()
    org.merge(data)
    await org.save()
    return org
  }

  async destroy ({ request }) {
    const org = await Organization.findOrFail(request.params.id)
    await org.delete()
  }
}

module.exports = OrganizationController
