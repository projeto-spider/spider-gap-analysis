<template>
  <section class="container">
    <strong>Cadastrar Informações Gerais da Empresa</strong>

    <form @submit.prevent="() => editing ? update() : create()">
      <div class="card">
        <div class="card-content">
          <div class="content">
            <h3>Unidade Organizacional</h3>

            <b-field label="Organização" expanded>
              <b-select v-if="!editing" v-model="organization_id" placeholder="Organização" expanded required>
                <option
                  v-for="org in selectableOrganizations"
                  :value="org.id"
                  :key="org.id"
                >
                  {{ org.name }}
                </option>
              </b-select>

              <b-field v-else disabled expanded>{{organizationName}}</b-field>
            </b-field>

            <b-field grouped>
              <b-field label="Gerente" expanded>
                <b-input v-model="manager" required></b-input>
              </b-field>

              <b-field label="Coordenador" expanded>
                <b-input v-model="coordinator" required></b-input>
              </b-field>
            </b-field>

            <b-field grouped>
              <b-field label="Número Total de Colaboradores" expanded>
                <b-input v-model="colaborators" type="number"></b-input>
              </b-field>
            </b-field>

            <b-field label="Descrição das atividades da Organização" expanded>
              <b-input type="textarea" v-model="description"></b-input>
            </b-field>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-content">
          <div class="content">
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
const attrs = [
  'organization_id',
  'description',
  'activity',
  'manager',
  'coordinator',
  'colaborators',
]

export default {
  /*
  async asyncData ({ app, params, req }) {
    const {id} = params

    const creating = id === 'new'

    if (creating) {
      return {
        id: null,
        name: '',
        fundationDate: new Date(),
        colaborators: 0,
        softwareColaborators: 0,
        description: '',
        cep: '',
        address: '',
        state: '',
        city: '',
        complement: '',
        neighborhood: '',
      }
    }

    const data = await app.$axios.$get(`/units/${id}`)
    console.log({data})
    const org = Object.assign({}, data, {
      fundationDate: new Date(data.fundationDate),
    })
    console.log({org})
    return org
  },*/
  data () {
    return {
      id: this.$route.params.id,
      organization_id: null,
      description: '',
      manager: '',
      coordinator: '',
      colaborators: 0,
      selectableOrganizations: [],
      organizationName: false
    }
  },

  async created() {
    const {id} = this.$route.params

    if (!this.editing) {
      this.selectableOrganizations = await this.$axios.$get('/organizations')
      return
    }

    const unit = await this.$axios.$get(`/units/${id}`)
    const organization = await this.$axios.$get(`/organizations/${unit.organization_id}`)
    Object.assign(this, unit)
    this.organizationName = organization.name
  },

  head () {
    return {
      title: 'Unidade Organizacional'
    }
  },

  computed: {
    editing() {
      return this.id !== 'new'
    },
  },

  methods: {
    async create() {
      const {id} = await this.$axios.$post('/units', this.attrs())
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
      const id = this.id
      const data = await this.$axios.$put(`/units/${id}`, this.attrs())
        .catch(err => {
          this.$snackbar.open({
            message: 'Falha ao atualizar unidade',
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
      data.fundationDate = new Date(data.fundationDate)
      Object.assign(this, data)
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

    attrs() {
      return attrs.reduce((acc, attr) => {
        acc[attr] = this[attr]
        return acc
      }, {})
    }
  }
}
</script>
