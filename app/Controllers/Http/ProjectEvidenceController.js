'use strict'

const Helpers = use('Helpers')
const Drive = use('Drive')
const Project = use('App/Models/Project')
const ProjectEvidence = use('App/Models/ProjectEvidence')

const attrs = [
  'projectId',
  'evidenceId',
  'roleId',
  'process',
  'filename',
  'type',
  'typeId',
  'approval',
  'feedback'
]

class ProjectEvidenceController {
  async index ({ request }) {
    const proj = await Project.findOrFail(request.params.projects_id)
    return await ProjectEvidence.query().where({projectId: proj.id}).fetch()
  }

  async store ({ request }) {
    const data = request.only(attrs)
    const file = request.file('file', {
    })

    const filename = `${new Date().getTime()}-${file.stream.filename}`

    await file.move(Helpers.publicPath('uploads'), {
      name: filename
    })

    if (!file.moved()) {
      return file.error()
    }

    data.filename = filename

    const project = await Project.findOrFail(request.params.projects_id)
      .catch(() => {
        throw {status: 400, message: 'Invalid project_id'} // eslint-disable-line
      })

    return await project.evidences().create(data)
  }

  async show ({ request }) {
    return await ProjectEvidence.findOrFail(request.params.id)
  }

  async update ({ request }) {
    const evi = await ProjectEvidence.findOrFail(request.params.id)
    const data = request.only(attrs)
    evi.merge(data)
    await evi.save()
    return evi
  }

  async destroy ({ request }) {
    const evi = await ProjectEvidence.query().where({
      id: request.params.id
    }).first()

    const file = Helpers.publicPath('uploads') + '/' + evi.filename

    if (await Drive.exists(file)) {
      await Drive.delete(file)
    }

    await evi.delete()
  }
}

module.exports = ProjectEvidenceController
