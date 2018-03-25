<template>
  <section class="container">
    <strong>Cadastro de Evidência</strong>

    <form @submit.prevent="() => editing ? update() : create()">
      <div class="card">
        <div class="card-content">
          <div class="content">
            <h3>Evidência</h3>

            <unit-picker v-if="!editing" :disabled="editing" v-model="evidence.unitId" :value="evidence.unitId"></unit-picker>

            <b-field label="Nome da Evidência" expanded required>
              <b-input v-model="evidence.name" required></b-input>
            </b-field>

            <b-field label="Tipo da evidência" expanded>
              <b-select v-model="evidence.type" placeholder="Tipo de Evidência" expanded>
                <option
                  v-for="item in ['Diretas', 'Indiretas', 'Afirmações']"
                  :value="item"
                  :key="item"
                >
                  {{ item }}
                </option>
              </b-select>
            </b-field>

            <b-field label="Descrição" expanded>
              <b-input type="textarea" v-model="evidence.description"d></b-input>
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
      evidence: {
        id,
        unitId: null,
        name: '',
        type: '',
        description: ''
      }
    }

    if (id === "new") {
      return data
    }

    data.evidence = await app.$axios.$get(`/evidences/${id}`)

    return data
  },

  head () {
    return {
      title: 'Cadastrar Evidência'
    }
  },

  computed: {
    editing() {
      return this.evidence.id !== 'new'
    }
  },

  methods: {
    async create() {
      const {id} = await this.$axios.$post('/evidences', this.evidence)
        .catch(err => {
          this.$snackbar.open({
            message: 'Falha ao processar dados',
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
      this.$router.push(`/evidence/${id}`)
    },

    async update() {
      const {id} = this.evidence

      const data = await this.$axios.$put(`/evidences/${id}`, this.evidence)
        .catch(err => {
          this.$snackbar.open({
            message: 'Falha ao atualizar',
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

      Object.assign(this.evidence, data)
    },

    async destroy() {
      const {id} = this.evidence

      const data = await this.$axios.$delete(`/evidences/${id}`)

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

      this.$router.push('/evidence/')
    }
  }
}
</script>
