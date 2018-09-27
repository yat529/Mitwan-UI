<template>
  <div class="mt-time-picker-frame-wrapper bg-gradient--primary">

    <div class="mt-time-picker-frame-header py-15">
      <div class="main px-15">{{ mainTitle }}</div>
      <div class="sub px-15">{{ subTitile }}</div>
    </div>

    <div class="mt-time-picker-wrapper mt-layout-row row-center py-15">
      <transition name="slide-fade" mdoe="out-in">
      <mt-time-picker-core class="mt-time-picker-core mt-layout-abs" v-for="(core, index) in pickerCount" :key="index"
        v-if="currentCore === index && !showSelections"
        :initHour="setInitTime(index, 'hour')"
        :initMinute="setInitTime(index, 'minute')"
        :initPeriod="setInitTime(index, 'period')"
        ref="pickerCore"
        @selectTime="getTime"/>
      </transition>

      <transition name="slide-fade" mdoe="out-in">
      <div class="mt-time-picker-selections mt-layout-abs z-20" v-if="showSelections">
        <div class="mt-time-picker-selection mt-layout-row px-15" v-for="(selection, index) in range" :key="index">
          <div class="selection-label mt-layout-row row-center" :class="{ 'label-start': rangeSelection && index === 0, 'label-end': rangeSelection && index === 1 }">
            <h3 class="text-large text--white">{{ index === 0 ?  selectionsResultPageText.from : selectionsResultPageText.to }}</h3>
          </div>
          <div class="selection-time mt-layout-column row-center">
            <div class="text-large text--white">{{ mapPeriod(range[index]) }}</div>
            <div class="text-large text--white">{{ `${range[index].hour}:${ formatTime(range[index].minute) } ${range[index].period}` }}</div>
          </div>
          <div class="selection-action mt-layout-row row-center">
            <div class="mt-layout-row row-center" @click="editCore(index)">
              <mt-icon faName="fas fa-ellipsis-h" faStyleClass="fa-fw"/>
            </div>
          </div>
        </div>
      </div>
      </transition>
    </div>

    <div class="mt-time-picker-action mt-layout-row py-15">
      <div class="mt-layout-row row-center" @click="submitControl">
        <mt-icon class="mr-15" faName="far fa-check-circle" faStyleClass="fa-fw" />
        确认
      </div>
      <div class="mt-layout-row row-center" @click="resetControl">
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

    mainTitleSelections: {
      type: Array,
      require: false,
      default () {
        return ['请选择时间', '时段开始', '时段结束', '完成']
      }
    },

    subTitleSelections: {
      type: Array,
      require: false,
      default () {
        return ['请选择小时', '请选择分钟', '请确认选择']
      }
    },

    selectionsResultPageText: {
      type: Object,
      require: false,
      default () {
        return {
          from: '于',
          to: '至',
          am: '上午',
          pm: '下午',
          noon: '中午',
          midnight: '午夜'
        }
      }
    },
  },

  data () {
    return {
      time: null,
      range: null,
      isPickingHour: true,
      currentCore: 0,
      editMode: false,
    }
  },

  computed: {
    pickerCount () {
      return this.rangeSelection ? 2 : 1
    },

    showSelections () {
      return this.range && this.pickerCount === this.currentCore
    },

    mainTitle () {
      let titleSelections = this.mainTitleSelections

      if (!this.rangeSelection) {
        if (this.currentCore === this.pickerCount) {
          return titleSelections[titleSelections.length - 1]
        } else {
          return titleSelections[this.currentCore]
        }
      } else {
        return titleSelections[this.currentCore + 1]
      }
    },

    subTitile () {
      let titleSelections = this.subTitleSelections

      if ( this.currentCore === this.pickerCount ) {
        return titleSelections[titleSelections.length - 1]
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

    /* 
    ** Setup Init Value of Picker Core Props
    ** @param: index: Number (index of core component in the loop); type: String ('hour', 'minute', 'period')
    ** @output: String or Number
    */
    setInitTime (index, type) {
      let time
      if (this.editMode) {
        if (this.range && this.range.length === 2) {
          time = type === 'period' ? this.range[index][type] : parseInt(this.range[index][type])
        }
      } else {
        if (this.time) {
          time = this.time[type]
        }
      }
      return time
    },

    /* 
    ** Map Period to Selections Result Page Period text
    ** @ouput: string
    ** @param: timeObj from range Array
    ** Note: the props of timeObj from range array is STRING, soo '==' is used instead
    */
    mapPeriod (time) {
      let period
      if (time.period === 'AM') {
        if (time.hour == 12 && time.minute == 0) {
          period = this.selectionsResultPageText.midnight
        } else {
          period = this.selectionsResultPageText.am
        }
      } else if (time.period === 'PM') {
        if (time.hour == 12 && time.minute == 0) {
          period = this.selectionsResultPageText.noon
        } else {
          period = this.selectionsResultPageText.pm
        }
      }
      return period
    },

    editCore (index) {
      this.editMode = true
      this.currentCore = index
    },

    submitControl () {
      if (!this.editMode) {
        this.submit()
      } else {
        this.update()
      }
    },

    update () {
      if (!this.range) return 

      let formatedTime = {
            hour: this.time.hour.toString(),
            minute: this.formatTime(this.time.minute),
            period: this.time.period
          }
      
      this.range.splice(this.currentCore, 1, formatedTime)

      // Go back to selection result screen
      this.currentCore = this.pickerCount
      this.editMode = false
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
          this.currentCore ++
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

    resetControl () {
      if (!this.editMode) {
        if (this.currentCore != this.pickerCount) {
          this.resetCurrent()
        } else {
          this.reset()
        }
      } else {
        this.resetCurrent()
      }
    },

    // reset current picker core
    resetCurrent () {
      this.time = null
      this.$refs.pickerCore[this.currentCore].resetTime()
    },

    // reset all
    reset () {
      this.time = null
      this.range = null
      this.editMode = false
      this.currentCore = 0
      
      this.$nextTick(() => {
        this.$refs.pickerCore[0].resetTime()
        this.$emit('resetTime')
      })      
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
      width: 100%;
      height: 300px;
    }

    .mt-time-picker-selections {
      display: flex;
      flex-flow: column nowrap;
      width: 100%;

      .mt-time-picker-selection {
        flex: 1;
        width: 100%;

          .selection-label {
            position: relative;
            width: 60px;
            height: 100%;
            z-index: 1;

            &.label-start {
              
              &::before {
                content: "";
                position: absolute;
                left: 50%;
                bottom: 0px;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: white;
                transform: translate(-50%, 50%);
                z-index: 10;
              }

              &::after {
                content: "";
                position: absolute;
                left: 50%;
                bottom: 0px;
                width: 2px;
                height: 20%;
                background: white;
                opacity: 0.5;
                transform: translateX(-50%);
              }
            }

            &.label-end {

              &::after {
                content: "";
                position: absolute;
                left: 50%;
                top: 0px;
                width: 2px;
                height: 20%;
                background: white;
                opacity: 0.5;
                transform: translateX(-50%);
              }
            }
          }

          .selection-time {
            flex: 1;
            height: 100%;

            div {
              width: 110px;
              text-align: left;
            }

            div:first-child {
              margin-bottom: 10px;
              font-weight: 300;
            }
          }

          .selection-action {
            width: 40px;
            height: 100%;

            div {
              width: 30px;
              height: 30px;
              border-radius: 50%;
              transition: all 0.3s;

              &:hover {
                background: white;
                cursor: pointer;

                i {
                  color: $primary;
                  opacity: 1;
                }
              }

              i {
                color: white;
                opacity: 0.8;
                transition: all 0.3s;
              }
            }
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

