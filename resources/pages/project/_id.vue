<template>
  <section class="container">
    <strong>Informações Gerais dos Projetos Selecionados</strong>

    <form @submit.prevent="() => editing ? update() : create()">
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
import UnitPicker from '~/components/unit-picker.vue'

export default {
  middleware: 'is-admin',

  components: { UnitPicker },

  async asyncData({ app, params }) {
    const {id} = params

    const data = {
      isClient: false,
      project: {
        id,
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
      }
    }

    if (id === "new") {
      return data
    }

    data.project = await app.$axios.$get(`/projects/${id}`)
    data.project.startDate = new Date(data.project.startDate)
    data.project.endDate = new Date(data.project.endDate)

    return data
  },

  mounted() {
    this.isClient = !process.server

    if (this.isClient) {
      this.project.startDate = new Date(this.project.startDate)
      this.project.endDate = new Date(this.project.endDate)
    }
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
        .catch(this.$translateError('Falha ao criar projeto'))

      this.$success('Criado com sucesso')

      this.$router.push(`/project/${id}`)
    },

    async update() {
      const {id} = this.project

      const data = await this.$axios.$put(`/projects/${id}`, this.project)
        .catch(this.$translateError('Falha ao atualizar projeto'))


      this.$success('Atualizado com sucesso')

      data.startDate = new Date(data.startDate)
      data.endDate = new Date(data.endDate)
      Object.assign(this.project, data)
    },

    async destroy() {
      const {id} = this.project

      const data = await this.$axios.$delete(`/projects/${id}`)
        .catch(this.$translateError('Falha ao deletar project'))

      this.$success('Excluído com sucesso')

      this.$router.push('/project/')
    }
  }
}
</script>
