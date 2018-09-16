<template>
  <section class="container">
    <h2 class="title">{{project.name}}</h2>
    <h3 class="subtitle">{{organization.name}} - {{unit.name}}</h3>

    <router-link
      class="button is-info is-medium"
      :to="`/evaluation/report/${$route.params.id}`"
      target="_blank"
      style="float: right"
    >
      <span class="icon">
        <i class="fa fa-paperclip"></i>
      </span>
      <span>Relatório</span>
    </router-link>

    <h4 class="title is-4">Avaliação</h4>

    <process-collapse
      v-for="process in selectedProcesses"
      :key="process.id"

      :readOnlyProjectEvidences="true"
      :hideRowsWithoutEvidence="true"
      :showEvaluationColumn="true"
      :progressType="'howManyGreen'"

      :process="process"

      :processAttributes="selectedAttributes"
      :roles="roles"
      :evidences="evidences"

      :rolesById="rolesById"
      :evidencesById="evidencesById"
      :indexedProjectEvidences="indexedProjectEvidences"

      :onChangeApprovalStatus="onChangeApprovalStatus"
      :onChangeFeedback="onChangeFeedback"
    ></process-collapse>
  </section>
</template>

<script>
import ApprovalInput from '~/components/approval-input.vue'

import ProcessCollapse from '~/components/process-collapse.vue'

export default {
  middleware: 'is-reviewer',

  components: { ApprovalInput, ProcessCollapse },

  async asyncData ({ app, params }) {
    const { id } = params

    const data = {
      project: {},
      organization: {},
      unit: {},
      evidencesDb: {},
      selectedLevels: [],
      selectedProcesses: [],
      projectEvidences: [],
      expectedResultsByProcess: app.mps.expectedResultsByProcess,
      processAttributesByLevel: app.mps.processAttributesByLevel
    }

    data.project = await app.$axios.$get(`/projects/${id}`)
    data.unit = await app.$axios.$get(`/units/${data.project.unitId}`)
    data.organization = await app.$axios.$get(`/organizations/${data.unit.organizationId}`)

    const evidences = await app.$axios.$get('/evidences')
    data.evidences = evidences
    data.evidencesDb = evidences
      .reduce((acc, evidence) => {
        acc[evidence.id] = evidence
        return acc
      }, {})

    data.roles = await app.$axios.$get('/roles')
    data.projectEvidences = await app.$axios.$get(`/projects/${id}/evidences`)

    data.selectedProcesses = app.mps.getUnitProcesses(data.unit)
    data.selectedAttributes = app.mps.processAttributesByLevel[data.unit.levelId]

    return data
  },

  head () {
    return {
      title: 'Avaliação'
    }
  },

  computed: {
    evidencesById () {
      return this.evidences
        .reduce((acc, evidence) => {
          acc[evidence.id] = evidence
          return acc
        }, {})
    },

    rolesById () {
      return this.roles
        .reduce((acc, role) => {
          acc[role.id] = role
          return acc
        }, {})
    },

    indexedProjectEvidences () {
      const initialAcc = {
        expectedResult: {},
        processAttribute: {}
      }

      return this.projectEvidences
        .reduce((acc, projectEvidence) => {
          acc[projectEvidence.type][projectEvidence.typeId] = projectEvidence
          return acc
        }, initialAcc)
    }
  },

  methods: {
    onChangeApprovalStatus ({ id }, approval) {
      const foundProjectEvidence = this.projectEvidences.find(projectEvidence =>
        projectEvidence.id === id
      )

      if (!foundProjectEvidence) {
        return
      }

      foundProjectEvidence.approval = approval

      this.$axios.$put(`/projects/${this.project.id}/evidences/${id}`, {
        approval
      })
    },

    onChangeFeedback ({ id }, feedback) {
      const foundProjectEvidence = this.projectEvidences.find(projectEvidence =>
        projectEvidence.id === id
      )

      if (!foundProjectEvidence) {
        return
      }

      foundProjectEvidence.feedback = feedback

      this.$axios.$put(`/projects/${this.project.id}/evidences/${id}`, {
        feedback
      })
    }
  }
}
</script>
