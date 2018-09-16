'use strict'

const Unit = use('App/Models/Unit')
const Project = use('App/Models/Project')

const attrs = [
  'name',
  'manager',
  'collaborators',
  'duration',
  'currentStep',
  'type',
  'description',
  'abbr',
  'lifeCycle',
  'startDate',
  'endDate',
  'clientType',
  'importance',
  'justification',
  'unitId'
]

class ProjectController {
  async index () {
    return await Project.all()
  }

  async fromUnit ({ request }) {
    return await Project.query()
      .where('unitId', request.params.unitId)
  }

  async store ({ request }) {
    const data = request.only(attrs)
    const unit = await Unit.findOrFail(+data.unitId)
      .catch(() => {
        throw {status: 400, message: 'Invalid unitId'} // eslint-disable-line
      })

    return await unit.projects().create(data)
  }

  async show ({ request }) {
    return await Project.findOrFail(request.params.id)
  }

  async update ({ request }) {
    const project = await Project.findOrFail(request.params.id)
    const data = request.only(attrs)
    project.merge(data)
    await project.save()
    return project
  }

  async destroy ({ request }) {
    const project = await Project.findOrFail(request.params.id)
    await project.delete()
  }
}

module.exports = ProjectController
