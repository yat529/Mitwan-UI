<template>
  <div class="mt-date-picker mt-layout-row" :class="selectionComplete ? 'selection-complete' : ''" v-if="calenderDays">
    <label :for="'day-' + index"
      class="day text--white" :class="classObj(index)"
      :style="style"
      v-for="(day, index) in calenderDays" :key="index">
      
      {{ day }}

      <input type="checkbox"
        :id="'day-' + index"
        :value="day"
        @click.stop="selectDate(index, day)"/>

    </label>
  </div>
</template>

<script>
export default {
  props: {
    year: {
      type: Number,
      require: true
    },

    month: {
      type: Number,
      require: true
    },

    range: {
      type: Array,
      require: false
    },

    labelHeight: {
      type: Number,
      require: false,
      default: 45
    },

    rangeSelection: {
      type: Boolean,
      require: false,
    }
  },

  data () {
    return {
      calenderDays: null,
      calenderSize: null,
      daysOfPrevousMonth: null,
      currentDateIndex: null,
      currentMonthFirstDayIndex: null,
      nextMonthFirstDayIndex: null
    }
  },

  computed: {
    style () {
      return `height: ${ this.labelHeight }px; line-height: ${ this.labelHeight }px;`
    },

    /* 
    ** List of days in previous month in current date picker
    ** @output: Array
    */
    previousMonthDays () {
      let arr = [],
          daysOfPrevousMonth = this.daysOfPrevousMonth

      // build array in increasing order
      for (let i = this.currentMonthFirstDayIndex - 1; i >= 0; i --) {
        arr.push(daysOfPrevousMonth - i)
      }
      return arr
    },

    /* 
    ** List of days in next month in current date picker
    ** @output: Array
    */
    nextMonthDays () {
      let arr = [],
          daysOfNextMonth = this.calenderSize - this.nextMonthFirstDayIndex

      // build array in increasing order
      for (let i = 1; i <= daysOfNextMonth; i++) {
        arr.push(i)
      }
      return arr
    },

    /* 
    ** Previous Month
    */
    previousMonth () {
      return this.month === 1 ? 12 : this.month - 1
    },

    /* 
    ** Previous Month Year
    */
    previousMonthYear () {
      return this.month === 1 ? this.year - 1 : this.year
    },

    /* 
    ** Next Month
    */
    nextMonth () {
      return this.month === 12 ? 1 : this.month + 1
    },

    /* 
    ** Next Month Year
    */
    nextMonthYear () {
      return this.month === 12 ? this.year + 1 : this.year
    },

    /* 
    ** Check if range start is within the date picker
    ** @ouput: Boolean
    */
    isRangeStartWithin () {
      if (this.range && this.range[0]) {
        return ( new Date(this.range[0].year, this.range[0].month - 1, this.range[0].day) >=
               new Date (this.previousMonthYear, this.previousMonth - 1, this.previousMonthDays[0]) ) &&
               ( new Date(this.range[0].year, this.range[0].month - 1, this.range[0].day) <=
               new Date (this.nextMonthYear, this.nextMonth - 1, this.nextMonthDays[this.nextMonthDays.length - 1]) )
      }
    },

    /* 
    ** Check if range start is within the date picker
    ** @ouput: Boolean
    */
    isRangeEndWithin () {
      if (this.range && this.range[1]) {
        return ( new Date(this.range[1].year, this.range[1].month - 1, this.range[1].day) >=
               new Date (this.previousMonthYear, this.previousMonth - 1, this.previousMonthDays[0]) ) &&
               ( new Date(this.range[1].year, this.range[1].month - 1, this.range[1].day) <=
               new Date (this.nextMonthYear, this.nextMonth - 1, this.nextMonthDays[this.nextMonthDays.length - 1]) )
      }
    },

    /* 
    ** Check if current date picker is witin the range dates
    ** @output: boolean
    */
    isRangeContain () {
      // if (range start > picker starting date && range end > picker ending date)
      if (this.range && this.range.length === 2) {
        return new Date(this.range[0].year, this.range[0].month - 1, this.range[0].day) < new Date (this.previousMonthYear, this.previousMonth - 1, this.previousMonthDays[0]) &&
              new Date(this.range[1].year, this.range[1].month - 1, this.range[1].day) > new Date (this.nextMonthYear, this.nextMonth - 1, this.nextMonthDays[this.nextMonthDays.length - 1])
      }
    },

    /* 
    ** Check if current date picker is witin the range dates
    ** @output: boolean
    */
    isRangeExclude () {
      return !this.isRangeStartWithin && !this.isRangeEndWithin && !this.isRangeContain
    },

    /* 
    ** Covert the range prop to current range for current date picker component
    ** @output: Array or undefined
    */
    currentRange () {
      let range
      if (this.range) {
        // deep copy this.range array
        range = this.range.map(item => {
          if (typeof item === 'object') {
            return Object.assign({}, item)
          } else {
            return item
          }
        })

        // For single selection
        if (!this.rangeSelection) {
          if (this.isRangeStartWithin) {
            range.splice(0, 0, this.createCurrentDateObj(range[0]))
          } else {
            range = null
          }
        } 
        
        // For range selection
        else {
          if (this.range.length === 1) {
            // deal with situation only range start is set, and navigate to future months,
            // set range start to empty object to show the css affect
            if (!this.isRangeStartWithin) {
              if ( this.isInPastDatePickers(range[0]) ) {
                range = [{}]
              } 
            }
          }

          // if both selection is made
          else if (this.range.length === 2) {
            // if selection is not within current date picker
            if (this.isRangeExclude) {
              range = null
            }
            // if selection containers current date picker
            else if (this.isRangeContain) {
              range = [{}, {}]
            }
            // if selection is within the range of current date picker
            else {
              if (this.isRangeStartWithin) {
                range.splice(0, 1, this.createCurrentDateObj(range[0]))
              }
              else {
                // range = [{empty}, {}]
                range.splice(0, 1, {})
              }
              
              if (this.isRangeEndWithin) {
                range.splice(1, 1, this.createCurrentDateObj(range[1]))
              }
              else {
                // range = [{}, {empty}]
                range.splice(1, 1, {})
              }
            }
          }
        }
      }

      return range
    },

    /* 
    ** Range Selection Start Index
    ** @ouput: number or undefined
    */
    rangeStart () {
      let index

      if (this.rangeSelection && this.currentRange && this.currentRange[0]) {
        if (Object.keys(this.currentRange[0]).length) {
          index = this.currentRange[0].index
        }
      }
      return index
    },

    /* 
    ** Alternative Selection Start Index
    ** @ouput: number or undefined
    ** Note: Range start is not the actual start
    */
    rangeStartAlt () {
      let index
      if (this.rangeSelection && this.currentRange && this.currentRange[0]) {
        if (!Object.keys(this.currentRange[0]).length) {
          index = 0
        }
      }
      return index
    },

    /* 
    ** Range Selection End Index
    ** @ouput: number or undefined
    */
    rangeEnd () {
      let index

      if (this.rangeSelection && this.currentRange && this.currentRange[1]) {
        if (Object.keys(this.currentRange[1]).length) {
          index = this.currentRange[1].index
        }
      }
      return index
    },

    /* 
    ** Alternative Selection End Index
    ** @ouput: number or undefined
    ** Note: Range start is not the actual end
    */
    rangeEndAlt () {
      let index
      if (this.rangeSelection && this.currentRange && this.currentRange[1]) {
        if (!Object.keys(this.currentRange[1]).length) {
          index = this.calenderSize - 1
        }
      }
      return index
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

    /* 
    ** Assign classes of div.day
    ** @ouput: Object
    */
    classObj (index) {
      return {
        'previous-month': index < this.currentMonthFirstDayIndex,
        'current-month': index < this.nextMonthFirstDayIndex && index >= this.currentMonthFirstDayIndex,
        'next-month': index >= this.nextMonthFirstDayIndex,
        'active': this.activeClass(index),
        'current': index === this.currentDateIndex,
        'range-start': index === this.rangeStart,
        'range-end': index === this.rangeEnd,
        'range-start-alt': index === this.rangeStartAlt,
        'range-end-alt': index === this.rangeEndAlt
      }
    },
    
    /* 
    ** Determine the active class of div.day
    ** @ouput: boolean
    */
    activeClass (index) {
      let isActive

      // if range selection
      if (this.rangeSelection && this.currentRange) {
        if (Object.keys(this.currentRange[0]).length) {

          if (this.currentRange[1] && Object.keys(this.currentRange[1]).length) {
            isActive = index === this.rangeStart || index === this.rangeEnd
          } else {
            isActive = index === this.rangeStart
          }
          
        } else {
          isActive = index === this.rangeEnd
        }
      }

      else if (!this.rangeSelection && this.currentRange) {
        isActive = this.currentRange[0].index === index
      }

      return isActive
    },

    /* 
    ** Check if date param is within current month of date picker
    ** @output: Boolean
    ** @param: Date Object, ex: {yaer: 2018, month: 8, day: 12, index: 13}
    */
    isWithinCurrentMonth (date)  {
      if (date.month === this.month && date.year === this.year) {
        return date.index < this.nextMonthFirstDayIndex
      }
      return false
    },

    /* 
    ** Check if date param is within prvious/next month of date picker
    ** @output: Boolean
    ** @param: Date Object, ex: {yaer: 2018, month: 8, day: 12, index: 13}
    */
    isWithinPreviousMonth (date) {
      return this.previousMonthYear === date.year && this.previousMonth === date.month && 
             this.previousMonthDays.includes(date.day)
    },

    isWithinNextMonth (date) {
      return this.nextMonthYear === date.year && this.nextMonth === date.month && 
             this.nextMonthDays.includes(date.day)
    },


    /* 
    ** Check if date param is within prvious/next date pickers
    ** @output: Boolean
    ** @param: Date Object, ex: {yaer: 2018, month: 8, day: 12, index: 13}
    */
    isInPastDatePickers (date) {
      return new Date (this.previousMonthYear, this.previousMonth - 1, this.previousMonthDays[0]) >
             new Date (date.year, date.month - 1, date.day)
    },

    // isInFutureDatePickers (date) {
    //   return new Date (this.nextMonthYear, this.nextMonth - 1, this.nextMonthDays[0]) <
    //          new Date (date.year, date.month - 1, date.day)
    // },


    /* 
    ** Create the proper date object for currentRange Array
    ** @ouput: Date Object
    ** @param: Date Object
    */
    createCurrentDateObj (date) {
      let index = date.index
      // previous month dates of current month picker
      if ( this.isWithinPreviousMonth(date) ) {
        index = this.previousMonthDays.indexOf(date.day)
      } 
      
      // next month dates of current month picker
      else if ( this.isWithinNextMonth(date) ) {
        index = this.nextMonthDays.indexOf(date.day) + this.nextMonthFirstDayIndex
      }

      else if ( this.isWithinCurrentMonth(date) ) {
        index = this.calenderDays.indexOf(date.day, this.currentMonthFirstDayIndex)
      }

      date.index = index
      return date
    },

    /* 
    ** select date and create date object, and emit event
    ** @output: Object
    ** Note: This is the method to emit date obeject payload to parent component
    */
    selectDate (index, day) {
      let selectedDate = {
            year: this.year,
            month: this.month,
            day: day,
            index: index
          }

      if ( index < this.currentMonthFirstDayIndex ) {
        this.$emit('previousMonth')
      } else if ( index < this.nextMonthFirstDayIndex && index >= this.currentMonthFirstDayIndex ) {
        this.$emit('selectDate', selectedDate)
      } else {
        if (this.currentRange) {
          selectedDate.month ++
          selectedDate.index = index - this.nextMonthFirstDayIndex + 1
          this.$emit('selectDate', selectedDate)
        } else {
          this.$emit('nextMonth')
        }
      }
    },


    /* 
    ** Assign value of each div.day
    ** @ouput: Number
    */
    assignValue (index) {
      let value

      if ( index < this.currentMonthFirstDayIndex ) {
        value = this.daysOfPrevousMonth - (this.currentMonthFirstDayIndex - index) + 1
      } else if ( index < this.nextMonthFirstDayIndex && index >= this.currentMonthFirstDayIndex ) {
        value = index - this.currentMonthFirstDayIndex + 1
      } else {
        value = index - this.nextMonthFirstDayIndex + 1
      }

      return value
    },

    /* 
    ** Construct & Sync Calender Data Properties on init
    */
    constructDataObj (year, month) {
      // Note this.month is NOT 0-based, is actual month number
      let first_day = new Date(year, month - 1, 1).getDay(),
          days_of_month = new Date(year, month, 0).getDate(),
          days_of_previous_month = new Date(year, month - 1, 0).getDate(),
          calender_days = 7 * 6, // 6 rows, 7 days per row
          currentDate = new Date().getDate(),
          currentMonth = new Date().getMonth() + 1

      first_day = first_day === 0 ? first_day + 7 : first_day

      // Assign data
      this.currentDateIndex = month === currentMonth ? currentDate + first_day - 1 : null
      this.currentMonthFirstDayIndex = first_day
      this.nextMonthFirstDayIndex = days_of_month + first_day
      this.calenderSize = calender_days
      this.daysOfPrevousMonth = days_of_previous_month
    },

    /* 
    ** Construct & Sync Calender Days Array
    */
    constructCalender (year, month) {
      this.constructDataObj(year, month)

      // Create Calender Days Array
      let calenderDays = []
      
      for (let index = 0; index < this.calenderSize; index++) {
        let dayValue = this.assignValue(index)
        calenderDays.push(dayValue)
      }

      this.calenderDays = calenderDays
    },
  },

  // Watch for Prop changes passed from parent component
  // Update Calender days and data props
  watch: {
    year (newVal) {
      if (newVal) {
        this.constructCalender(this.year, this.month)
      }
    },
    month (newVal) {
      if (newVal) {
        this.constructCalender(this.year, this.month)
      }
    }
  },

  created () {
    this.constructCalender(this.year, this.month)
  },

}
</script>

<style lang="scss">
@import '~assets/style/_color';

$easing: cubic-bezier(0.25, 0.46, 0.45, 0.94);

.mt-date-picker {
  position: relative;
  width: 100%;
  flex-wrap: wrap;
  z-index: 1;

  &::after {
    content: "";
    position: absolute;
    left: 0px;
    bottom: 0px;
    height: 1px;
    width: 0%;
    // background: $greyBg;
    transition: all 0.3s $easing;
  }

  &.selection-complete {
    &::before {
      content: "";
      position: absolute;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
      z-index: 10;
    }

    &::after {
      width: 100%;
    }
  }

  .day {
    position: relative;
    width: percentage(1/7);
    height: 35px;
    line-height: 35px;
    text-align: center;
    user-select: none;
    background: transparent;
    transition: all 0.2s $easing;
    z-index: 1;

    &.range-start,
    &.range-start-alt {
      &::before {
        content: "";
        position: absolute;
        top: 1px;
        left: 0px;
        bottom: 1px;
        width: 100%;
        background: white;
        border-radius: 15px 0 0 15px;
        z-index: -2;
      }

      & ~ .day {
        color: $primary;

        &::before {
          content: "";
          position: absolute;
          top: 1px;
          left: 0px;
          bottom: 1px;
          width: 100%;
          background: white;
          z-index: -2;
        }
      }

      & ~ .current {
        color: $primary;

        &::after {
          border: 1px solid $primary;
        }
      }

      & ~ .day:hover {
        color: white;

        &::before {
          border-radius: 0 15px 15px 0;
        }

        &::after {
          background: $primary;
        }
      }

      &:hover ~ .day,
      & ~ .day:hover ~ .day {
        color: white;

        &::before {
          content: "";
          background: transparent;
        }

        & ~ .current {
          &::after {
            border: 1px solid white;
          }
        }
      }
    }

    &.range-start,
    &.range-start-alt,
    &.range-end {
      &.active {
        color: white;
        z-index: 2;

        &::after {
          background: $primary;
        }

        & ~ .active {
          color: white;
        }
      }
    }

    &.range-start-alt {
      &::before {
        border-radius: 0;
      }
    }

    &.range-end {
      &::before {
        border-radius: 0 15px 15px 0;
      }

      & ~ .day {
        color: white;
        
        &::before {
          content: "";
          background: transparent;
        }
      }
    }

    &.range-end-alt {
      &::before {
        border-radius: 0;
      }
    }

    &::after {
      content: "";
      position: absolute;
      top: calc(50% - 17.5px);
      left: calc(50% - 17.5px);
      width: 35px;
      height: 35px;
      border-radius: 50%;
      transition: all 0.2s $easing;
      z-index: -1;
    }

    &:hover {
      cursor: pointer;
      color: $primary;
      &::after {
        background: white;
      }
    }

    &.active {
      color: $primary;
      z-index: 2;

      &::after {
        background: white;
      }
    }

    &.current {
      color: white;

      &::after {
        border: 1px solid white;
      }
    }

    &.previous-month, &.next-month {
      color: $fontColorLight !important;
    }
  }

  input {
    position: absolute;
    // appearance: none;
    -webkit-appearance: none;
    pointer-events: none;
    z-index: -1;
  }
}
</style>


