<template>
  <b-modal :active="isActive" @close="onClose">
    <div class="card" v-if="projectEvidence">
      <div v-if="isImage" class="card-image">
        <figure class="image">
          <img :src="`/uploads/${projectEvidence.filename}`" alt="Image">
        </figure>
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

export default {
  name: 'EvidenceModal',

  props: {
    isActive: Boolean,
    projectEvidence: [Boolean, Object],
    evidence: [Boolean, Object],
    role: [Boolean, Object]
  },

  computed: {
    isImage () {
      if (!this.projectEvidence) {
        return false
      }

      const filename = this.projectEvidence.filename
      const extension = path.extname(filename)

      return ['.png', '.jpeg', '.jpg', '.gif'].includes(extension)
    }
  },

  methods: {
    onClose () {
      this.$emit('close')
    }
  }
}
</script>
