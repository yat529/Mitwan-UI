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

      <mt-date-picker-core class="p-15" 
        :year="year"
        :month="month"
        :range="range"
        :rangeSelection="rangeSelection"
        @selectDate="setRange"
        @previousMonth="prevMonth" 
        @nextMonth="nextMonth"/>

      <div class="mt-layout-row year-date-selection bg-gradient--primary" v-show="showSelection">
        <div class="year-list">
          <div v-for="(year, index) in yearOptions" :key="index"
            @click="updateYear(year)">
            <div class="text--white">{{ year }}</div>
          </div>
        </div>
        <div class="month-list mt-layout-row-wrap row-center">
          <div class="px-15" v-for="(month, index) in monthOptions" :key="index"
            @click="updateMonth(month)">
            <div class="text--white text-hover--primary bg-hover--white">
              {{ month }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-calender-action mt-layout-row pb-15" v-show="selectionComplete">
      <div class="mt-layout-row row-center" @click="submitRange">
        <mt-icon class="mr-15" faName="far fa-check-circle" faStyleClass="fa-fw" />
        确认
      </div>
      <div class="mt-layout-row row-center" @click="resetRange">
        <mt-icon class="mr-15" faName="far fa-times-circle" faStyleClass="fa-fw" />
        清除
      </div>
    </div>
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
      default: false
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
      if (this.rangeSelection && this.range && this.range.length === 2) {
        if ( Object.keys(this.range[0]).length && Object.keys(this.range[1]).length ) {
          return true
        }
      }
    }
  },

  methods: {
    setRange (dateObj) {
      if (!this.range) {
        this.range = []
      }

      // Range Selection
      if (this.rangeSelection) {
        if (this.range.length < 2) {
          this.range.push(dateObj)
        } else {
          this.range.splice(this.range.length - 1, 1, dateObj)
        }
      } 
      // Single Selection
      else {
        if (this.range.length < 1) {
          this.range.push(dateObj)
        } else {
          this.range.splice(this.range.length - 1, 1, dateObj)
        }

        this.submitRange()
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

    submitRange() {
      this.$emit('dateSelected', this.range)
    },

    resetRange () {
      if (this.rangeSelection) {
        this.range = null
        this.$emit('rangeReseted')
      }
    },
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
          }

          > div {
            border-radius: 5px;
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
      color: white;

      i {
        color: white;
        transition: color 0.2s $easing;
      }

      &:hover {
        cursor: pointer;
      }
    }
  }
}

</style>

