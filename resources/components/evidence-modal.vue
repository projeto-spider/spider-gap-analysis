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

      <div v-if="isVideo" class="card-image">
        <figure class="video">
          <video controls>
            <source :src="`/uploads/${projectEvidence.filename}`" :type="videoMIME">
          </video>
        </figure>
      </div>
      <div v-if="isAudio" class="card-image">
          <figure class="audio">
              <audio controls>
                  <source :src="`/uploads/${projectEvidence.filename}`" :type="audioMIME">
              </audio>
          </figure>
      </div>
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
    },
    isVideo () {
      return ['.mp4', '.ogg', '.webm'].includes(this.returnExtension())
    },
    isAudio(){
        return ['.mp3','.wav'].includes(this.returnExtension())
    },

    videoMIME () {
      if (!this.isVideo) {
        return false
      }

      const type = this.returnExtension().slice(1)
      return 'video/' + type
    },
    audioMIME(){
        if(!this.isAudio){
            return false
        }
        const type = this.returnExtension().slice(1)
        return 'audio/' + type
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
