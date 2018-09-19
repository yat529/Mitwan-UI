<template>
  <div class="mt-calender">

    <div class="mt-calender-carousel mt-layout-row px-15">
      <div class="left mt-layout-row row-center py-15" @click="prevMonth">
        <mt-icon class="text--white" faName="fas fa-caret-left" faStyleClass="fa-fw" />
      </div>
      <div class="display mt-layout-row row-center py-15 text--white" @click="showSelection = !showSelection">
        {{ `${year}年 ${month}月` }}
      </div>
      <div class="right mt-layout-row row-center py-15" @click="nextMonth">
        <mt-icon class="text--white" faName="fas fa-caret-right" faStyleClass="fa-fw" />
      </div>
    </div>

    <div class="mt-calender-body">
      <div class="mt-layout-row px-15">
        <div class="label text--white" v-for="(item, index) in labels" :key="index">{{ item }}</div>
      </div>

      <mt-date-picker class="p-15"
        :year="year"
        :month="month"
        :range="range"
        @selectMonth="getDate"
        @previousMonth="prevMonth"
        @nextMonth="getNextMonthDate"/>

      <div class="mt-layout-row year-date-selection" v-show="showSelection">
        <div class="year-list">
          <div v-for="(year, index) in yearOptions" :key="index"
            @click="updateYear(year)">
            <div>{{ year }}</div>
          </div>
        </div>
        <div class="month-list mt-layout-row-wrap row-center">
          <div class="px-15" v-for="(month, index) in monthOptions" :key="index"
            @click="updateMonth(month)">
            <div>
              {{ month }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <transition name="slide">
    <div class="mt-calender-action mt-layout-row pt-15" v-show="selectionComplete">
      <div class="mt-layout-row row-center">
        <mt-icon class="mr-15" faName="far fa-check-circle" faStyleClass="fa-fw" />
        确认
      </div>
      <div class="mt-layout-row row-center" @click="resetRange">
        <mt-icon class="mr-15" faName="far fa-times-circle" faStyleClass="fa-fw" />
        清除
      </div>
    </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    futureDateOnly: {
      type: Boolean,
      require: false,
      default: true
    },

    yearRange: {
      type: [Array, Number],
      require: false,
      default: 10
    },

    rangeSelection: {
      type: Boolean,
      require: false,
      default: true
    },

    labels: {
      type: Array,
      default () {
        return ['日', '一', '二', '三', '四', '五', '六']
      }
    }
  },

  data () {
    return {
      currentYear: null,
      currentMonth: null,
      year: null,
      month: null,
      day: null,
      showSelection: false,
      range: null,
    }
  },

  computed: {
    yearOptions () {
      let years = [],
          yearRange = this.yearRange
      
      if (!this.futureDateOnly) {
        for (let i = yearRange; i > 0; i --) {
          years.push(this.currentYear - i)
        }
      }

      for (let i = 0; i < yearRange; i ++) {
        years.push(this.currentYear + i)
      }

      return years
    },

    monthOptions () {
      return ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    },

    /* 
    ** Check if range is specified
    ** @output Boolean
    ** Note: used to determine 'selection-complete' class
    */
    selectionComplete () {
      if (this.range && this.range.length === 2) {
        if ( Object.keys(this.range[0]).length && Object.keys(this.range[1]).length ) {
          return true
        }
      }
    }
  },

  methods: {
    getDate (dateObj) {
      this.year = dateObj.year
      this.month = dateObj.month
      this.day = dateObj.day

      // set selection range
      this.setRange(dateObj)
    },

    getNextMonthDate (dateObj) {
      // set selection range
      this.setRange(dateObj)
    },

    setRange (dateObj) {
      if (this.rangeSelection) {
        // range start is specified
        if (this.range && this.range.length) {
          this.range.splice(1, 1, dateObj)
        } else {
          this.range = this.$set([], this.range, [])
          this.range.push(dateObj)
        }
      }
    },

    resetRange () {
      if (this.rangeSelection) {
        this.range = null
      }
    },

    updateYear (year) {
      this.year = year
      this.showSelection = false
    },

    updateMonth (month) {
      this.month = this.monthOptions.indexOf(month) + 1
      this.showSelection = false
    },

    prevMonth () {
      if ( this.month <= 1 ) {
        if ( this.year <= this.yearOptions[0] ) {
          return
        } else {
          this.year --
        }
        this.month = 12
      } else {
        this.month --
      }
    },

    nextMonth () {
      if ( this.month >= 12 ) {
        if ( this.year >= this.yearOptions[this.yearOptions.length - 1] ) {
          return
        } else {
          this.year ++
        }
        this.month = 1
      } else {
        this.month ++
      }
    },

    submit() {
      this.$emit('dateSelected', {
        year: this.year,
        month: this.month,
        day: this.day
      })
    }
  },

  created () {
    this.year = this.currentYear = new Date().getFullYear()
    this.month = this.currentMonth = new Date().getMonth() + 1
  }
}
</script>


<style lang="scss">
@import '~assets/style/color';
$easing: cubic-bezier(0.25, 0.46, 0.45, 0.94); 

.mt-calender {
  overflow: hidden;

  &-carousel {
    .left, .right {
      flex: 1;
      max-width: 55px;
      user-select: none;

      &:hover {
        cursor: pointer;
      }
    }

    .display {
      flex: 1;
      font-weight: 500;
      user-select: none;
    }
  }
  
  &-body {
    position: relative;
    // background: white;
    z-index: 2;

    .label {
      width: percentage(1/7);
      height: 45px;
      line-height: 45px;
      text-align: center;
      font-size: 0.9rem;
      font-weight: 500;
      user-select: none;
    }


    .year-date-selection {
      position: absolute;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
      background: white;
      border-radius: 0 0 15px 15px;
      z-index: 10;

      .year-list {
        flex: 1;
        padding: 10px;
        min-width: 50px;
        height: 100%;
        overflow-y: auto;

        > div {
          height: 35px;
          line-height: 35px;
          text-align: center;
          border-bottom: 1px solid $greyBg;

          &:first-child {
            border-top: 1px solid $greyBg;
          }

          &:hover {
            cursor: pointer;

            > div {
              background: $primary;
              color: white;
            }
          }
        }
      }

      .month-list {
        flex: 2;
        height: 100%;
        border-left: 1px solid $greyBg;
        overflow-y: auto;

        > div {
          width: percentage(1/2);
          height: 35px;
          line-height: 35px;
          text-align: center;

          &:hover {
            cursor: pointer;

            > div {
              background: $primary;
              color: white;
            }
          }
        }
      }
    }
  }

  &-action {
    z-index: 1;

    > div {
      flex: 1;
      height: 35px;
      line-height: 35px;
      text-align: center;
      transition: all 0.2s $easing;

      i {
        transition: color 0.2s $easing;
      }

      &:hover {
        cursor: pointer;
        color: white;

        i {
          color: white;
        }
      }
    }

    > div:first-child {
      &:hover {
        background: $success;
      }
    }

    > div:last-child {
      &:hover {
        background: $error;
      }
    }
  }
}

// .slide-enter-active,
// .slide-leave-active {
//   transition: all 0.2s $easing;
//   transition-delay: 0.4s;
// }

// .slide-enter,
// .slide-leave-to {
//   transform: translateY(-100%);
// }

</style>

