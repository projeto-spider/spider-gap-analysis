'use strict'

const Organization = use('App/Models/Organization')
const Unit = use('App/Models/Unit')
const Project = use('App/Models/Project')
const Role = use('App/Models/Role')
const Member = use('App/Models/Member')
const Evidence = use('App/Models/Evidence')

/*
|--------------------------------------------------------------------------
| MockSeeder
|--------------------------------------------------------------------------
|
| Data for demo purposes
|
*/

class MockSeeder {
  async run () {
    console.log('Creating mock data for demo') // eslint-disable-line

    const organization = await Organization.create({
      name: 'Universidade Federal do Pará',
      fundationDate: new Date('Wed May 20 1992 00:00:00 GMT-0300 (Horário Padrão de Brasília)'),
      colaborators: 120,
      softwareColaborators: 20,
      description: 'Atua no seguimento de ensino de nível superior.',
      cep: '66075-110',
      address: 'Rua Augusto Corrêa',
      state: 'PA',
      city: 'Belém',
      complement: 'S/N',
      neighborhood: 'Guamá'
    })

    const unit = await Unit.create({
      organizationId: organization.id,
      name: 'Laboratório SPIDER',
      description: 'Focada em criar soluções personalizadas para os nossos clientes, sempre buscando simplificar sua gestão e os seus processos. Estamos comprometidos com a melhoria contínua, proporcionando aos nossos clientes negócios mais eficientes e rentáveis. Desenvolver e fornecer soluções de gestão empresarial através de softwares e serviços para potencializar a rentabilidade dos nossos clientes.',
      manager: 'João Ferreira',
      coordinator: 'Sandro Ronaldo Bezerra Oliveira',
      colaborators: 12,
      selectedProcesses: ['GPR', 'GRE', 'AQU', 'GCO', 'GQA', 'GPP', 'MED', 'AMP', 'DFP', 'GRH', 'GRU', 'GPR Evolução'],
      levelId: 'A'
    })

    const project = await Project.create({
      unitId: unit.id,
      name: 'SPIDER Gap Analysis',
      manager: 'Mario Ferreira',
      collaborators: 3,
      duration: 200,
      currentStep: 'Construção',
      type: 'Desenvolvimento',
      description: 'Projetos de Adaptação: Mudanças no software para acomodar alterações ocorridas no ambiente externo. Não há inclusão de novas funcionalidades. Estas mudanças podem ser no ambiente operacional (hardware, sistema operacional, mudanças na legislação ou em regras de negócio).',
      abbr: 'P1',
      lifeCycle: 'Testes unitários',
      startDate: new Date('Tue Oct 10 2017 00:00:00 GMT-0300 (Horário Padrão de Brasília)'),
      endDate: new Date('Wed May 16 2018 23:21:01 GMT-0300 (Horário Padrão de Brasília)'),
      clientType: 'Externo',
      importance: 'Alta',
      justification: 'Alta relevância no desenvolvimento.'
    })

    const [
      dba, analist, scrumMaster, productOwner, team
    ] = await Promise.all([
      ensureRole({ unitId: unit.id, name: 'DBA', description: 'Atua na criação, controle e administração do banco de dados.' }),
      ensureRole({ unitId: unit.id, name: 'Analista de sistemas', description: 'Analisa e desenvolve sistemas, mapeia processos, faz a modelagem de dados e levanta os requisitos para implementar esses programas de acordo com os objetivos e as regras de negócio da empresa contratante.' }),
      ensureRole({ unitId: unit.id, name: 'Scrum Master', description: 'Líder do Projeto com foco na implementação do processo do Scrum.' }),
      ensureRole({ unitId: unit.id, name: 'Product Owner', description: 'Representante do cliente no projeto.' }),
      ensureRole({ unitId: unit.id, name: 'Time', description: 'Equipe de Desenvolvimento do sistema.' })
    ])

    const memberPromises = Promise.all([
      ensureMember({ projectId: project.id, roleId: analist.id, name: 'Ana Luísa Soares' }),
      ensureMember({ projectId: project.id, roleId: scrumMaster.id, name: 'Marcia' }),
      ensureMember({ projectId: project.id, roleId: productOwner.id, name: 'Luiz Máecio' }),
      ensureMember({ projectId: project.id, roleId: team.id, name: 'Isabela' }),
      ensureMember({ projectId: project.id, roleId: team.id, name: 'Vitor' }),
      ensureMember({ projectId: project.id, roleId: team.id, name: 'Manoel' }),
      ensureMember({ projectId: project.id, roleId: dba.id, name: 'Paulo' })
    ])

    const evidencePromises = Promise.all([
      ensureEvidence({ unitId: unit.id, name: 'Diagramas', type: 'Afirmações', description: 'Realização de diagramas do projeto.' }),
      ensureEvidence({ unitId: unit.id, name: 'Protótipo de Concepção', type: 'Diretas', description: 'Descrição dos protótipo.' }),
      ensureEvidence({ unitId: unit.id, name: 'Email com consultores externos', type: 'Diretas', description: 'Comprovações de reuniões com consultores externos.' }),
      ensureEvidence({ unitId: unit.id, name: 'Plano do Projeto', type: 'Diretas', description: '??' }),
      ensureEvidence({ unitId: unit.id, name: 'Ata de Reunião', type: 'Diretas', description: '??' }),
      ensureEvidence({ unitId: unit.id, name: 'Planilha de Monitoramento', type: 'Diretas', description: '??' })
    ])

    await Promise.all([
      memberPromises, evidencePromises
    ])
  }
}

function ensureRole ({ unitId, name, description }) {
  return Role.findOrCreate(
    { unitId, name },
    { unitId, name, description }
  )
}

function ensureMember ({ projectId, roleId, name }) {
  const data = { projectId, roleId, name }

  return Member.findOrCreate(
    data,
    data
  )
}

function ensureEvidence ({ unitId, name, type, description }) {
  return Evidence.findOrCreate(
    { unitId, name },
    { unitId, name, type, description }
  )
}

module.exports = MockSeeder
