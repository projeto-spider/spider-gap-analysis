<template>
  <b-modal :active.sync="isActive" @close="closeModal">
    <form @submit.prevent="submit">
      <div class="modal-card">
        <section class="modal-card-body">
          <b-field label="Evidência">
            <b-select v-model="projectEvidence.evidenceId" placeholder="Selecione uma evidência" expanded required>
              <option
                v-for="option in evidences"
                :value="option.id"
                :key="option.id">
                {{ option.name }}
              </option>
            </b-select>
          </b-field>

          <b-field label="Fonte de Evidência">
            <b-select v-model="projectEvidence.roleId" placeholder="Selecione uma fonte de evidência" expanded required>
              <option
                v-for="option in roles"
                :value="option.id"
                :key="option.id">
                {{ option.name }}
              </option>
            </b-select>
          </b-field>

          <b-field label="Arquivo"></b-field>

          <b-field class="file">
            <b-upload v-model="projectEvidence.files" required>
              <a class="button is-primary">
                <b-icon icon="upload"></b-icon>
                <span style="">Selecionar arquivo</span>
              </a>
            </b-upload>

            <span class="file-name upload-expanded" v-if="projectEvidence.files && projectEvidence.files.length">
              {{ projectEvidence.files[0].name }}
            </span>

            <span class="file-name upload-expanded" v-else>Nenhum arquivo selecionado</span>
          </b-field>
        </section>

        <footer class="modal-card-foot" style="justify-content: flex-end;">
          <button class="button" type="button" @click="closeModal">Fechar</button>
          <button class="button is-primary" type="submit">Salvar</button>
        </footer>
      </div>
    </form>
  </b-modal>
</template>

<script>
const emptyProjectEvidence = () => ({
  roleId: 0,
  evidenceId: 0,
  files: []
})

export default {
  name: 'EvidenceFormModal',

  props: {
    isActive: Boolean,
    onClose: Function,
    onSubmit: Function,

    roles: Array,
    evidences: Array,
  },

  data: () => ({
    projectEvidence: emptyProjectEvidence(),
  }),

  methods: {
    closeModal () {
      this.projectEvidence = emptyProjectEvidence()
      this.onClose()
    },

    submit () {
      const { roleId, evidenceId, files } = this.projectEvidence
      const [ file ] = files

      this.onSubmit({ roleId, evidenceId, file })
      this.closeModal()
    }
  }
}
</script>

<style scoped>
.upload-expanded {
  width: 100%;
  max-width: 100%;
}
</style>
