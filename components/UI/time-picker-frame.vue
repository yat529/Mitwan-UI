<template>
  <div class="mt-time-picker-frame-wrapper bg-gradient--primary">

    <div class="mt-time-picker-frame-header py-15">
      <div class="main px-15">{{ mainTitle }}</div>
      <div class="sub px-15">{{ subTitile }}</div>
    </div>

    <div class="mt-time-picker-wrapper py-15">
      <transition name="slide-fade" mdoe="out-in">
      <mt-time-picker-core class="mt-time-picker-core" v-for="(core, index) in pickerCount" :key="index"
        v-if="currentCore === index"
        :initHour="time && time.hour"
        :initMinute="time && time.minute"
        :initPeriod="time && time.period"
        ref="pickerCore"
        @selectTime="getTime"/>

      <div class="mt-time-picker-selections" v-if="showSelections">
        <div class="mt-time-picker-selection mt-layout-row" v-for="(selection, index) in range" :key="index">
          <div class="selection-clock mt-layout-row row-center">

          </div>
          <div class="selection-time mt-layout-row row-center">
            <div class="text-large text--white">{{ `${range[index].hour}:${ formatTime(range[index].minute) } ${range[index].period}` }}</div>
          </div>
        </div>
      </div>
      </transition>
    </div>

    <div class="mt-time-picker-action mt-layout-row py-15">
      <div class="mt-layout-row row-center" @click="submit">
        <mt-icon class="mr-15" faName="far fa-check-circle" faStyleClass="fa-fw" />
        确认
      </div>
      <div class="mt-layout-row row-center" @click="reset">
        <mt-icon class="mr-15" faName="far fa-times-circle" faStyleClass="fa-fw" />
        清除
      </div>
    </div>
    
  </div>
</template>

<script>
export default {
  props: {
    // Toggle between single selection and ranged selection
    rangeSelection: {
      type: Boolean,
      require: false
    },
  },

  data () {
    return {
      time: null,
      range: null,
      isPickingHour: true,
      currentCore: 0,
    }
  },

  computed: {
    pickerCount () {
      return this.rangeSelection ? 2 : 1
    },

    showSelections () {
      return this.rangeSelection && this.range && this.range.length === 2 && this.currentCore === 2
    },

    mainTitle () {
      let titleSelections = ['请选择时间', '时段开始', '时段结束', '完成']

      if (!this.rangeSelection) {
        return titleSelections[0]
      } else {
        if (!this.range) {
          return titleSelections[1]
        }
        else if (this.range.length === 1) {
          return titleSelections[2]
        }
        else {
          return titleSelections[3]
        }
      }
    },

    subTitile () {
      let titleSelections = ['请选择小时', '请选择分钟', '请确认选择']

      if ( !this.rangeSelection && this.range || this.rangeSelection && (this.range && this.range.length === 2) ) {
        return titleSelections[2]
      } 
      else {
        return this.isPickingHour ? titleSelections[0] : titleSelections[1]
      }
    }
  },

  methods: {
    getTime (timeObj) {
      let time = {
        hour: timeObj.hour,
        minute: timeObj.minute,
        period: timeObj.period
      }

      this.isPickingHour = timeObj.isPickingHour
      this.time = time
    },

    formatTime (time) {
      if (typeof time !== 'string') {
        if (time < 10) {
          time = '0' + time.toString()
        } else {
          time = time.toString()
        }
      }
      return time
    },

    submit () {
      let formatedTime = {
            hour: this.time.hour.toString(),
            minute: this.formatTime(this.time.minute),
            period: this.time.period
          }
      
      if (!this.rangeSelection) {
        if (!this.range) {
          this.range = []
          this.range.push(formatedTime)
        } 
        // selection completed
        else {
          this.$emit('submitTime', this.range)
        }
      } 
      
      else {
        if (!this.range) {
          this.range = []
          this.range.push(formatedTime)
          this.currentCore ++
        } else if (this.range.length < 2) {
          this.range.push(formatedTime)
          this.currentCore ++
        } 
        // selection completed
        else {
          this.$emit('submitTime', this.range)
        }
      }
    },

    reset () {
      if (this.currentCore != 2) {
        let core = this.$refs.pickerCore[0]
        core.resetTime()
      }

      this.time = null
      this.range = null
      this.currentCore = 0
      this.$emit('resetTime')
    },
  }
}
</script>


<style lang="scss">
@import '~assets/style/_color';

.mt-time-picker {
  &-frame-wrapper {
    width: 100%;
    border-radius: 15px;
    overflow: hidden;
  }

  &-frame-header {
    width: 100%;

    > .main {
      height: 25px;
      line-height: 25px;
      font-size: 1rem;
      font-weight: bold;
      color: white;
    }
    
    > .sub {
      height: 35px;
      line-height: 35px;
      font-size: 1.3rem;
      color: white;
    }
  }

  &-wrapper {
    position: relative;
    width: 100%;
    height: 330px;

    > div {
      position: absolute;
      top: 15px;
      height: 300px;
    }

    .mt-time-picker-selections {
      display: flex;
      flex-flow: column nowrap;
      width: 100%;

      .mt-time-picker-selection {
        flex: 1;
        width: 100%;

          .selection-clock {
            width: 120px;
            height: 100%;
          }

          .selection-time {
            flex: 1;
            height: 100%;
          }
      }
      
    }
  }

  &-action {

    > div {
      flex: 1;
      height: 35px;
      line-height: 35px;
      text-align: center;
      color: white;

      i {
        color: white;
      }

      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>

