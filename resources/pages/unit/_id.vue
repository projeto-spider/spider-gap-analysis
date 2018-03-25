<template>
  <section class="container">
    <strong>Cadastrar Informações Gerais da Empresa</strong>

    <form @submit.prevent="() => editing ? update() : create()">
      <div class="card">
        <div class="card-content">
          <div class="content">
            <h3>Unidade Organizacional</h3>

            <b-field label="Organização" expanded>
              <b-select v-if="!editing" v-model="unit.organizationId" placeholder="Organização" expanded required>
                <option
                  v-for="org in selectableOrganizations"
                  :value="org.id"
                  :key="org.id"
                >
                  {{ org.name }}
                </option>
              </b-select>

              <p v-else>{{organizationName}}</p>
            </b-field>

            <b-field label="Nome" expanded>
              <b-input v-model="unit.name" required></b-input>
            </b-field>

            <b-field grouped>
              <b-field label="Gerente" expanded>
                <b-input v-model="unit.manager" required></b-input>
              </b-field>

              <b-field label="Coordenador" expanded>
                <b-input v-model="unit.coordinator" required></b-input>
              </b-field>
            </b-field>

            <b-field grouped>
              <b-field label="Número Total de Colaboradores" expanded>
                <b-input v-model="unit.colaborators" type="number"></b-input>
              </b-field>
            </b-field>

            <b-field label="Descrição das atividades da Organização" expanded>
              <b-input type="textarea" v-model="unit.description"></b-input>
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

    <div v-if="editing" class="card">
      <div class="card-content">
        <div class="content">
          <b-field>
            <b-checkbox v-model="selectedLevels"
              v-for="level in levels"
              :key="level.id"
              :native-value="level.id"
              type="is-success"
              >
              <span>[{{level.level}}] {{level.title}}</span>
            </b-checkbox>
          </b-field>
        </div>
      </div>
    </div>

    <div v-if="editing" class="card">
      <div class="card-content">
        <div class="content">
          <b-table
            :data="filteredScope"
            :checked-rows.sync="selectedResults"
            checkable
          >
            <template v-if="props.rows.level)" scope="props">
              <b-table-column label="Nível">
                {{ props.row.level }}
              </b-table-column>

              <b-table-column label="Processo">
                {{ props.row.process }}
              </b-table-column>

              <b-table-column label="Atributo do Processo">
                {{ props.row.attribute }}
              </b-table-column>

              <b-table-column label="Resultados Esperados">
                {{ props.row.result }}
              </b-table-column>
            </template>
          </b-table>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import levels from '~/static/levels.json'
import processes from '~/static/process.json'
import expectedResults from '~/static/expected-results.json'
import attributes from '~/static/process-attributes.json'

const flatten = xs =>
  xs.reduce((acc, ys) => acc.concat(ys), [])

export default {
  middleware: 'is-admin',

  async asyncData ({ app, params, req }) {
    const {id} = params

    const data = {
      unit: {
        id,
        organizationId: null,
        name: '',
        description: '',
        manager: '',
        coordinator: '',
        colaborators: 0,
        expectedResults: [],
      },
      selectableOrganizations: [],
      organizationName: false,
      originallySelectedLevels: [],
      selectedLevels: [],
      selectedResults: [],
      levels: levels
        .sort((a, b) =>
          a.level.charCodeAt(0) - b.level.charCodeAt(0)
        ),
      scope: flatten(
        levels
          .map(level =>
            flatten(
              processes
              .filter(p => p.levelId === level.id)
              .map(process =>
                expectedResults
                  .filter(result => result.processId === process.id)
                  .map(result => ({
                    id: result.id,
                    levelId: level.id,
                    level: level.level,
                    process: process.abbr,
                    result: result.abbr,
                    attribute:
                      // TODO: refactor this relationship
                      // This is obviously a quick fix
                      level.id === 1 // G
                        ? 'AP 1.1, AP 2.1'
                        : attributes
                            .filter(attr => attr.processId === process.id)
                            .map(attr => attr.abbr)
                            .join(', ')
                  })
                )
              )
            )
          )
      )
    }

    if (id === "new") {
      data.selectableOrganizations = await app.$axios.$get('/organizations')
      return data
    }

    const unit = await app.$axios.$get(`/units/${id}`)
    const organization = await app.$axios.$get(`/organizations/${unit.organizationId}`)
    const selectedLevels = await app.$axios.$get(`/units/${id}/levels`).then(r =>
      r.map(level => level.level_id)
    )

    Object.assign(data.unit, unit)
    data.organizationName = organization.name
    data.originallySelectedLevels = selectedLevels
    data.selectedLevels = selectedLevels

    return data
  },

  created() {
    this.selectedResults = this.scope
      .filter(({id}) => this.unit.expectedResults.includes(id))
  },

  head () {
    return {
      title: 'Unidade Organizacional'
    }
  },

  computed: {
    editing() {
      return this.unit.id !== 'new'
    },

    filteredScope() {
      return this.scope.filter(({levelId}) => this.selectedLevels.includes(levelId))
    },
  },

  methods: {
    async create() {
      const {id} = await this.$axios.$post('/units', this.unit)
        .catch(err => {
          this.$snackbar.open({
            message: 'Falha ao criar unidade',
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
      this.$router.push(`/unit/${id}`)
    },

    async update() {
      const { id } = this.unit
      const updatedData = Object.assign({}, this.unit)
      updatedData.expectedResults = this.selectedResults
        .filter(({levelId}) => this.selectedLevels.includes(levelId))
        .map(er => er.id)
      const data = await this.$axios.$put(`/units/${id}`, updatedData)
        .catch(err => {
          this.$snackbar.open({
            message: 'Falha ao atualizar unidade',
            type: 'is-danger',
            position: 'is-bottom-left',
          })
          throw err
        })
      const newLevels = this.selectedLevels
        .filter(level => !this.originallySelectedLevels.includes(level))
        .map(level =>
          this.$axios.$post(`/units/${id}/levels`, {
            unit_id: id,
            level_id: level
          })
          .catch(() => {
            const levelName = levels.find(l => l.id === level).title
            this.$snackbar.open({
              message: 'Falha ao adicionar nível ' + levelName,
              type: 'is-danger',
              position: 'is-bottom-left',
            })
          })
        )
      const levelsToRemove = this.originallySelectedLevels
        .filter(level => !this.selectedLevels.includes(level))
        .map(level =>
          this.$axios.$delete(`/units/${id}/levels/${level}`)
          .catch(() => {
            const levelName = levels.find(l => l.id === level).title
            this.$snackbar.open({
              message: 'Falha ao remover nível ' + levelName,
              type: 'is-danger',
              position: 'is-bottom-left',
            })
          })
        )

      await Promise.all(newLevels.concat(levelsToRemove))

      this.$snackbar.open({
        message: 'Atualizado com sucesso',
        type: 'is-success',
        position: 'is-bottom-left',
      })
      data.fundationDate = new Date(data.fundationDate)
      Object.assign(this.unit, data)
      this.selectedResults = this.scope
        .filter(({id}) => this.expectedResults.includes(id))
    },

    async destroy() {
      const id = this.id
      const data = await this.$axios.$delete(`/units/${id}`)
        .catch(err => {
          this.$snackbar.open({
            message: 'Falha ao atualizar unidade',
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

      this.$router.push('/unit/')
    },

    watch: {
      expectedResults() {
        this.selectedResults = this.scope
          .filter(({id}) => this.expectedResults.includes(id))
      },
    }
  }
}
</script>
