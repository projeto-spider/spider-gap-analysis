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
                  :data="processesForLevel(levelId)"
                  :checked-rows.sync="selectedProcesses"
                  checkable
                >
                  <template scope="props">
                    <b-table-column label="Processo">
                      {{ props.row.id }}
                    </b-table-column>
                  </template>
                </b-table>
              </div>

              <div class="column">
                <b-table
                  :data="processAttributesForLevel(levelId)"
                  :checked-rows.sync="selectedProcesseAttributes"
                  checkable
                >
                  <template scope="props">
                    <b-table-column label="Atributo do Processo">
                      {{ props.row.id }}
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
import processes from '~/static/process.json'
import expectedResults from '~/static/expected-results.json'
import attributes from '~/static/process-attributes.json'

const flatten = xs =>
  xs.reduce((acc, ys) => acc.concat(ys), [])

const processesList = Object.values(processes)
const processAttributesList = flatten(
  Object.values(levels)
    .map(level =>
      level.attributes
        .map(attr => ({
          levelId: level.id,
          id: attr
        }))
    )
)

const levelContains = (first, second) =>
  first >= second

const levelsUpTo = levelId =>
  Object.keys(levels).filter(id => id >= levelId)

const selectedFeaturesToSelectedProjects = (selectedFeatures) =>
  processesList
    .filter(({ id, level, levels }) =>
      levels
        // GPR
        ? levels.some(level => selectedFeatures[level].processes.includes(id))
        : selectedFeatures[level].processes.includes(id)
    )

const selectedFeaturesToSelectedAttrs = (selectedFeatures) =>
  processAttributesList
    .filter(({ id, levelId }) =>
      selectedFeatures[levelId].attributes.includes(id)
    )

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
        levelId: 'G',
        selectedFeatures: {
          G: { processes: [], attributes: [] },
          F: { processes: [], attributes: [] },
          E: { processes: [], attributes: [] },
          D: { processes: [], attributes: [] },
          C: { processes: [], attributes: [] },
          B: { processes: [], attributes: [] },
          A: { processes: [], attributes: [] }
        }
      },
      // Although unit.level is cumulative, it helps to have
      // an array mostly for loops and to check inclusion in
      // valid level ranges
      selectedLevels: ['G'],
      selectableOrganizations: [],
      selectedProcesses: [],
      selectedProcesseAttributes: [],
      organizationName: false,
      levels
    }

    if (id === "new") {
      data.selectableOrganizations = await app.$axios.$get('/organizations')
      return data
    }

    const unit = await app.$axios.$get(`/units/${id}`)
    data.unit = unit

    const organization = await app.$axios.$get(`/organizations/${unit.organizationId}`)
    data.organizationName = organization.name

    data.selectedLevels = levelsUpTo(data.unit.levelId)

    return data
  },

  created () {
    // Has to be done on created so the client rendering rehydratation
    // gets references to the local lists
    this.selectedProcesses = selectedFeaturesToSelectedProjects(this.unit.selectedFeatures)
    this.selectedProcesseAttributes = selectedFeaturesToSelectedAttrs(this.unit.selectedFeatures)
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
      this.updateSelectedFeatures()

      const {id} = await this.$axios.$post('/units', this.unit)
        .catch(this.$translateError('Falha ao criar unidade'))

      this.$success('Criado com sucesso')

      this.$router.push(`/unit/${id}`)
    },

    async update() {
      this.updateSelectedFeatures()

      const { id } = this.unit
      const data = await this.$axios.$put(`/units/${id}`, this.unit)
        .catch(this.$translateError('Falha ao atualizar unidade'))

      this.$success('Atualizado com sucesso')
    },

    async destroy() {
      const { id } = this.unit
      const data = await this.$axios.$delete(`/units/${id}`)
        .catch(this.$translateError('Falha ao atualizar unidade'))

      this.$success('Excluído com sucesso')

      this.$router.push('/unit/')
    },

    updateSelectedFeatures () {
      const groupProcessesByLevel = this.selectedProcesses
        .reduce((acc, process) => {
          const level = process.levels
            // GPR
            ? process.levels.filter(level => this.selectedLevels.includes(level)).pop()
            : process.level

          if (!acc[level]) acc[level] = []
          acc[level].push(process.id)
          return acc
        }, {})

      const groupAttrsByLevel = this.selectedProcesseAttributes
        .reduce((acc, attr) => {
          if (!acc[attr.levelId]) acc[attr.levelId] = []
          acc[attr.levelId].push(attr.id)
          return acc
        }, {})

      this.unit.selectedFeatures = Object.values(levels)
        .reduce((acc, level) => {
          const hasThisLevel = this.selectedLevels.includes(level.id)

          acc[level.id] = {
            processes: hasThisLevel && groupProcessesByLevel[level.id] || [],
            attributes: hasThisLevel && groupAttrsByLevel[level.id] || [],
          }
          return acc
        }, {})
    },

    setUnitLevelId (levelId) {
      this.unit.levelId = levelId
      this.selectedLevels = levelsUpTo(this.unit.levelId)
    },

    processesForLevel (levelId) {
      const gprLevel = processes.GPR.levels
        .filter(level => this.selectedLevels.includes(level))
        .pop()

      return processesList.filter(({ level, levels}) =>
        levels
          // GPR
          ? levels.includes(levelId) && levelId === gprLevel
          : levelId === level
      )
    },

    processAttributesForLevel (levelId) {
      return processAttributesList
        .filter(attr => attr.levelId === levelId)
    }
  }
}
</script>
