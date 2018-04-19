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

    <div class="card" v-for="projectEvidence in filteredRows">
      <div class="card-content">
        <div class="media">
          <div class="media-left media-left-approval">
            <span v-if="projectEvidence.original.approval === 2" class="tag is-primary is-medium">Verde</span>
            <span v-else-if="projectEvidence.original.approval === 1" class="tag is-warning is-medium">Amarelo</span>
            <span v-else class="tag is-danger is-medium">Vermelho</span>
          </div>
          <div class="media-content">
            <p class="title is-4">{{projectEvidence.id}}</p>
            <p class="subtitle is-6">Nível {{projectEvidence.level}}</p>
            <div class="content" v-if="projectEvidence.original.feedback">
              {{projectEvidence.original.feedback}}
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

export default {
  layout: 'report',

  middleware: 'is-reviewer',

  async asyncData({ app, params }) {
    const {id} = params

    const data = {
      levels: Object.values(levels),
      process: Object.values(process),
      isModalActive: false,
      expectedResults: Object.values(expectedResults),
      processAttributes: Object.values(processAttributes),
      project: {},
      organization: {},
      unit: {},
      evidences: [],
      selectedLevels: [],
      selectedProcesses: [],
      excludedLevels: [],
      availableLevels: [],
      availableProcesses: [],
      projectEvidences: [],
      newEvidence: Object.assign({}, emptyProjectEvidence),
      dropFiles: [],
      countColors: {},
      percentColors: {}
    }

    data.project = await app.$axios.$get(`/projects/${id}`)
    data.unit = await app.$axios.$get(`/units/${data.project.unitId}`)
    data.organization = await app.$axios.$get(`/organizations/${data.unit.organizationId}`)
    data.evidences = await app.$axios.$get('/evidences')
    data.evidencesDb = data.evidences
      .reduce((acc, evidence) => {
        acc[evidence.id] = evidence
        return acc
      }, {})
    data.roles = await app.$axios.$get('/roles')
    data.projectEvidences = await app.$axios.$get(`/projects/${id}/evidences`)
    data.availableLevels = await app.$axios.$get(`/units/${data.project.unitId}/levels`).then(r =>
      r.map(level => level.level_id).sort()
    )
    data.availableProcesses = [...new Set(
      data.projectEvidences
        .map(evi => evi.typeId)
    )]
    data.selectedProcesses = data.availableProcesses.slice()
    data.selectedLevels = data.availableLevels.slice()
    data.excludedLevels = Object.values(levels).filter(l => !data.availableLevels.includes(l.id)).map(l => l.id).sort()

    data.countColors = data.projectEvidences
      .reduce((acc, evi) => {
        acc[evi.approval]++
        return acc
      }, {0: 0, 1: 0, 2: 0})

    data.percentColors = {
      0: parseInt(100 * (data.countColors[0] / data.projectEvidences.length)),
      1: parseInt(100 * (data.countColors[1] / data.projectEvidences.length)),
      2: parseInt(100 * (data.countColors[2] / data.projectEvidences.length))
    }

    return data
  },

  head () {
    return {
      title: 'Relatório'
    }
  },

  computed: {
    filteredRows() {
      const validLevels = new Set(this.selectedLevels)
      const validProcessAttributes = new Set(
        levels[this.project.levelId].attributes
      )

      return this.projectEvidences
        .map(projectEvidence => {
          const { type, filename, evidenceId } = projectEvidence
          const id = projectEvidence.typeId

          const maybeProcess = type === 'expectedResult'
            ? expectedResults[id] && process[expectedResults[id].process]
            : false

          const getLevelFromProcess = process =>
            process.levels
              ? process.levels[process.levels.length - 1]
              : process.level

          const level = type === 'expectedResult'
            ? (maybeProcess ? getLevelFromProcess(maybeProcess) : '-')
            : this.project.levelId

          // Blank invalid

          const getProcessAttributeId = attributeWithSubId =>
            // Example 'AP 5.1 (IV)' => 'AP 5.1'
            attributeWithSubId.split(' ').slice(0, -1).join(' ')

          if (
            (type === 'expectedResult' && !expectedResults[id]) ||
            (type === 'processAttribute' && !processAttributes[getProcessAttributeId(id)]) ||
            !this.evidencesDb[evidenceId]
          ) return

          const evidence = this.evidencesDb[evidenceId].name

          return {
            type,
            id,
            level,
            filename,
            evidence,
            original: projectEvidence
          }
        })
        .filter(projectEvidence => projectEvidence)
    },
  },

  methods: {
    updateApprovalStatus(evidence) {
      this.$axios.$put(`/projects/${this.project.id}/evidences/${evidence.id}`, {
        approval: evidence.approval
      })
    },

    updateFeedback(evidence) {
      this.$axios.$put(`/projects/${this.project.id}/evidences/${evidence.id}`, {
        feedback: evidence.feedback
      })
    },
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
