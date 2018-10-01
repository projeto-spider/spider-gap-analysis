<template>
  <b-modal :active="isActive" @close="onClose">
    <div class="card" v-if="projectEvidence">
      <div v-if="isImage" class="card-image">
        <figure class="image">
          <img :src="`/uploads/${projectEvidence.filename}`" alt="Image">
        </figure>
      </div>

      <div class="card-image">
        <pdf v-if="isPdf" :src="`/uploads/${projectEvidence.filename}`"></pdf>
      </div>

      <div class="card-content">
        <div class="media">
          <div class="media-content">
            <p class="title is-4">
              <a :href="`/uploads/${projectEvidence.filename}`" target="_blank">
                {{ projectEvidence.filename }}
              </a>
            </p>

            <p class="title is-5">
              {{ evidence.name }}
            </p>

            <p class="subtitle is-6">
              <strong>Fonte de Evidência: </strong>{{ role.name }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import path from 'path'
import pdf from 'vue-pdf'

export default {
  name: 'EvidenceModal',

  components: {
    pdf
  },

  props: {
    isActive: Boolean,
    projectEvidence: [Boolean, Object],
    evidence: [Boolean, Object],
    role: [Boolean, Object]
  },

  computed: {
    isImage () {
      return ['.png', '.jpeg', '.jpg', '.gif'].includes(this.returnExtension())
    },
    isPdf () {
      return ['.pdf'].includes(this.returnExtension())
    }
  },

  methods: {
    onClose () {
      this.$emit('close')
    },
    returnExtension () {
      if (!this.projectEvidence) {
        return false
      }

      const filename = this.projectEvidence.filename
      return path.extname(filename).toLowerCase()
    }
  }
}
</script>
