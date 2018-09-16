'use strict'

const Unit = use('App/Models/Unit')
const Evidence = use('App/Models/Evidence')

const attrs = [
  'unitId',
  'name',
  'description',
  'type'
]

class EvidenceController {
  async index () {
    return await Evidence.all()
  }

  async fromUnit ({ request }) {
    return await Evidence.query()
      .where('unitId', request.params.unitId)
  }

  async store ({ request }) {
    const data = request.only(attrs)
    const unit = await Unit.findOrFail(+data.unitId)
      .catch(() => {
        throw {status: 400, message: 'Invalid unitId'} // eslint-disable-line
      })

    return await unit.evidences().create(data)
  }

  async show ({ request }) {
    return await Evidence.findOrFail(request.params.id)
  }

  async update ({ request }) {
    const evidence = await Evidence.findOrFail(request.params.id)
    const data = request.only(attrs)
    evidence.merge(data)
    await evidence.save()
    return evidence
  }

  async destroy ({ request }) {
    const evidence = await Evidence.findOrFail(request.params.id)
    await evidence.delete()
  }
}

module.exports = EvidenceController
