<template>
  <div class="container is-fluid">
    <center><h1 class="title is-1">Relatório Final</h1></center>

    <p><strong>Organização:</strong> {{organization.name}}</p>
    <p><strong>Unidade Organizacional:</strong> {{unit.name}}</p>
    <p><strong v-if="unit.description">Descrição das atividades da Unidade Organizacional:</strong> {{unit.description}}</p>

    <br>

    <center><h4 class="title is-4">Escopo da Avaliação</h4></center>

    <p><strong>Nível:</strong> {{selectedLevels.join(', ')}}</p>
    <p v-if="excludedLevels.length"><strong>Excluídos:</strong> {{excludedLevels.join(', ')}}</p>

    <div class="columns">
      <div class="column">
        <strong>Total Verde:</strong> {{countColors[2]}} ({{percentColors[2]}}%)
      </div>

      <div class="column">
        <strong>Total Amarelo:</strong> {{countColors[1]}} ({{percentColors[1]}}%)
      </div>

      <div class="column">
        <strong>Total Vermelho:</strong> {{countColors[0]}} ({{percentColors[0]}}%)
      </div>
    </div>

    <br>

    <div
      v-for="process in selectedProcesses"
      :key="process.id"
      v-if="expectedResultsByProcessWithEvidence[process.id].length || attributesByProcessWithEvidence[process.id].length"
    >
      <h5 class="title is-5">{{ process.id }}</h5>

      <div
        v-for="result in expectedResultsByProcessWithEvidence[process.id]"
        :key="result.id"
        class="card"
      >
        <div class="card-content">
          <div class="media">
            <div class="media-left media-left-approval">
              <span v-if="result.projectEvidence.approval === 2" class="tag is-primary is-medium">Verde</span>
              <span v-else-if="result.projectEvidence.approval === 1" class="tag is-warning is-medium">Amarelo</span>
              <span v-else class="tag is-danger is-medium">Vermelho</span>
            </div>
            <div class="media-content">
              <p class="title is-4">{{result.id}}</p>
              <p class="subtitle is-6">Nível {{ process.level || process.levels.filter(level => level >= unit.levelId).pop()}}</p>
              <div class="content" v-if="result.projectEvidence.feedback">
                {{result.projectEvidence.feedback}}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-for="attr in attributesByProcessWithEvidence[process.id]"
        :key="attr.id"
        class="card"
      >
        <div class="card-content">
          <div class="media">
            <div class="media-left media-left-approval">
              <span v-if="attr.projectEvidence.approval === 2" class="tag is-primary is-medium">Verde</span>
              <span v-else-if="attr.projectEvidence.approval === 1" class="tag is-warning is-medium">Amarelo</span>
              <span v-else class="tag is-danger is-medium">Vermelho</span>
            </div>
            <div class="media-content">
              <p class="title is-4">{{attr.id}}</p>
              <p class="subtitle is-6">Nível {{process.level}}</p>
              <div class="content" v-if="attr.projectEvidence.feedback">
                {{attr.projectEvidence.feedback}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import expectedResults from '~/static/expected-results.json'
import levels from '~/static/levels.json'
import process from '~/static/process.json'
const processes = process
import processAttributes from '~/static/process-attributes.json'

const emptyProjectEvidence = {
  projectId: 0,
  evidenceId: 0,
  roleId: 0,
  process: 0,
  filename: 0,
  type: 0,
  typeId: 0,
}

const flatten = xs =>
  xs.reduce((acc, ys) => acc.concat(ys), [])

export default {
  layout: 'report',

  middleware: 'is-reviewer',

  async asyncData({ app, params }) {
    const {id} = params

    const data = {
      expectedResults: Object.values(expectedResults),
      processAttributes: Object.values(processAttributes),
      project: {},
      organization: {},
      unit: {},
      evidences: [],
      selectedLevels: [],
      excludedLevels: [],
      selectedProcesses: [],
      projectEvidences: [],
      newEvidence: Object.assign({}, emptyProjectEvidence),
      dropFiles: [],
      expectedResultsByProcess: app.mps.expectedResultsByProcess
    }

    data.project = await app.$axios.$get(`/projects/${id}`)
    data.unit = await app.$axios.$get(`/units/${data.project.unitId}`)
    data.organization = await app.$axios.$get(`/organizations/${data.unit.organizationId}`)

    const evidences = await app.$axios.$get('/evidences')
    data.evidencesDb = evidences
      .reduce((acc, evidence) => {
        acc[evidence.id] = evidence
        return acc
      }, {})

    data.roles = await app.$axios.$get('/roles')
    data.projectEvidences = await app.$axios.$get(`/projects/${id}/evidences`)

    const selectedProcessesSet = new Set(data.unit.selectedProcesses)
    data.selectedProcesses = Object.values(processes)
      .filter(({id}) => selectedProcessesSet.has(id))
    data.selectedAttributes = levels[data.unit.levelId].attributes

    data.selectedLevels = Object.keys(levels).filter(level => level >= data.unit.levelId).reverse()
    data.excludedLevels = Object.keys(levels).filter(level => !data.selectedLevels.includes(level)).reverse()

    return data
  },

  head () {
    return {
      title: 'Relatório'
    }
  },

  computed: {
    validEvidences () {
      return flatten(Object.values(this.expectedResultsByProcessWithEvidence))
        .concat(flatten(Object.values(this.attributesByProcessWithEvidence)))
    },

    expectedResultsByProcessWithEvidence () {
      return Object.entries(this.expectedResultsByProcess)
        .reduce((acc, [process, expectedResults]) => {
          acc[process] = expectedResults.map(result => {
            const projectEvidence = this.projectEvidences.find(ev =>
              ev.type === 'expectedResult' && ev.typeId == result.id
            )

            if (!projectEvidence) return

            const evidenceName = this.evidencesDb[projectEvidence.evidenceId].name

            return Object.assign({}, result, {
              evidenceName,
              projectEvidence
            })
          })
          .filter(x => x)

          return acc
        }, {})
    },

    attributesByProcessWithEvidence () {
      return Object.values(processes)
        .reduce((acc, process) => {
          acc[process.id] = this.selectedAttributes
            .map(attribute => {
              const projectEvidence = this.projectEvidences.find(ev =>
                ev.type === 'processAttribute' && ev.typeId == `${process.id}-${attribute}`
              )

              if (!projectEvidence) return

              const evidenceName = this.evidencesDb[projectEvidence.evidenceId].name

              return {
                id: attribute,
                evidenceName,
                projectEvidence
              }
            })
            .filter(x => x)

          return acc
        }, {})
    },

    countColors() {
      return this.validEvidences
        .map(({ projectEvidence }) => projectEvidence)
        .reduce((acc, { approval }) => {
          acc[approval]++
          return acc
        }, {0: 0, 1: 0, 2: 0})
    },

    percentColors() {
      return {
        0: parseInt(100 * (this.countColors[0] / this.validEvidences.length)),
        1: parseInt(100 * (this.countColors[1] / this.validEvidences.length)),
        2: parseInt(100 * (this.countColors[2] / this.validEvidences.length))
      }
    }
  }
}
</script>

<style>
* {
  -webkit-print-color-adjust: exact;
}

body {
  padding: 10px;
}

.card {
  margin-bottom: 15px;
}

.tag {
  min-width: 50px;
}

@media print
{
  .card{
    page-break-inside: avoid;
  }
}

.media-left-approval > span {
  min-width: 100px;
}
</style>
