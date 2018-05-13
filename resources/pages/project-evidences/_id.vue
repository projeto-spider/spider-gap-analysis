<template>
  <section class="container">
    <h2 class="title">{{project.name}}</h2>
    <h3 class="subtitle">{{organization.name}} - {{unit.name}}</h3>

    <p><h4 class="title is-4">Associar Projetos às Evidências</h4></p>

    <div
      v-for="process in selectedProcesses"
      :key="process.id"
    >
      <h5 class="title is-5">{{ process.id }}</h5>

      <table class="table is-fullwidth">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="result in expectedResultsByProcess[process.id]" :key="result.id">
            <td>{{result.id}}</td>
            <td>
              <template
                v-if="projectEvidences.some(ev => ev.type === 'expectedResult' && ev.typeId == result.id)"
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

          <tr
            v-for="attr in selectedAttributes"
            :key="attr"
          >
            <td>{{ attr }}</td>
            <td>
              <template
                v-if="projectEvidences.some(ev => ev.type === 'processAttribute' && ev.typeId == `${process.id}-${attr}`)"
              >
                <button
                  @click="openEvidence('processAttribute', `${process.id}-${attr}`)"
                  class="button is-primary"
                >Ver Evidência</button>
                <button
                  @click="destroy('processAttribute', `${process.id}-${attr}`)"
                  class="button is-danger"
                >Excluir</button>
              </template>

              <button
                v-else
                @click="openModal('processAttribute', `${process.id}-${attr}`)"
                class="button is-secondary"
              >Inserir Evidência</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <b-modal :active.sync="isModalActive">
      <form @submit.prevent="create">
        <div class="modal-card">
          <section class="modal-card-body">
            <b-field label="Evidência">
              <b-select v-model="newEvidence.evidenceId" placeholder="Selecione uma evidência">
                <option
                  v-for="option in evidences"
                  :value="option.id"
                  :key="option.id">
                  {{ option.name }}
                </option>
              </b-select>
            </b-field>

            <b-field label="Fonte de Evidência">
              <b-select v-model="newEvidence.roleId" placeholder="Selecione uma fonte de evidência">
                <option
                  v-for="option in roles"
                  :value="option.id"
                  :key="option.id">
                  {{ option.name }}
                </option>
              </b-select>
            </b-field>

            <b-upload required v-model="dropFiles" drag-drop>
              <section class="section">
                <div class="content has-text-centered">
                  <p>
                    <b-icon
                      icon="upload"
                      size="is-large">
                    </b-icon>
                  </p>

                  <p>Arraste o arquivo ou clique aqui para upload</p>
                </div>
              </section>
            </b-upload>
          </section>

          <footer class="modal-card-foot">
            <button class="button" type="button" @click="closeModal()">Fechar</button>
            <button class="button is-primary" type="submit">Salvar</button>
          </footer>
        </div>
      </form>
    </b-modal>
  </section>
</template>

<script>
import FormData from 'form-data'
import { toRoman } from 'roman-numerals'
import levels from '~/static/levels.json'
import processes from '~/static/process.json'

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

  async asyncData({ app, params }) {
    const { id } = params

    const data = {
      isModalActive: false,
      processAttributes: [],
      project: {},
      organization: {},
      unit: {},
      evidences: [],
      selectedLevels: [],
      projectEvidences: [],
      newEvidence: emptyProjectEvidence(),
      dropFiles: [],
      selectedProcesses: [],
      selectedAttributes: [],
      expectedResultsByProcess: app.mps.expectedResultsByProcess,
      processAttributeBySelectedLevel: {}
    }

    data.project = await app.$axios.$get(`/projects/${id}`)
    data.unit = await app.$axios.$get(`/units/${data.project.unitId}`)
    data.organization = await app.$axios.$get(`/organizations/${data.unit.organizationId}`)
    data.evidences = await app.$axios.$get('/evidences')
    data.roles = await app.$axios.$get('/roles')
    data.projectEvidences = await app.$axios.$get(`/projects/${id}/evidences`)

    data.selectedProcesses = app.mps.mapProcessesIdsToProcesses(data.unit.selectedProcesses)
    data.selectedAttributes = levels[data.unit.levelId].attributes

    return data
  },

  head () {
    return {
      title: 'Evidência e Projeto'
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
    },

    openEvidence(type, id) {
      const evidence = this.projectEvidences.find(ev => ev.type == type && ev.typeId == id)
      window.open(`/uploads/${evidence.filename}`, '_blank')
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
      const evidence = this.projectEvidences.find(ev => ev.type == type && ev.typeId == id)
      const {id: projectId} = this.$route.params

      const data = await this.$axios.$delete(`/projects/${projectId}/evidences/${evidence.id}`)
        .catch(this.$translateError('Falha ao deletar'))

      this.$success('Excluído com sucesso')

      this.projectEvidences = this.projectEvidences.filter(ev => ev.id !== evidence.id)
    }
  }
}
</script>
