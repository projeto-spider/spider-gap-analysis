'use strict'

const Project = use('App/Models/Project')
const Role = use('App/Models/Role')
const Member = use('App/Models/Member')

const attrs = [
  'projectId',
  'roleId',
  'name',
  'cpf',
  'email',
  'telephone',
  'superior'
]

class MemberController {
  async index () {
    return await Member
      .query()
      .with('project')
      .with('role')
      .fetch()
  }

  async store ({ request }) {
    const data = request.only(attrs)

    const proj = await Project.findOrFail(data.projectId)
      .catch(() => {
        throw {status: 400, message: 'Invalid projectId'}
      })
    const role = await Role.findOrFail(data.roleId)
      .catch(() => {
        throw {status: 400, message: 'Invalid roleId'}
      })

    return await proj.members().create(data)
  }

  async show ({ request }) {
    return await Member.query()
      .where('id', request.params.id)
      .with('project')
      .with('role')
      .first()
  }

  async update ({ request }) {
    const member = await Member.findOrFail(request.params.id)
    const data = request.only(attrs)
    member.merge(data)
    await member.save()
    return member
  }

  async destroy ({ request }) {
    const member = await Member.findOrFail(request.params.id)
    await member.delete()
  }
}

module.exports = MemberController
