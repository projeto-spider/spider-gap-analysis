<template>
  <section class="container">
    <strong>Cadastrar Fontes de Evidência</strong>

    <form @submit.prevent="() => editing ? update() : create()">
      <div class="card">
        <div class="card-content">
          <div class="content">
            <h3>Fontes de Evidência</h3>

            <unit-picker :disabled="editing" v-model="role.unitId" :value="role.unitId"></unit-picker>

            <b-field label="Papel">
              <b-input v-model="role.name" required></b-input>
            </b-field>


            <b-field label="Descrição" expanded>
              <b-input type="textarea" v-model="role.description"></b-input>
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
import UnitPicker from '~/components/unit-picker.vue'
import levels from '~/static/levels.json'

export default {
  components: { UnitPicker },

  async asyncData({ app, params }) {
    const {id} = params

    const data = {
      role: {
        id,
        unitId: null,
        name: '',
        description: '',
      },
      levels
    }

    if (id === "new") {
      return data
    }

    data.role = await app.$axios.$get(`/roles/${id}`)

    return data
  },

  head () {
    return {
      title: 'Fonte de Evidência'
    }
  },

  computed: {
    editing() {
      return this.role.id !== 'new'
    }
  },

  methods: {
    async create() {
      const {id} = await this.$axios.$post('/roles', this.role)
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
      this.$router.push(`/role/${id}`)
    },

    async update() {
      const {id} = this.role

      const data = await this.$axios.$put(`/roles/${id}`, this.role)
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
      Object.assign(this.role, data)
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
