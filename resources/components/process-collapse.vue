<template>
  <div>
    <b-collapse
      :open="false"
      class="card"
      style="margin-bottom: 15px"
      :style="{ backgroundColor: rows.length > 1 ? '#fff': '#dbdbdb' }"
    >
      <div slot="trigger" slot-scope="props" class="card-header">
        <p class="card-header-title">
          <span>{{ process.description }}</span>
        </p>

        <span v-if="progress" class="card-header-icon">
          <progress
            class="progress"
            :class="{ [progress.colorClass]: true }"
            style="width: 100px"
            :value="progress.value"
            :max="progress.max"
          ></progress>
        </span>
      </div>

      <div class="card-content" style="padding: 0">
        <div class="content">
          <table class="table is-fullwidth is-striped" style="border-top: 1px solid #dedede;">
            <thead>
              <tr>
                <th style="min-width: 150px; text-align: center">ID</th>
                <th>Descrição</th>
                <th style="min-width: 300px; text-align: center">Evidência</th>
                <th v-if="showEvaluationColumn" style="min-width: 300px; text-align: center">Avaliação</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="{ key, type, expectedResult, processAttribute, projectEvidence } in rows"
                :key="key"
              >
                <template v-if="type === 'expectedResult'">
                  <td style="min-width: 150px; text-align: center">
                    {{expectedResult.id}}
                  </td>

                  <td>
                    <p>{{ expectedResult.description }}</p>
                    <p class="has-text-grey" style="font-size: .9em">{{ expectedResult.evidence }}</p>
                  </td>

                  <td style="min-width: 300px; text-align: center">
                    <template v-if="projectEvidence">
                      <button
                        @click="viewProjectEvidence(projectEvidence)"
                        class="button is-primary"
                      >Ver Evidência</button>
                      <button
                        v-if="!readOnlyProjectEvidences"
                        @click="destroyProjectEvidence(projectEvidence)"
                        class="button is-danger"
                      >Excluir</button>
                    </template>

                    <button
                      v-else-if="!readOnlyProjectEvidences"
                      @click="() => openFormModal('expectedResult', expectedResult.id)"
                      class="button is-secondary"
                    >Inserir Evidência</button>

                    <span v-else>-</span>
                  </td>
                </template>

                <template v-else-if="type === 'separator'">
                  <td :colspan="showEvaluationColumn ? 4 : 3" style="background-color: rgb(121, 121, 121); color: #fff">
                    Atributos de Processo
                  </td>
                </template>

                <template v-else-if="type === 'processAttribute'">
                  <td style="min-width: 150px; text-align: center">{{ processAttribute.id }}</td>

                  <td>
                    <p>{{ processAttribute.description }}</p>
                    <p class="has-text-grey" style="font-size: .9em">{{ processAttribute.evidence }}</p>
                  </td>

                  <td style="min-width: 300px; text-align: center">
                    <template v-if="projectEvidence">
                      <button
                        @click="viewProjectEvidence(projectEvidence)"
                        class="button is-primary"
                      >Ver Evidência</button>
                      <button
                        v-if="!readOnlyProjectEvidences"
                        @click="destroyProjectEvidence(projectEvidence)"
                        class="button is-danger"
                      >Excluir</button>
                    </template>

                    <button
                      v-else-if="!readOnlyProjectEvidences"
                      @click="() => openFormModal('processAttribute', `${process.id}-${processAttribute.id}`)"
                      class="button is-secondary"
                    >Inserir Evidência</button>

                    <span v-else>-</span>
                  </td>
                </template>

                <td
                  v-if="showEvaluationColumn && type !== 'separator'"
                >
                  <template v-if="projectEvidence">
                    <approval-input
                      :projectEvidence="projectEvidence"
                      :onChangeApprovalStatus="onChangeApprovalStatus"
                      :onChangeFeedback="onChangeFeedback"
                    ></approval-input>
                  </template>

                  <template v-else>
                    -
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </b-collapse>

    <evidence-modal
      :isActive="!!viewerModal"
      :projectEvidence="viewerModal.projectEvidence"
      :evidence="viewerModal.evidence"
      :role="viewerModal.role"
      @close="closeProjectEvidenceModal"
    ></evidence-modal>

    <evidence-form-modal
      :isActive="!!formModal"
      :roles="roles"
      :evidences="evidences"
      :onClose="closeFormModal"
      :onSubmit="onFormSubmit"
    ></evidence-form-modal>
  </div>
</template>

<script>
import EvidenceModal from '~/components/evidence-modal.vue'
import EvidenceFormModal from '~/components/evidence-form-modal.vue'
import ApprovalInput from '~/components/approval-input.vue'

export default {
  name: 'ProcessCollapse',

  components: { EvidenceModal, EvidenceFormModal, ApprovalInput },

  props: {
    readOnlyProjectEvidences: {
      type: Boolean,
      default: false
    },
    hideRowsWithoutEvidence: {
      type: Boolean,
      default: false
    },
    showEvaluationColumn: {
      type: Boolean,
      default: false
    },
    progressType: {
      type: String,
      default: 'howManyFilled'
    },

    process: Object,

    processAttributes: Array,
    roles: Array,
    evidences: Array,

    rolesById: Object,
    evidencesById: Object,
    indexedProjectEvidences: Object,

    createProjectEvidence: {
      type: Function,
      default: () => {}
    },
    destroyProjectEvidence: {
      type: Function,
      default: () => {}
    },

    onChangeApprovalStatus: {
      type: Function,
      default: () => {}
    },
    onChangeFeedback: {
      type: Function,
      default: () => {}
    }
  },

  data: () => ({
    viewerModal: false,
    formModal: false
  }),

  computed: {
    expectedResults () {
      if (this.process.id === 'Nível A') {
        return []
      }

      return this.$mps.expectedResultsByProcess[this.process.id]
    },

    rows () {
      const expectedResultRows = this.expectedResults.map(expectedResult => {
        const key = `expectedResult-${expectedResult.id}`
        const type = 'expectedResult'
        const projectEvidence = this.indexedProjectEvidences.expectedResult[expectedResult.id]

        return {
          key,
          type,
          expectedResult,
          projectEvidence
        }
      })

      const processAttributeRows = this.processAttributes.map(processAttribute => {
        const key = `processAttribute-${processAttribute.id}`
        const type = 'processAttribute'
        const projectEvidence = this.indexedProjectEvidences.processAttribute[`${this.process.id}-${processAttribute.id}`]

        return {
          key,
          type,
          processAttribute,
          projectEvidence
        }
      })

      const sepatator = [{ key: 'separator', type: 'separator' }]

      const allRows = expectedResultRows.concat(sepatator, processAttributeRows)

      if (this.hideRowsWithoutEvidence) {
        return allRows.filter(row => row.type === 'separator' || !!row.projectEvidence)
      }

      return allRows
    },

    progress () {
      const max = this.rows.length - 1

      if (this.progressType === 'howManyGreen') {
        const colorClass = 'is-success'
        const value = this.rows.filter(
          row => row.projectEvidence && row.projectEvidence.approval === 2
        ).length
        return { colorClass, max, value }
      }

      if (this.progressType === 'howManyFilled') {
        const colorClass = 'is-info'
        const value = this.rows.filter(row => row.projectEvidence).length
        return { colorClass, max, value }
      }

      return false
    }
  },

  methods: {
    viewProjectEvidence (projectEvidence) {
      const role = this.rolesById[projectEvidence.roleId]
      const evidence = this.evidencesById[projectEvidence.evidenceId]

      this.viewerModal = {
        projectEvidence,
        role,
        evidence
      }
    },

    closeProjectEvidenceModal () {
      this.viewerModal = false
    },

    openFormModal (type, typeId) {
      this.formModal = { type, typeId }
    },

    closeFormModal () {
      this.formModal = false
    },

    onFormSubmit (data) {
      this.createProjectEvidence({ ...this.formModal, ...data })
      this.closeFormModal()
    }
  }
}
</script>
