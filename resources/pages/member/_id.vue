<template>
  <section class="container">
    <strong>Cadastrar Equipe</strong>

    <form @submit.prevent="() => editing ? update() : create()">
      <div class="card">
        <div class="card-content">
          <div class="content">
            <h3>Equipe</h3>

            <unit-picker v-if="!editing" :disabled="editing" v-model="member.unitId" :value="member.unitId"></unit-picker>

            <template>
              <project-picker
                v-if="!editing && member.unitId"
                :editing="editing"
                :scope="member.unitId"
                :readOnly="editing"
                v-model="member.projectId"
                :value="member.projectId"
              ></project-picker>

              <b-field
                v-else-if="!editing"
                expanded
                label="Projeto"
                disabled
                message="Escolha uma unidade"
              ></b-field>

              <p v-else-if="member.project">
                <b>Projeto</b> {{ member.project.name }}
              </p>
            </template>

            <template>
              <role-picker
                v-if="!editing || member.unitId"
                :editing="editing"
                :scope="member.unitId"
                :readOnly="editing"
                v-model="member.roleId"
                :value="member.roleId"
              ></role-picker>

              <b-field
                v-else-if="!editing"
                expanded
                label="Fonte de Evidência"
                disabled
                message="Escolha uma unidade"
              ></b-field>

              <p v-else-if="member.project">
                <b>Fonte de evidência</b> {{ member.role.name }}
              </p>
            </template>

            <b-field grouped>
              <b-field label="Nome do Colaborador" expanded>
                <b-input v-model="member.name" required></b-input>
              </b-field>

              <b-field label="CPF do Colaborador" expanded>
                <b-input v-model="member.cpf"d v-cleave="{blocks: [3, 3, 3, 2], delimiters: ['.', '.', '-']}"></b-input>
              </b-field>
            </b-field>

            <b-field grouped>
              <b-field label="Email" expanded>
                <b-input v-model="member.email"d></b-input>
              </b-field>

              <b-field label="Telefone" expanded>
                <b-input v-model="member.telephone" v-cleave="{phone: true, phoneRegionCode: 'BR'}"></b-input>
              </b-field>
            </b-field>

            <b-field label="Superior Hierárquico" expanded>
              <b-input v-model="member.superior"d></b-input>
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
import ProjectPicker from '~/components/project-picker.vue'
import RolePicker from '~/components/role-picker.vue'
require('cleave.js/dist/addons/cleave-phone.br.js')

export default {
  middleware: 'is-admin',

  components: { UnitPicker, ProjectPicker, RolePicker },

  async asyncData({ app, params }) {
    const {id} = params

    const data = {
      member: {
        id,
        unitId: null,
        projectId: null,
        roleId: null,
        name: '',
        cpf: '',
        email: '',
        telephone: '',
        superior: '',
        project: {},
        role: {}
      }
    }

    if (id === "new") {
      return data
    }

    data.member = await app.$axios.$get(`/members/${id}`)

    return data
  },

  head () {
    return {
      title: 'Cadastrar Equipe'
    }
  },

  computed: {
    editing() {
      return this.member.id !== 'new'
    }
  },

  methods: {
    async create() {
      const {id} = await this.$axios.$post('/members', this.member)
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
      this.$router.push(`/member/${id}`)
    },

    async update() {
      const {id} = this.member

      const data = await this.$axios.$put(`/members/${id}`, this.member)
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

      Object.assign(this.member, data)
    },

    async destroy() {
      const {id} = this.member

      const data = await this.$axios.$delete(`/members/${id}`)
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

      this.$router.push('/member/')
    }
  }
}
</script>
