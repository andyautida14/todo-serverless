<template>
  <div class="is-fab">
    <b-button
      type="is-success"
      icon-pack="fas"
      icon-left="plus"
      size="is-large"
      rounded
      :class="customClass"
      @click="$emit('click', $event)">
    </b-button>
  </div>
</template>
<style scoped>
.is-fab {
  width: 100%;
  position: fixed;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
}
</style>
<script>
module.exports = {
  props: [ 'customClass' ]
}
</script>
