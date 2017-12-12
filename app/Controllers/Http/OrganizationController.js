'use strict'

const Organization = use('App/Models/Organization')

const attrs = [
  'name',
  'fundationDate',
  'colaborators',
  'softwareColaborators',
  'description',
  'cep',
  'address',
  'state',
  'city',
  'complement',
  'neighborhood'
]

class OrganizationController {
  async index () {
    return await Organization.all()
  }

  async store ({ request }) {
    const data = request.only(attrs)
    return await Organization.create(data)
  }

  async show ({ request }) {
    return await Organization.findOrFail(request.params.id)
  }

  async update ({ request }) {
    const org = await Organization.findOrFail(request.params.id)
    const data = request.only(attrs)
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
