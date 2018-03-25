<template>
  <section class="container">
    <strong>Cadastrar Informações Gerais da Empresa</strong>

    <form @submit.prevent="() => editing ? update() : create()">
      <div class="card">
        <div class="card-content">
          <div class="content">
            <h3>Organização</h3>

            <b-field grouped>
              <b-field label="Razão Social" expanded>
                <b-input v-model="organization.name" required></b-input>
              </b-field>

              <b-field label="Data Fundação" expanded>
                <b-datepicker
                  v-if="isClient && organization.fundationDate instanceof Date"
                  v-model="organization.fundationDate"
                ></b-datepicker>
                <b-input disabled v-else></b-input>
              </b-field>
            </b-field>

            <b-field grouped>
              <b-field label="Número Total de Colaboradores" expanded>
                <b-input v-model="organization.colaborators" type="number"></b-input>
              </b-field>

              <b-field label="Número de Colaboradores envolvidos com Software" expanded>
                <b-input v-model="organization.softwareColaborators" type="number"></b-input>
              </b-field>
            </b-field>

            <b-field label="Descrição das atividades da Organização" expanded>
              <b-input type="textarea" v-model="organization.description"></b-input>
            </b-field>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-content">
          <div class="content">
            <h3>Endereço</h3>

            <b-field expanded>
              <b-input @input="findAddress" placeholder="CEP" v-model="organization.cep" v-cleave="{blocks: [5, 3], delimiters: ['-']}" expanded></b-input>

              <p class="control">
                <button @click="findAddress" class="button is-info">Buscar</button>
              </p>
            </b-field>

            <b-field label="Endereço" expanded>
              <b-input required v-model="organization.address"></b-input>
            </b-field>

            <b-field grouped>
              <b-field label="Complemento" expanded>
                <b-input v-model="organization.complement"></b-input>
              </b-field>

              <b-field label="Estado" expanded>
                <b-input required v-model="organization.state"></b-input>
              </b-field>
            </b-field>

            <b-field grouped>
              <b-field label="Bairro" expanded>
                <b-input required v-model="organization.neighborhood"></b-input>
              </b-field>

              <b-field label="Município" expanded>
                <b-input required v-model="organization.city"></b-input>
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
import cep from 'cep-promise'
import debounce from 'p-debounce'

const cepDebouced = debounce(cep, 300)

export default {
  middleware: 'is-admin',

  async asyncData ({ app, params, req }) {
    const { id } = params

    const data = {
      organization: {
        id,
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
      },
      isClient: false
    }

    if (id === "new") {
      return data
    }

    const org = await app.$axios.$get(`/organizations/${id}`)

    Object.assign(org, {
      fundationDate: new Date(org.fundationDate),
    })

    Object.assign(data.organization, org)

    return data
  },

  mounted() {
    this.isClient = !process.server

    if (this.isClient) {
      this.fundationDate = new Date(this.fundationDate)
    }
  },

  head () {
    return {
      title: 'Organização'
    }
  },

  computed: {
    editing() {
      return this.organization.id !== 'new'
    },
  },

  methods: {
    findAddress() {
      cepDebouced(this.organization.cep.replace('-', ''))
        .then(data => {
          this.organization.state = data.state
          this.organization.city = data.city
          this.organization.address = data.street
          this.organization.neighborhood = data.neighborhood
        })
        .catch(() => {})
    },

    async create() {
      const {id} = await this.$axios.$post('/organizations', this.organization)
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
      const { id } = this.organization
      const data = await this.$axios.$put(`/organizations/${id}`, this.organization)
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
  }
}
</script>

<style>
</style>
