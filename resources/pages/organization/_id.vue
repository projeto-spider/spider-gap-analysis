<template>
  <section class="container">
    <strong>Cadastrar Informações Gerais da Empresa</strong>

    <div class="card">
      <div class="card-content">
        <div class="content">
          <h3>Organização</h3>

          <b-field grouped>
            <b-field label="Razão Social" expanded>
              <b-input v-model="name"></b-input>
            </b-field>

            <b-field label="Data Fundação" expanded>
              <b-datepicker
                v-if="fundationDate instanceof Date"
                v-model="fundationDate"
              ></b-datepicker>
            </b-field>
          </b-field>

          <b-field grouped>
            <b-field label="Número Total de Colaboradores" expanded>
              <b-input v-model="colaborators" type="number"></b-input>
            </b-field>

            <b-field label="Número de Colaboradores envolvidos com Software" expanded>
              <b-input v-model="softwareColaborators" type="number"></b-input>
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
          <h3>Endereço</h3>

          <b-field expanded>
            <b-input placeholder="CEP" v-model="cep" expanded></b-input>

            <p class="control">
              <button @click="findAddress" class="button is-info">Buscar</button>
            </p>
          </b-field>

          <b-field label="Endereço" expanded>
            <b-input required v-model="address"></b-input>
          </b-field>

          <b-field grouped>
            <b-field label="Complemento" expanded>
              <b-input v-model="complement"></b-input>
            </b-field>

            <b-field label="Estado" expanded>
              <b-input required v-model="state"></b-input>
            </b-field>
          </b-field>

          <b-field grouped>
            <b-field label="Bairro" expanded>
              <b-input required v-model="neighborhood"></b-input>
            </b-field>

            <b-field label="Município" expanded>
              <b-input required v-model="city"></b-input>
            </b-field>
          </b-field>
        </div>
      </div>
    </div>

    <div>
      <template>
        <div v-if="editing">
          <button @click="update" class="button is-info">
            Atualizar
          </button>

          <button @click="destroy" class="button is-danger">
            Excluir
          </button>
        </div>

        <button v-else @click="create" class="button is-primary">
          Criar
        </button>
      </template>
    </div>
  </section>
</template>

<script>
import Cleave from '~/components/cleave.vue'
import cep from 'cep-promise'
import debounce from 'p-debounce'

const cepDebouced = debounce(cep, 300)

const attrs = [
  'name',
  'fundationDate',
  'colaborators',
  'softwareColaborators',
  'description',
  'cep',
  'address',
  'state',
  'city',
  'complement',
  'neighborhood'
]

export default {
  components: { Cleave },

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

    const data = await app.$axios.$get(`/organizations/${id}`)
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
  },

  async created() {
    const {id} = this.$route.params

    if (!this.editing) {
      return
    }

    const data = await this.$axios.$get(`/organizations/${id}`)

    const org = Object.assign({}, data, {
      fundationDate: new Date(data.fundationDate),
    })
    Object.assign(this, org)
  },

  head () {
    return {
      title: 'Organização'
    }
  },

  computed: {
    editing() {
      return this.id !== 'new'
    },
  },

  methods: {
    findAddress() {
      cepDebouced(this.cep.replace('-', ''))
        .then(data => {
          this.state = data.state
          this.city = data.city
          this.address = data.street
          this.neighborhood = data.neighborhood
        })
        .catch(() => {})
    },

    async create() {
      const {id} = await this.$axios.$post('/organizations', this.attrs())
        .catch(err => {
          this.$snackbar.open({
            message: 'Falha ao criar organização',
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
      this.$router.push(`/organization/${id}`)
    },

    async update() {
      const id = this.id
      const data = await this.$axios.$put(`/organizations/${id}`, this.attrs())
        .catch(err => {
          this.$snackbar.open({
            message: 'Falha ao atualizar organização',
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
      const data = await this.$axios.$delete(`/organizations/${id}`)
        .catch(err => {
          this.$snackbar.open({
            message: 'Falha ao atualizar organização',
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

      this.$router.push('/organization/')
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

<style>
</style>
