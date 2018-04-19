<template>
  <section class="container">
    <h2 class="title">{{organization.name}}</h2>
    <h3 class="subtitle">{{unit.name}}</h3>

    <strong>Associar Projetos às Evidências</strong>

    <div class="columns">
      <div class="column">
        <table class="table is-fullwidth">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="attr in processAttributes">
              <td>{{attr.id}}</td>
              <td>
                <template v-if="projectEvidences.some(ev => ev.type === 'processAttribute' && ev.typeId == attr.id)">
                  <button @click="openEvidence('processAttribute', attr.id)"  class="button is-primary">Ver Evidência</button>
                  <button @click="destroy('processAttribute', attr.id)"  class="button is-danger">Excluir</button>
                </template>
                <button v-else @click="openModal('processAttribute', attr.id)" class="button is-secondary">Inserir Evidência</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="column">
        <table class="table is-fullwidth">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="result in expectedResults.filter(({id}) => unit.expectedResults.includes(id))">
              <td>{{result.id}}</td>
              <td>
                <template v-if="projectEvidences.some(ev => ev.type === 'expectedResult' && ev.typeId == result.id)">
                  <button @click="openEvidence('expectedResult', result.id)"  class="button is-primary">Ver Evidência</button>
                  <button @click="destroy('expectedResult', result.id)"  class="button is-danger">Excluir</button>
                </template>
                <button v-else @click="openModal('expectedResult', result.id)" class="button is-secondary">Inserir Evidência</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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

    <form v-if="false" @submit.prevent="() => editing ? update() : create()">
      <div class="card">
        <div class="card-content">
          <div class="content">
            <h3>Projeto</h3>

            <unit-picker :disabled="editing" v-model="project.unitId" :value="project.unitId"></unit-picker>

            <b-field grouped>
              <b-field label="Nome" expanded>
                <b-input v-model="project.name" required></b-input>
              </b-field>

              <b-field label="Sigla" expanded>
                <b-input v-model="project.abbr"></b-input>
              </b-field>
            </b-field>

            <b-field label="Nível" expanded>
              <b-select v-model="project.levelId" placeholder="Nível do Projeto" expanded required>
                <option
                  v-for="level in levels"
                  :value="level.id"
                  :key="level.id"
                >
                  {{ "[" + level.level + "] " + level.title }}
                </option>
              </b-select>

            </b-field>

            <b-field grouped>
              <b-field label="Gerente" expanded>
                <b-input v-model="project.manager" required></b-input>
              </b-field>

              <b-field label="Ciclo de Vida" expanded>
                <b-input v-model="project.lifeCycle"></b-input>
              </b-field>
            </b-field>

            <b-field grouped>
              <b-field label="Número Total de Colaboradores" expanded>
                <b-input v-model="project.collaborators" type="number"></b-input>
              </b-field>

              <b-field label="Data de Inicio" expanded>
                <b-datepicker
                  v-if="isClient && project.startDate instanceof Date"
                  v-model="project.startDate"
                ></b-datepicker>
                <b-input disabled v-else></b-input>
              </b-field>
            </b-field>

            <b-field grouped>
              <b-field label="Esforço em Horas" expanded>
                <b-input v-model="project.duration" type="number"></b-input>
              </b-field>

              <b-field label="Data de Término" expanded>
                <b-datepicker
                  v-if="isClient && project.endDate instanceof Date"
                  v-model="project.endDate"
                ></b-datepicker>
                <b-input disabled v-else></b-input>
              </b-field>
            </b-field>

            <b-field grouped>
              <b-field label="Fase Atual" expanded>
                <b-select v-model="project.currentStep" placeholder="Fase Atual" expanded>
                  <option
                    v-for="item in ['Contratação', 'Planejamento', 'Análise/projeto', 'Construção', 'Teste', 'Parado', 'Concluído']"
                    :value="item"
                    :key="item"
                  >
                    {{ item }}
                  </option>
                </b-select>
              </b-field>

              <b-field label="Tipo de Cliente" expanded>
                <b-select v-model="project.clientType" placeholder="Tipo de Cliente" expanded>
                  <option
                    v-for="item in ['Interno', 'Externo']"
                    :value="item"
                    :key="item"
                  >
                    {{ item }}
                  </option>
                </b-select>
              </b-field>
            </b-field>

            <b-field grouped>
              <b-field label="Tipo de Projeto" expanded>
                <b-select v-model="project.type" placeholder="Tipo de Projeto" expanded>
                  <option
                    v-for="item in ['Evolução Produto', 'Manutenção', 'Desenvolvimento']"
                    :value="item"
                    :key="item"
                  >
                    {{ item }}
                  </option>
                </b-select>
              </b-field>

              <b-field label="Importância" expanded>
                <b-select v-model="project.importance" placeholder="Importância" expanded>
                  <option
                    v-for="item in ['Baixa', 'Média', 'Alta']"
                    :value="item"
                    :key="item"
                  >
                    {{ item }}
                  </option>
                </b-select>
              </b-field>
            </b-field>

            <b-field grouped>
              <b-field label="Descrição do Projeto" expanded>
                <b-input type="textarea" v-model="project.description"></b-input>
              </b-field>

              <b-field label="Justificativa para Seleção" expanded>
                <b-input type="textarea" v-model="project.justification"></b-input>
              </b-field>
            </b-field>
          </div>
        </div>
      </div>

      <div>
        <template>
          <div v-if="editing">
            <button type="submit" class="button is-info">
              Atualizar
            </button>

            <button type="button" @click="destroy" class="button is-danger">
              Excluir
            </button>
          </div>

          <button v-else type="submit" class="button is-primary">
            Criar
          </button>
        </template>
      </div>
    </form>
  </section>
</template>

<script>
import FormData from 'form-data'
import { toRoman } from 'roman-numerals'
import levels from '~/static/levels.json'
import expectedResults from '~/static/expected-results.json'
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

const flatten = xs =>
  xs.reduce((acc, ys) => acc.concat(ys), [])

export default {
  middleware: 'is-admin',

  async asyncData({ app, params }) {
    const {id} = params

    const data = {
      isModalActive: false,
      expectedResults: Object.values(expectedResults),
      processAttributes: [],
      project: {},
      organization: {},
      unit: {},
      evidences: [],
      selectedLevels: [],
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
    data.selectedLevels = await app.$axios.$get(`/units/${data.project.unitId}/levels`).then(r =>
      r.map(level => level.level_id).sort()
    )

    data.processAttributes = flatten(
      levels[data.project.levelId].attributes
        .map(attrId => processAttributes[attrId])
        .map(attr =>
          attr.sub.map((sub, i) => ({
            id: `${attr.id} (${toRoman(i + 1)})`
          }))
        )
    )

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
      this.newEvidence = Object.assign({}, emptyProjectEvidence)
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
