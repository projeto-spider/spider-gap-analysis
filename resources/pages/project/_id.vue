<template>
  <section class="container">
    <strong>Informações Gerais dos Projetos Selecionados</strong>

    <form @submit.prevent="() => editing ? update() : create()">
      <div class="card">
        <div class="card-content">
          <div class="content">
            <h3>Projeto</h3>

            <b-field label="Unidade Organizacional" expanded>
              <b-select v-if="!editing" v-model="project.unitId" placeholder="Unidade Organizacional" expanded required>
                <optgroup v-for="org in selectableOrganizations" :label="org.label">
                  <option
                    v-for="unit in org.units"
                    :value="unit.id"
                    :key="unit.id"
                  >
                    {{ unit.name }}
                  </option>
                </optgroup>
              </b-select>

              <b-field v-else disabled expanded>{{unit.name}}</b-field>
            </b-field>

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
                  v-if="project.startDate instanceof Date"
                  v-model="project.startDate"
                ></b-datepicker>
              </b-field>
            </b-field>

            <b-field grouped>
              <b-field label="Esforço em Horas" expanded>
                <b-input v-model="project.duration" type="number"></b-input>
              </b-field>

              <b-field label="Data de Término" expanded>
                <b-datepicker
                  v-if="project.endDate instanceof Date"
                  v-model="project.endDate"
                ></b-datepicker>
              </b-field>
            </b-field>

            <b-field grouped>
              <b-field label="Fase Atual" expanded>
                <b-input v-model="project.currentStep"></b-input>
              </b-field>

              <b-field label="Tipo de Cliente" expanded>
                <b-input v-model="project.clientType"></b-input>
              </b-field>
            </b-field>

            <b-field grouped>
              <b-field label="Tipo de Projeto" expanded>
                <b-input v-model="project.type"></b-input>
              </b-field>

              <b-field label="Importância" expanded>
                <b-input v-model="project.importance"></b-input>
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

            <button @click="destroy" class="button is-danger">
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
import levels from '~/static/levels.json'

const attrs = [
  'name',
  'manager',
  'collaborators',
  'duration',
  'currentStep',
  'projectType',
  'description',
  'abbr',
  'lifeCycle',
  'startDate',
  'endDate',
  'clientType',
  'importance',
  'justification',
  'levelId'
]

export default {
  data () {
    return {
      project: {
        id: this.$route.params.id,
        unitId: null,
        name: '',
        manager: '',
        collaborators: 0,
        duration: 0,
        currentStep: '',
        tyoe: '',
        description: '',
        abbr: '',
        lifeCycle: '',
        startDate: new Date(),
        endDate: new Date(),
        clientType: '',
        importance: '',
        justification: '',
        levelId: null,
      },
      selectableUnits: [],
      selectableOrganizations: [],
      unit: {},
      levels
    }
  },

  async created() {
    const {id} = this.project

    if (!this.editing) {
      const orgs = await this.$axios.$get('/organizations')
      const units = await this.$axios.$get('/units')
      this.selectableOrganizations = orgs
        .map(org => ({
          label: org.name,
          units: units.filter(unit => unit.organization_id === org.id)
        }))
        .filter(org => org.units.length)
      return
    }

    const data = await this.$axios.$get(`/projects/${id}`)
    const unit = await this.$axios.$get(`/units/${data.unitId}`)

    data.startDate = new Date(data.startDate)
    data.endDate = new Date(data.endDate)

    Object.assign(this.project, data)
    this.unit = unit
  },

  head () {
    return {
      title: 'Projeto'
    }
  },

  computed: {
    editing() {
      return this.project.id !== 'new'
    }
  },

  methods: {
    async create() {
      const {id} = await this.$axios.$post('/projects', this.project)
        .catch(err => {
          this.$snackbar.open({
            message: 'Falha ao criar projeto',
            type: 'is-danger',
            position: 'is-bottom-left',
          })
          throw err
        })

      this.$snackbar.open({
        message: 'Criado com sucesso',
        type: 'is-success',
        position: 'is-bottom-left',
      })
      this.$router.push(`/project/${id}`)
    },

    async update() {
      const {id} = this.project

      const data = await this.$axios.$put(`/projects/${id}`, this.project)
        .catch(err => {
          this.$snackbar.open({
            message: 'Falha ao atualizar projeto',
            type: 'is-danger',
            position: 'is-bottom-left',
          })
          throw err
        })


      this.$snackbar.open({
        message: 'Atualizado com sucesso',
        type: 'is-success',
        position: 'is-bottom-left',
      })

      data.startDate = new Date(data.startDate)
      data.endDate = new Date(data.endDate)
      Object.assign(this.project, data)
    },

    async destroy() {
      const {id} = this.project

      const data = await this.$axios.$delete(`/projects/${id}`)
        .catch(err => {
          this.$snackbar.open({
            message: 'Falha ao deletar project',
            type: 'is-danger',
            position: 'is-bottom-left',
          })
          throw err
        })

      this.$snackbar.open({
        message: 'Excluído com sucesso',
        type: 'is-success',
        position: 'is-bottom-left',
      })

      this.$router.push('/project/')
    }
  }
}
</script>
