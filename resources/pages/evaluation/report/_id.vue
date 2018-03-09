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
        <strong>Total Verde:</strong> {{countColors[2]}}
      </div>

      <div class="column">
        <strong>Total Amarelo:</strong> {{countColors[1]}}
      </div>

      <div class="column">
        <strong>Total Vermelho:</strong> {{countColors[0]}}
      </div>
    </div>

    <br>

    <div class="card" v-for="evidence in filteredRows">
      <div class="card-content">
        <div class="media">
          <div class="media-left media-left-approval">
            <span v-if="evidence.original.approval === 2" class="tag is-primary is-medium">Verde</span>
            <span v-else-if="evidence.original.approval === 1" class="tag is-warning is-medium">Amarelo</span>
            <span v-else class="tag is-danger is-medium">Vermelho</span>
          </div>
          <div class="media-content">
            <p class="title is-4">{{evidence.reference.abbr}}</p>
            <p class="subtitle is-6">Nível {{evidence.level.level}}</p>
            <div class="content" v-if="evidence.original.feedback">
              {{evidence.original.feedback}}
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
processAttributes.forEach(attr => {
  const p = process.find(p => p.id === attr.processId)
  attr.processName = p.abbr
  attr.levelId = p.levelId
})

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
      levels,
      process,
      isModalActive: false,
      expectedResults,
      processAttributes,
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
      countColors: {}
    }

    data.project = await app.$axios.$get(`/projects/${id}`)
    data.unit = await app.$axios.$get(`/units/${data.project.unitId}`)
    data.organization = await app.$axios.$get(`/organizations/${data.unit.organization_id}`)
    data.evidences = await app.$axios.$get('/evidences')
    data.roles = await app.$axios.$get('/roles')
    data.projectEvidences = await app.$axios.$get(`/projects/${id}/evidences`)
    data.availableLevels = await app.$axios.$get(`/units/${data.project.unitId}/levels`).then(r =>
      r.map(level => level.level_id)
    )
    data.availableProcesses = [...new Set(
      data.projectEvidences
        .map(evi => {
            return evi.type === 'expectedResult'
              ? expectedResults.find(er => er.id === evi.typeId).processId
              : processAttributes.find(pa => pa.id === evi.typeId).processId
        })
    )]
    data.selectedProcesses = data.availableProcesses.slice()
    data.selectedLevels = Object.values(levels).filter(l => data.availableLevels.includes(l.id)).map(l => l.level).sort()
    data.excludedLevels = Object.values(levels).filter(l => !data.availableLevels.includes(l.id)).map(l => l.level).sort()

    data.countColors = data.projectEvidences
      .reduce((acc, evi) => {
        acc[evi.approval]++
        return acc
      }, {0: 0, 1: 0, 2: 0})

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
        processAttributes
          .filter(attr => validLevels.has(attr.levelId))
          .map(pa => pa.attr)
      )

      return this.projectEvidences
        .map(evi => {
          const data = Object.assign({}, evi)
          data.original = evi
          const evidence = this.evidences.filter(e => e.id === evi.evidenceId)[0]

          data.evidence = evidence
          data.reference = data.type === 'expectedResult'
            ? expectedResults.find(er => er.id === data.typeId)
            : processAttributes.find(pa => pa.id === data.typeId)

          data.process = process.find(p => p.id === data.reference.processId)
          data.level = levels.find(({id}) => id === data.process.levelId)

          return data
        })
        .filter(evi => {
          if (evi.type === 'expectedResult') {
            return this.unit.expectedResults.includes(evi.typeId)
          }
          // TODO: properly handle this filter
          return true
        })
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
