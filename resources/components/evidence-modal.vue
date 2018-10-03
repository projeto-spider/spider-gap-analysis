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

      <div v-if="isVideo && (mime && mime.includes('video') )" class="card-image">
        <figure class="video">
          <video controls>
            <source :src="`/uploads/${projectEvidence.filename}`" :type="mime">
          </video>
        </figure>
      </div>
      <div v-if="isAudio && (mime && mime.includes('audio'))" style="text-align:center" class="card-image">
          <figure class="audio">
              <audio controls>
                  <source :src="`/uploads/${projectEvidence.filename}`" :type="mime">
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

  data: () => ({
    mime: null
  }),

  props: {
    isActive: Boolean,
    projectEvidence: [Boolean, Object],
    evidence: [Boolean, Object],
    role: [Boolean, Object],
  },

  computed: {
    isImage () {
      return ['.png', '.jpeg', '.jpg', '.gif'].includes(this.extension)
    },
    isPdf () {
      return ['.pdf'].includes(this.extension)
    },
    isVideo () {
      return ['.mp4', '.ogg', '.webm'].includes(this.extension)
    },
    isAudio(){
        return ['.mp3','.wav','.ogg'].includes(this.extension)
    },
    extension () {
      if (!this.projectEvidence) {
        return false
      }

      const filename = this.projectEvidence.filename
      return path.extname(filename).toLowerCase()
    } 
  },
  watch:{
    extension(){
        if(
         !window.fetch ||
         !this.projectEvidence ||
         !(this.isVideo || this.isAudio)){
            this.mime = null
            return
        }
        fetch('/uploads/'+this.projectEvidence.filename)
        .then((response) =>{
        this.mime = response.headers.get('Content-type')
        })
    }
},
  methods: {
    onClose () {
      this.$emit('close')
    }   
  }
}
</script>
