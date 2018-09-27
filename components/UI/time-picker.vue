<template>
  <div class="mt-time-picker">

    <mt-input class="mt-time-picker-input"
      label="选择时间"
      hint="点击并选择时间"
      :useCustomIcon="true"
      :persistentCustomIcon="true"
      :customInputSlote="true"
      @customIconClicked="showWatch = !showWatch"
      ref="timeInput">

      <div class="mt-time-picker-custom-input mt-layout-row row-center pr-15" slot="custom-input" v-if="range">
        <label class="chip text-small text--white bg--primary">
          {{ `${range[0].hour}:${range[0].minute} ${range[0].period}` }}
          <input class="hidden" type="text" :value="`${range[0].hour}:${range[0].minute} ${range[0].period}`" disabled/>
        </label>
        <div class="px-15" v-if="range[1]">
          <mt-icon class="text--primary" faName="fas fa-arrows-alt-h" faStyleClass="fa-fw" />
        </div>
        <label class="chip text-small text--white bg--primary" v-if="range[1]">
          {{ `${range[1].hour}:${range[1].minute} ${range[1].period}` }}
          <input class="hidden" type="text" :value="`${range[1].hour}:${range[1].minute} ${range[1].period}`" disabled/>
        </label>
      </div>

      <mt-icon class="text--primary" faName="far fa-clock" faStyleClass="fa-fw"/>
    </mt-input>

    <mt-time-picker-frame class="mt-time-picker-frame" v-show="showWatch" 
      :rangeSelection="rangeSelection"
      @submitTime="getTime"
      @resetTime="resetTime"/>
  </div>
</template>

<script>
export default {
  props: {
    // Toggle between single selection and ranged selection
    rangeSelection: {
      type: Boolean,
      require: false,
      default: false
    },
  },

  data () {
    return {
      showWatch: false,
      range: null,
    }
  },

  watch: {
    showWatch (newVal) {
      let input = this.$refs.timeInput

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
    getTime (range) {
      this.range = range
      this.showWatch = false
    },

    resetTime () {
      this.range = null
    }
  }
}
</script>

<style lang="scss">
.mt-time-picker {
  position: relative;

  &-input {
    position: relative;
  }

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

  &-frame {
    position: absolute;
    z-index: 10;
  }
}
</style>


