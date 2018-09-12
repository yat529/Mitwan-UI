<template>
  <ul class="mt-list">
    <mt-list-item :item="item" v-for="(item, index) in list" :key="index" />
  </ul>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      require: true
    }
  }
}
</script>

<style lang="scss">
.mt-list {
  padding: 0px;
  margin: 0px;
}
</style>


