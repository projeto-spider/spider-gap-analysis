<template>
  <div class="container is-fluid">
    <div class="card" v-for="evidence in filteredRows">
      <div class="card-content">
        <div class="media">
          <div class="media-left">
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
      unit: {},
      evidences: [],
      selectedLevels: [],
      selectedProcesses: [],
      availableLevels: [],
      availableProcesses: [],
      projectEvidences: [],
      newEvidence: Object.assign({}, emptyProjectEvidence),
      dropFiles: [],
    }

    data.project = await app.$axios.$get(`/projects/${id}`)
    data.unit = await app.$axios.$get(`/units/${data.project.unitId}`)
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
    data.selectedLevels = data.availableLevels.slice()
    data.selectedProcesses = data.availableProcesses.slice()

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
</style>
