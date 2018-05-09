<template>
  <section class="container">
    <h2 class="title">{{project.name}}</h2>
    <h3 class="subtitle">{{organization.name}} - {{unit.name}}</h3>

    <p><h5 class="title is-5">Avaliação</h5></p>

    <router-link class="button" :to="`/evaluation/report/${$route.params.id}`" target="_blank">
      Relatório
    </router-link>

    <br>
    <br>

    <div
      v-for="process in selectedProcesses"
      :key="process.id"
      v-if="expectedResultsByProcessWithEvidence[process.id].length || attributesByProcessWithEvidence[process.id].length"
    >
      <h5 class="title is-5">{{ process.id }}</h5>

      <table class="table is-fullwidth">
        <thead>
          <tr>
            <th>ID</th>
            <th>Evidência</th>
            <th>Arquivo</th>
            <th>Ações</th>
            <th>Feedback</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="result in expectedResultsByProcessWithEvidence[process.id]"
            :key="result.id"
          >
            <td>{{ result.id }}</td>
            <td>{{ result.evidenceName }}</td>
            <td>
              <a :href="`/uploads/${result.projectEvidence.filename}`" target="_blank" class="button is-secondary">Arquivo</a>
            </td>
            <td>
              <b-field>
                <b-radio-button
                  v-model="result.projectEvidence.approval"
                  :native-value="0"
                  type="is-danger"
                  @input="updateApprovalStatus(result.projectEvidence)"
                >
                  <b-icon icon="close"></b-icon>
                  <span>Vermelho</span>
                </b-radio-button>

                <b-radio-button
                  v-model="result.projectEvidence.approval"
                  :native-value="1"
                  type="is-warning"
                  @input="updateApprovalStatus(result.projectEvidence)"
                >
                  Amarelo
                </b-radio-button>

                <b-radio-button
                  v-model="result.projectEvidence.approval"
                  :native-value="2" type="is-success"
                  @input="updateApprovalStatus(result.projectEvidence)"
                >
                  <b-icon icon="check"></b-icon>
                  <span>Verde</span>
                </b-radio-button>
              </b-field>
            </td>
            <td>
              <b-field v-if="result.projectEvidence.approval < 2">
                <b-input
                  v-model="result.projectEvidence.feedback"
                  @input="updateFeedback(result.projectEvidence)"
                  maxlength="200"
                  type="textarea"
                ></b-input>
              </b-field>
            </td>
          </tr>

          <tr
            v-for="attr in attributesByProcessWithEvidence[process.id]"
            :key="attr.id"
          >
            <td>{{ attr.id }}</td>
            <td>{{ attr.evidenceName }}</td>
            <td>
              <a :href="`/uploads/${attr.projectEvidence.filename}`" target="_blank" class="button is-secondary">Arquivo</a>
            </td>
            <td>
              <b-field>
                <b-radio-button
                  v-model="attr.projectEvidence.approval"
                  :native-value="0"
                  type="is-danger"
                  @input="updateApprovalStatus(attr.projectEvidence)"
                >
                  <b-icon icon="close"></b-icon>
                  <span>Vermelho</span>
                </b-radio-button>

                <b-radio-button
                  v-model="attr.projectEvidence.approval"
                  :native-value="1"
                  type="is-warning"
                  @input="updateApprovalStatus(attr.projectEvidence)"
                >
                  Amarelo
                </b-radio-button>

                <b-radio-button
                  v-model="attr.projectEvidence.approval"
                  :native-value="2" type="is-success"
                  @input="updateApprovalStatus(attr.projectEvidence)"
                >
                  <b-icon icon="check"></b-icon>
                  <span>Verde</span>
                </b-radio-button>
              </b-field>
            </td>
            <td>
              <b-field v-if="attr.projectEvidence.approval < 2">
                <b-input
                  v-model="attr.projectEvidence.feedback"
                  @input="updateFeedback(attr.projectEvidence)"
                  maxlength="200"
                  type="textarea"
                ></b-input>
              </b-field>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script>
import FormData from 'form-data'
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

const processesList = Object.values(processes)

const selectedFeaturesToSelectedProjects = (selectedFeatures) =>
  processesList
    .filter(({ id, level, levels }) =>
      levels
        // GPR
        ? levels.some(level => selectedFeatures[level].processes.includes(id))
        : selectedFeatures[level].processes.includes(id)
    )

export default {
  middleware: 'is-reviewer',

  async asyncData({ app, params }) {
    const {id} = params

    const data = {
      levels,
      process,
      isModalActive: false,
      expectedResults: Object.values(expectedResults),
      processAttributes: [],
      project: {},
      organization: {},
      unit: {},
      evidences: [],
      evidencesDb: {},
      selectedLevels: [],
      selectedProcesses: [],
      availableLevels: [],
      availableProcesses: [],
      projectEvidences: [],
      newEvidence: Object.assign({}, emptyProjectEvidence),
      dropFiles: [],
      expectedResultsByProcess: Object.values(expectedResults)
        .reduce((acc, result) => {
          if (!acc[result.process]) acc[result.process] = []
          acc[result.process].push(result)
          return acc
        }, {}),
      processAttributeBySelectedLevel: {}
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

    data.processAttributes = levels[data.project.levelId].attributes
      .map(attrId => processAttributes[attrId])

    data.availableProcesses = [...new Set(
      data.projectEvidences
        .map(evi => evi.typeId)
    )]
    data.selectedLevels = data.availableLevels.slice()
    data.selectedProcesses = data.availableProcesses.slice()

    data.processAttributeBySelectedLevel = Object.entries(data.unit.selectedFeatures)
      .reduce((acc, [level, { attributes }]) => {
        acc[level] = attributes.sort()
        return acc
      }, {})

    return data
  },

  created () {
    // Has to be done on created so the client rendering rehydratation
    // gets references to the local lists
    this.selectedProcesses = selectedFeaturesToSelectedProjects(this.unit.selectedFeatures)
  },

  head () {
    return {
      title: 'Avaliação'
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
          acc[process.id] = this.attributesForProcess(process)
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
    }
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

    attributesForProcess (process) {
      return this.processAttributeBySelectedLevel[
        process.levels
          // GPR
          ? process.levels.filter(level => level >= this.unit.levelId).pop()
          : process.level
      ]
    }
  }
}
</script>
