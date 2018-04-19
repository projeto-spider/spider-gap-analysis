<template>
  <section class="container">
    <h2 class="title">{{project.name}}</h2>
    <h3 class="subtitle">{{organization.name}} - {{unit.name}}</h3>

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
              <span>[{{level.id}}] {{level.title}}</span>
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
              <span>{{process.id}}</span>
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
            <tr v-for="projectEvidence in filteredRows">
              <td>Nível {{projectEvidence.level}}</td>
              <td>
                <span>{{projectEvidence.id}}</span>
              </td>
              <td>{{projectEvidence.type === 'expectedResult' ? 'Resultado Esperado' : 'Atributo de Processo'}}</td>
              <td>{{projectEvidence.evidence}}</td>
              <td>
                <a :href="`/uploads/${projectEvidence.filename}`" target="_blank" class="button is-secondary">Arquivo</a>
              </td>
              <td>
                <b-field>
                  <b-radio-button v-model="projectEvidence.original.approval" :native-value="0" type="is-danger" @input="updateApprovalStatus(projectEvidence.original)">
                    <b-icon icon="close"></b-icon>
                    <span>Vermelho</span>
                  </b-radio-button>

                  <b-radio-button v-model="projectEvidence.original.approval" :native-value="1" type="is-warning" @input="updateApprovalStatus(projectEvidence.original)">
                    Amarelo
                  </b-radio-button>

                  <b-radio-button v-model="projectEvidence.original.approval" :native-value="2" type="is-success" @input="updateApprovalStatus(projectEvidence.original)">
                    <b-icon icon="check"></b-icon>
                    <span>Verde</span>
                  </b-radio-button>
                </b-field>
              </td>
              <td>
                <b-field v-if="projectEvidence.original.approval < 2">
                  <b-input
                    v-model="projectEvidence.original.feedback"
                    @input="updateFeedback(projectEvidence.original)"
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
