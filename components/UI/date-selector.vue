<template>
  <div class="mt-date-selector">
    <mt-input class="mt-date-selector-input"
      label="选择日期"
      hint="点击并选择日期"
      type="text"
      :useCustomIcon="true"
      :persistentCustomIcon="true"
      @customIconClicked="showCalender = !showCalender"
      ref="dateInput">

      <mt-icon class="text--primary" faName="far fa-calendar-alt" faStyleClass="fa-fw"/>
    </mt-input>

    <div class="mt-date-selector-popup bg-gradient--primary z-overlay" v-show="showCalender">
      <mt-calender />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showCalender: false
    }
  },

  mounted () {
    let input = this.$refs.dateInput,
        $input = input.$el.querySelector('input')

    $input.addEventListener('focus', () => {
      console.log('im focused')
      this.showCalender = true
    })
  }
}
</script>

<style lang="scss">
.mt-date-selector {
  position: relative;

  &-input {}

  &-popup {
    position: absolute;
    top: 82px;
    left: 0;
    width: 100%;
    height: auto;
    border-radius: 15px;
  }
}
</style>


