<template>
  <div class="mt-time-picker-frame-wrapper bg-gradient--primary">

    <div class="mt-time-picker-frame-header py-15">
      <div class="main px-15">{{ mainTitle }}</div>
      <div class="sub px-15">{{ subTitile }}</div>
    </div>

    <div class="mt-time-picker-core py-25">
      <mt-time-picker-core @selectTime="getTime" />
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
      range: null,
      isPickingHour: true,
    }
  },

  computed: {
    mainTitle () {
      let titleSelections = ['请选择时间', '请选择时段开始时间', '请选择时段结束时间', '请确认选择']

      if (!this.rangeSelection) {
        return titleSelections[0]
      } else {
        if (!this.range) {
          return titleSelections[1]
        }
        else if (this.range.length === 1) {
          return titleSelections[2]
        }
      }
    },

    subTitile () {
      let titleSelections = ['正选择小时', '正选择分钟']

      return this.isPickingHour ? titleSelections[0] : titleSelections[1]
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
    },

    submit () {},
    reset () {},
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

  &-core {
    width: 100%;
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

