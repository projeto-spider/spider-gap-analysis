<template>
  <section class="container">
    <h2 class="title">{{project.name}}</h2>
    <h3 class="subtitle">{{organization.name}} - {{unit.name}}</h3>

    <p><h4 class="title is-4">Associar Projetos às Evidências</h4></p>

    <process-collapse
      v-for="process in selectedProcesses"
      :key="process.id"

      :progressType="'howManyFilled'"

      :process="process"

      :processAttributes="selectedAttributes"
      :roles="roles"
      :evidences="evidences"

      :rolesById="rolesById"
      :evidencesById="evidencesById"
      :indexedProjectEvidences="indexedProjectEvidences"

      :loadingProjectEvidences="loadingProjectEvidences"

      :destroyProjectEvidence="destroyProjectEvidence"
      :createProjectEvidence="createProjectEvidence"
    ></process-collapse>
  </section>
</template>

<script>
import FormData from 'form-data'

import ProcessCollapse from '~/components/process-collapse.vue'

export default {
  middleware: 'is-admin',

  components: { ProcessCollapse },

  async asyncData ({ app, params }) {
    const { id } = params

    const data = {
      processAttributes: [],
      project: {},
      organization: {},
      unit: {},
      evidences: [],
      projectEvidences: [],
      selectedProcesses: [],
      selectedAttributes: [],
      loadingProjectEvidences: [],
      expectedResultsByProcess: app.mps.expectedResultsByProcess,
      processAttributesByLevel: app.mps.processAttributesByLevel
    }

    data.project = await app.$axios.$get(`/projects/${id}`)
    data.unit = await app.$axios.$get(`/units/${data.project.unitId}`)
    data.organization = await app.$axios.$get(`/organizations/${data.unit.organizationId}`)
    data.evidences = await app.$axios.$get(`/units/${data.unit.id}/evidences`)
    data.roles = await app.$axios.$get(`/units/${data.unit.id}/roles`)
    data.projectEvidences = await app.$axios.$get(`/projects/${id}/evidences`)

    data.selectedProcesses = app.mps.getUnitProcesses(data.unit)
    data.selectedAttributes = app.mps.processAttributesByLevel[data.unit.levelId]

    return data
  },

  head () {
    return {
      title: 'Evidência e Projeto'
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
    async createProjectEvidence ({ type, typeId, roleId, evidenceId, file }) {
      this.loadingProjectEvidences.push(`${type}-${typeId}`)

      const removeLoadingState = () => {
        this.loadingProjectEvidences = this.loadingProjectEvidences
          .filter(id => id !== `${type}-${typeId}`)
      }

      const form = new FormData()
      form.append('process', 1)
      form.append('projectdId', this.project.id)
      form.append('evidenceId', evidenceId)
      form.append('roleId', roleId)
      form.append('type', type)
      form.append('typeId', typeId)
      form.append('file', file)

      const created = await this.$axios.$post(`/projects/${this.$route.params.id}/evidences`, form)
        .catch(err => {
          removeLoadingState()
          return this.$translateError('Falha ao criar')(err)
        })

      this.$success('Criado com sucesso')

      removeLoadingState()
      this.projectEvidences.push(created)
      this.closeModal()
    },

    async destroyProjectEvidence (projectEvidence) {
      this.$dialog.confirm({
        title: 'Deletando evidência do projeto',
        message: 'Esta ação não pode ser desfeita',
        cancelText: 'Cancelar',
        confirmText: 'Deletar',
        type: 'is-danger',
        onConfirm: async () => {
          const { id: projectId } = this.$route.params

          await this.$axios.$delete(`/projects/${projectId}/evidences/${projectEvidence.id}`)
            .catch(this.$translateError('Falha ao deletar'))

          this.$success('Excluído com sucesso')

          this.projectEvidences = this.projectEvidences.filter(ev => ev.id !== projectEvidence.id)
        }
      })
    }
  }
}
</script>

