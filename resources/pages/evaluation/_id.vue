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
import processes from '~/static/process.json'

export default {
  middleware: 'is-reviewer',

  async asyncData({ app, params }) {
    const { id } = params

    const data = {
      project: {},
      organization: {},
      unit: {},
      evidencesDb: {},
      selectedLevels: [],
      selectedProcesses: [],
      projectEvidences: [],
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

    data.availableProcesses = [...new Set(
      data.projectEvidences
        .map(evi => evi.typeId)
    )]

    const selectedProcessesSet = new Set(data.unit.selectedProcesses)
    data.selectedProcesses = Object.values(processes)
      .filter(({id}) => selectedProcessesSet.has(id))
    data.selectedAttributes = levels[data.unit.levelId].attributes

    return data
  },

  head () {
    return {
      title: 'Avaliação'
    }
  },

  computed: {
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
    }
  }
}
</script>
