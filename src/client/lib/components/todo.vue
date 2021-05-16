<template>
  <b-field>
    <b-checkbox
      type="is-success"
      :value="value"
      @input="triggerInput">
      <span :class="{ 'is-striked': localValue }">
        {{ data.text }}
      </span>
    </b-checkbox>
  </b-field>
</template>
<style scoped>
  .is-striked {
    text-decoration: line-through;
  }
</style>
<script>
module.exports = {
  props: [ 'value', 'data' ],
  data() {
    return {
      localValue: this.value
    }
  },
  methods: {
    triggerInput(value) {
      this.localValue = value
      this.$emit('input', value)
    }
  }
}
</script>
