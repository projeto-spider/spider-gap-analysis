<template>
  <section class="container">
    <h2 class="title">{{project.name}}</h2>
    <h3 class="subtitle">{{organization.name}} - {{unit.name}}</h3>

    <p><h4 class="title is-4">Associar Projetos às Evidências</h4></p>

    <b-collapse
      v-for="process in selectedProcesses"
      :key="process.id"
      :open="false"
      class="card"
      style="margin-bottom: 15px"
    >
      <div slot="trigger" slot-scope="props" class="card-header">
        <p class="card-header-title">
          <span>{{ process.description }}</span>
        </p>

        <span v-if="progresses[process.id]" class="card-header-icon">
          <progress
            class="progress is-info"
            style="width: 100px"
            :value="progresses[process.id].filled"
            :max="progresses[process.id].total"
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
                <th style="min-width: 300px; text-align: center">Ações</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="result in expectedResultsByProcess[process.id]" :key="result.id">
                <td style="min-width: 150px; text-align: center">
                  {{result.id}}
                </td>

                <td>
                  <p>{{ result.description }}</p>
                  <p class="has-text-grey" style="font-size: .9em">{{ result.evidence }}</p>
                </td>

                <td style="min-width: 300px; text-align: center">
                  <template
                    v-if="evidencesFor['expectedResult'][result.id]"
                  >
                    <button
                      @click="openEvidence('expectedResult', result.id)"
                      class="button is-primary"
                    >Ver Evidência</button>
                    <button
                      @click="destroy('expectedResult', result.id)"
                      class="button is-danger"
                    >Excluir</button>
                  </template>

                  <button
                    v-else
                    @click="openModal('expectedResult', result.id)"
                    class="button is-secondary"
                  >Inserir Evidência</button>
                </td>
              </tr>

              <tr>
                <td colspan="3" style="background-color: rgb(121, 121, 121); color: #fff">
                  Atributos de Processo
                </td>
              </tr>

              <tr
                v-for="attr in selectedAttributes"
                :key="attr.id"
              >
                <td style="min-width: 150px; text-align: center">{{ attr.id }}</td>

                <td>
                  <p>{{ attr.description }}</p>
                  <p class="has-text-grey" style="font-size: .9em">{{ attr.evidence }}</p>
                </td>

                <td style="min-width: 300px; text-align: center">
                  <template
                    v-if="evidencesFor['processAttribute'][`${process.id}-${attr.id}`]"
                  >
                    <button
                      @click="openEvidence('processAttribute', `${process.id}-${attr.id}`)"
                      class="button is-primary"
                    >Ver Evidência</button>
                    <button
                      @click="destroy('processAttribute', `${process.id}-${attr.id}`)"
                      class="button is-danger"
                    >Excluir</button>
                  </template>

                  <button
                    v-else
                    @click="openModal('processAttribute', `${process.id}-${attr.id}`)"
                    class="button is-secondary"
                  >Inserir Evidência</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </b-collapse>

    <b-modal :active.sync="isModalActive" @close="dropFiles = []">
      <form @submit.prevent="create">
        <div class="modal-card">
          <section class="modal-card-body">
            <b-field label="Evidência">
              <b-select v-model="newEvidence.evidenceId" placeholder="Selecione uma evidência" expanded required>
                <option
                  v-for="option in evidences"
                  :value="option.id"
                  :key="option.id">
                  {{ option.name }}
                </option>
              </b-select>
            </b-field>

            <b-field label="Fonte de Evidência">
              <b-select v-model="newEvidence.roleId" placeholder="Selecione uma fonte de evidência" expanded required>
                <option
                  v-for="option in roles"
                  :value="option.id"
                  :key="option.id">
                  {{ option.name }}
                </option>
              </b-select>
            </b-field>

            <b-field label="Arquivo"></b-field>

            <b-field class="file">
              <b-upload v-model="dropFiles" required>
                <a class="button is-primary">
                  <b-icon icon="upload"></b-icon>
                  <span style="">Selecionar arquivo</span>
                </a>
              </b-upload>

              <span class="file-name upload-expanded" v-if="dropFiles && dropFiles.length">
                {{ dropFiles[0].name }}
              </span>

              <span class="file-name upload-expanded" v-else>Nenhum arquivo selecionado</span>
            </b-field>
          </section>

          <footer class="modal-card-foot" style="justify-content: flex-end;">
            <button class="button" type="button" @click="closeModal()">Fechar</button>
            <button class="button is-primary" type="submit">Salvar</button>
          </footer>
        </div>
      </form>
    </b-modal>

    <evidence-modal
      :isActive="!!modalEvidence"
      :projectEvidence="modalEvidence"
      :evidence="modalEvidence.evidence"
      :role="modalEvidence.role"
      @close="modalEvidence = false"
    ></evidence-modal>
  </section>
</template>

<script>
import FormData from 'form-data'
import { toRoman } from 'roman-numerals'
import levels from '~/static/levels.json'
import processes from '~/static/process.json'

import EvidenceModal from '~/components/evidence-modal.vue'

const emptyProjectEvidence = () => ({
  projectId: 0,
  evidenceId: 0,
  roleId: 0,
  process: 0,
  filename: 0,
  type: 0,
  typeId: 0,
})

export default {
  middleware: 'is-admin',

  components: { EvidenceModal },

  async asyncData({ app, params }) {
    const { id } = params

    const data = {
      isModalActive: false,
      dropFiles: [],

      modalEvidence: false,

      processAttributes: [],
      project: {},
      organization: {},
      unit: {},
      evidences: [],
      selectedLevels: [],
      projectEvidences: [],
      newEvidence: emptyProjectEvidence(),
      selectedProcesses: [],
      selectedAttributes: [],
      expectedResultsByProcess: app.mps.expectedResultsByProcess,
      processAttributesByLevel: app.mps.processAttributesByLevel,
      processAttributeBySelectedLevel: {}
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
    progresses () {
      return this.selectedProcesses
        .reduce((acc, process) => {
          const expectedResultIds = process.id === 'Nível A'
            ? []
            : this.expectedResultsByProcess[process.id].map(({ id }) => id)
          const expectedResults = new Set(expectedResultIds)

          const processAttributeIds = this.selectedAttributes.map(
            ({ id }) => `${process.id}-${id}`
          )
          const processAttributes = new Set(processAttributeIds)

          const total = expectedResults.size + processAttributes.size

          const filled =
            this.projectEvidences
              .filter(ev => {
                if (ev.type === 'expectedResult') {
                  return expectedResults.has(ev.typeId)
                }

                if (ev.type === 'processAttribute') {
                  return processAttributes.has(ev.typeId)
                }
              })
              .length

          acc[process.id] = {
            total,
            filled
          }

          return acc
        }, {})
    },

    evidencesFor () {
      const evidencesById = this.evidences
        .reduce((acc, evidence) => {
          acc[evidence.id] = evidence
          return acc
        }, {})

      const roleById = this.roles
        .reduce((acc, role) => {
          acc[role.id] = role
          return acc
        }, {})

      const initialAcc = {
        expectedResult: {},
        processAttribute: {}
      }

      return this.projectEvidences
        .reduce((acc, projectEvidence) => {
          acc[projectEvidence.type][projectEvidence.typeId] = {
            ...projectEvidence,
            evidence: evidencesById[projectEvidence.evidenceId],
            role: roleById[projectEvidence.roleId]
          }
          return acc
        }, initialAcc)
    }
  },

  methods: {
    openModal(type, typeId) {
      this.newEvidence.type = type
      this.newEvidence.typeId = typeId
      this.isModalActive = true
    },

    closeModal() {
      this.newEvidence = emptyProjectEvidence()
      this.isModalActive = false
      this.dropFiles = []
    },

    openEvidence(type, id) {
      const evidence = this.evidencesFor[type][id]
      this.modalEvidence = evidence
    },

    async create() {
      const form = new FormData()
      form.append('process', 1)
      form.append('projectdId', this.$route.params.id)
      form.append('evidenceId', this.newEvidence.evidenceId)
      form.append('roleId', this.newEvidence.roleId)
      form.append('type', this.newEvidence.type)
      form.append('typeId', this.newEvidence.typeId)
      form.append('file', this.dropFiles[0])

      const created = await this.$axios.$post(`/projects/${this.$route.params.id}/evidences`, form)
        .catch(this.$translateError('Falha ao criar'))

      this.$success('Criado com sucesso')

      this.projectEvidences.push(created)
      this.closeModal()
    },

    async destroy(type, id) {
      this.$dialog.confirm({
        title: 'Deletando evidência do projeto',
        message: 'Esta ação não pode ser desfeita',
        cancelText: 'Cancelar',
        confirmText: 'Deletar',
        type: 'is-danger',
        onConfirm: async () => {
          const evidence = this.evidencesFor[type][id]
          const {id: projectId} = this.$route.params

          const data = await this.$axios.$delete(`/projects/${projectId}/evidences/${evidence.id}`)
            .catch(this.$translateError('Falha ao deletar'))

          this.$success('Excluído com sucesso')

          this.projectEvidences = this.projectEvidences.filter(ev => ev.id !== evidence.id)
        }
      })
    }
  }
}
</script>

<style scoped>
.upload-expanded {
  width: 100%;
  max-width: 100%;
}
</style>
