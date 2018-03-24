<template>
  <section class="container">
    <h2 class="title">{{organization.name}}</h2>
    <h3 class="subtitle">{{unit.name}}</h3>

    <strong>Avaliação</strong>

    <br></br>

    <router-link class="button" :to="`/evaluation/report/${$route.params.id}`" target="_blank">
      Relatório
    </router-link>

    <br></br>

    <div class="card">
      <div class="card-content">
        <div class="content">
          <b-field>
            <b-checkbox v-model="selectedLevels"
              v-for="level in levels"
              v-if="availableLevels.includes(level.id)"
              :key="level.id"
              :native-value="level.id"
              type="is-success"
              >
              <span>[{{level.level}}] {{level.title}}</span>
            </b-checkbox>
          </b-field>
          <br/>

          <b-field>
            <b-checkbox v-model="selectedProcesses"
              v-for="process in process"
              v-if="availableProcesses.includes(process.id) && availableLevels.includes(process.levelId)"
              :key="process.id"
              :native-value="process.id"
              type="is-success"
              >
              <span>{{process.abbr}}</span>
            </b-checkbox>
          </b-field>
        </div>
      </div>
    </div>

    <br/>

    <div class="columns">
      <div class="column">
        <table class="table is-fullwidth">
          <thead>
            <tr>
              <th>Nível</th>
              <th>Identificador</th>
              <th>Tipo</th>
              <th>Evidência</th>
              <th>Arquivo</th>
              <th>Ações</th>
              <th>Feedback</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="evidence in filteredRows">
              <td>Nível {{evidence.level.level}}</td>
              <td>
                <span>{{evidence.reference.abbr}}</span>
              </td>
              <td>{{evidence.type === 'expectedResult' ? 'Resultado Esperado' : 'Atributo de Processo'}}</td>
              <td>{{evidence.evidence.name}}</td>
              <td>
                <a :href="`/uploads/${evidence.filename}`" target="_blank" class="button is-secondary">Arquivo</a>
              </td>
              <td>
                <b-field>
                  <b-radio-button v-model="evidence.original.approval" :native-value="0" type="is-danger" @input="updateApprovalStatus(evidence.original)">
                    <b-icon icon="close"></b-icon>
                    <span>Vermelho</span>
                  </b-radio-button>

                  <b-radio-button v-model="evidence.original.approval" :native-value="1" type="is-warning" @input="updateApprovalStatus(evidence.original)">
                    Amarelo
                  </b-radio-button>

                  <b-radio-button v-model="evidence.original.approval" :native-value="2" type="is-success" @input="updateApprovalStatus(evidence.original)">
                    <b-icon icon="check"></b-icon>
                    <span>Verde</span>
                  </b-radio-button>
                </b-field>
              </td>
              <td>
                <b-field v-if="evidence.original.approval < 2">
                  <b-input
                    v-model="evidence.original.feedback"
                    @input="updateFeedback(evidence.original)"
                    maxlength="200"
                    type="textarea"
                  ></b-input>
                </b-field>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script>
import FormData from 'form-data'
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
      availableLevels: [],
      availableProcesses: [],
      projectEvidences: [],
      newEvidence: Object.assign({}, emptyProjectEvidence),
      dropFiles: [],
    }

    data.project = await app.$axios.$get(`/projects/${id}`)
    data.unit = await app.$axios.$get(`/units/${data.project.unitId}`)
    data.organization = await app.$axios.$get(`/organizations/${data.unit.organizationId}`)
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
      title: 'Avaliação'
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
