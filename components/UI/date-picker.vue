<template>
  <div class="mt-date-selector">
    <mt-input class="mt-date-selector-input"
      label="选择日期"
      hint="点击并选择日期"
      :useCustomIcon="true"
      :persistentCustomIcon="true"
      :customInputSlote="true"
      @customIconClicked="showCalender = !showCalender"
      ref="dateInput">

      <div class="mt-date-selector-custom-input mt-layout-row row-center pr-15" slot="custom-input" v-if="range">
        <label class="chip text-small text--white bg--primary">
          {{ `${range[0].year}-${range[0].month}-${range[0].day}` }}
          <input class="hidden" type="text" :value="`${range[0].year}-${range[0].month}-${range[0].day}`" disabled/>
        </label>
        <div class="px-15" v-if="range[1]">
          <mt-icon class="text--primary" faName="fas fa-arrows-alt-h" faStyleClass="fa-fw" />
        </div>
        <label class="chip text-small text--white bg--primary" v-if="range[1]">
          {{ `${range[1].year}-${range[1].month}-${range[1].day}` }}
          <input class="hidden" type="text" :value="`${range[1].year}-${range[1].month}-${range[1].day}`" disabled/>
        </label>
      </div>

      <mt-icon class="text--primary" faName="far fa-calendar-alt" faStyleClass="fa-fw"/>
    </mt-input>

    <div class="mt-date-selector-popup bg-gradient--primary z-overlay" v-show="showCalender">
      <mt-date-picker-frame 
        :rangeSelection="rangeSelection"
        @rangeReseted="range = null"
        @dateSelected="getDate"/>
    </div>
  </div>
</template>

<script>
export default {
  props: {

    // Toggle Calender between single selection and ranged selection
    rangeSelection: {
      type: Boolean,
      require: false,
      default: false
    },
  },

  data () {
    return {
      showCalender: false,
      range: null,
    }
  },

  watch: {
    showCalender (newVal) {
      let input = this.$refs.dateInput

      if(newVal) {
        input.focus()
      } else {
        if (!this.range) {
          input.blur()
        }
      }
    }
  },

  methods: {
    getDate (rangeObj) {
      this.range = rangeObj
      this.showCalender = false
    }
  }
}
</script>

<style lang="scss">
.mt-date-selector {
  position: relative;

  &-custom-input {
    width: 100%;
    height: 100%;

    > label.chip {
      position: relative;
      text-align: center;
      border-radius: 5px;
      padding: 3px 8px;

      input.hidden {
        position: absolute;
        visibility: hidden;
        opacity: 0;
      }
    }
  }

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


