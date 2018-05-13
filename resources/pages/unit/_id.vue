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

              <p v-else>{{organization.name}}</p>
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

    <div class="card">
      <div class="card-content">
        <div class="content">
          <b-field>
            <div
              @click.prevent="setUnitLevelId(level.id)"
               v-for="level in Object.values(levels)"
              :key="level.id"
            >
              <b-checkbox
                v-model="selectedLevels"
                :native-value="level.id"
                type="is-success"
              >
                <span>[{{level.id}}] {{level.title}}</span>
              </b-checkbox>
            </div>
          </b-field>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-content">
        <div class="content">
          <div
            v-for="levelId in selectedLevels"
            :key="levelId"
          >
            <h5 class="title is-5">Nível {{levelId}}</h5>

            <div class="columns">
              <div v-if="levelId !== 'A'" class="column">
                <b-table
                  :data="processesByLevel[levelId]"
                  :checked-rows.sync="unit.selectedProcesses"
                  checkable
                >
                  <template scope="props">
                    <b-table-column label="Processo">
                      {{ props.row }}
                    </b-table-column>
                  </template>
                </b-table>
              </div>

              <div class="column">
                <b-table :data="levels[levelId].attributes">
                  <template scope="props">
                    <b-table-column label="Atributos de Processo">
                      {{ props.row }}
                    </b-table-column>
                  </template>
                </b-table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import levels from '~/static/levels.json'
import expectedResults from '~/static/expected-results.json'
import attributes from '~/static/process-attributes.json'

const flatten = xs =>
  xs.reduce((acc, ys) => acc.concat(ys), [])

const levelContains = (first, second) =>
  first >= second

const levelsUpTo = levelId =>
  Object.keys(levels).filter(id => id >= levelId)

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
        levelId: 'G',
        selectedProcesses: []
      },
      organization: {},
      // Although unit.level is cumulative, it helps to have
      // an array mostly for loops and to check inclusion in
      // valid level ranges
      selectedLevels: ['G'],
      selectableOrganizations: [],
      processesByLevel: app.mps.processesByLevel,
      levels
    }

    if (id === "new") {
      data.selectableOrganizations = await app.$axios.$get('/organizations')
      return data
    }

    const unit = await app.$axios.$get(`/units/${id}`)
    data.unit = unit

    const organization = await app.$axios.$get(`/organizations/${unit.organizationId}`)
    data.organization = organization

    data.selectedLevels = levelsUpTo(data.unit.levelId)

    return data
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
  },

  methods: {
    async create() {
      const {id} = await this.$axios.$post('/units', this.unit)
        .catch(this.$translateError('Falha ao criar unidade'))

      this.$success('Criado com sucesso')

      this.$router.push(`/unit/${id}`)
    },

    async update() {
      const { id } = this.unit
      const data = await this.$axios.$put(`/units/${id}`, this.unit)
        .catch(this.$translateError('Falha ao atualizar unidade'))

      this.$success('Atualizado com sucesso')
    },

    async destroy() {
      const { id } = this.unit
      const data = await this.$axios.$delete(`/units/${id}`)
        .catch(this.$translateError('Falha ao deletar unidade'))

      this.$success('Excluído com sucesso')

      this.$router.push('/unit/')
    },

    setUnitLevelId (levelId) {
      this.unit.levelId = levelId
      this.selectedLevels = levelsUpTo(this.unit.levelId)
    }
  }
}
</script>
