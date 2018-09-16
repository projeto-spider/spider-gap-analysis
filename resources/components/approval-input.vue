<template>
  <div>
    <div class="field has-addons">
      <p class="control">
        <button
          class="button"
          :class="{ 'is-danger': projectEvidence.approval === 0 }"
          @click="() => onChangeApprovalStatus(projectEvidence, 0)"
        >
          <b-icon icon="close"></b-icon>
          <span>Vermelho</span>
        </button>
      </p>

      <p class="control">
        <button
          class="button"
          :class="{ 'is-warning': projectEvidence.approval === 1 }"
          @click="() => onChangeApprovalStatus(projectEvidence, 1)"
        >
          <span>Amarelo</span>
        </button>
      </p>

      <p class="control">
        <button
          class="button"
          :class="{ 'is-success': projectEvidence.approval === 2 }"
          @click="() => onChangeApprovalStatus(projectEvidence, 2)"
        >
          <b-icon icon="check"></b-icon>
          <span>Verde</span>
        </button>
      </p>
    </div>

    <b-field v-if="projectEvidence.approval < 2">
      <b-input
        v-model="projectEvidence.feedback"
        maxlength="200"
        type="textarea"
        @input="value => onChangeFeedback(projectEvidence, value)"
      ></b-input>
    </b-field>
  </div>
</template>

<script>
export default {
  name: 'ApprovalInput',

  props: {
    projectEvidence: Object,
    onChangeApprovalStatus: Function,
    onChangeFeedback: Function
  }
}
</script>

