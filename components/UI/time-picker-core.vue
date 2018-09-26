<template>
  <div class="mt-watch-wrapper mt-layout-row row-center">
    <div class="mt-watch-face">
      <div class="mt-watch-face-period">
        <div class="am-period" :class="period === 0 ? 'active' : ''" @click="period = 0">am</div>
        <div class="pm-period" :class="period === 1 ? 'active' : ''" @click="period = 1">pm</div>
      </div>

      <div class="mt-watch-face-display">
        <div class="hour-display" @click="isPickingHour = true">{{ formatTime(hour) }}</div>
        <div class="minute-display" @click="isPickingHour = false">{{ formatTime(minute) }}</div>
      </div>

      <div class="mt-watch-face-dot" :class="'dot-' + value" v-for="(value, index) in 12" :key="index"
        @click="selectTime(value)"></div>

      <div class="mt-watch-face-center-dot"></div>
      <div class="mt-watch-face-needles hour-needle" :style="hourNeedleRotationStyle"></div>
      <div class="mt-watch-face-needles minute-needle" :style="minuteNeedleRotationStyle"></div>

    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      hour: 12,
      minute: 0,
      period: 0,
      isPickingHour: true,
      hourNeedleRotation: 0,
      minuteNeedleRotation: 0,
    }
  },

  computed: {
    // Needle rotation style
    hourNeedleRotationStyle () {
      return `transform: rotate(${this.hourNeedleRotation}deg)`
    },
    minuteNeedleRotationStyle () {
      return `transform: rotate(${this.minuteNeedleRotation}deg)`
    },
  },

  watch: {
    period (newVaL) {
      console.log('change period')
      this.submitTime()
    },

    isPickingHour (newVal) {
      console.log('change needle')
      this.submitTime()
    }
  },

  methods: {
    selectTime (value) {
      if (value === 12) {
        value = 0
      }

      if (this.isPickingHour) {
        this.hour = value
        this.hourNeedleRotation = 30 * value
      } else {
        this.minute = 5 * value
        this.minuteNeedleRotation = 30 * value
      }

      this.submitTime()
    },

    submitTime () {
      this.$emit('selectTime', {
        hour: this.hour,
        minute: this.minute,
        period: this.period,
        isPickingHour: this.isPickingHour
      })
    },

    // format time to string
    formatTime (time) {
      if (time < 10) {
        time = '0' + time.toString()
      } else {
        time = time.toString()
      }
      return time
    }

  },
}
</script>


<style lang="scss">
@import '~assets/style/_color';

$watchFaceBg: #3F484A;

/* 
** Dots rotation styles
*/
@mixin dots {
  $dot: 1;

  @for $dot from 1 through 12 {
    &-#{$dot} {
      @if $dot == 12 {
        transform: rotate(0deg);
      }
      @else {
        transform: rotate(($dot*30) +deg);
      }
    }
  }
}

/* 
** Watch Specific Font Style
*/
%watchFontStyle {
  font-family: "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

.mt-watch {
  &-wrapper {
    width: 100%;
  }

  &-face {
    position: relative;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    border: 10px solid $greyBg;
    background: $watchFaceBg;
    box-sizing: content-box;
    box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.5), 1px 1px 2px rgba(0, 0, 0, 0.3);

    &-period {
      position: absolute;
      top: 80px;
      left: 100px;
      width: 80px;
      height: 25px;
      border-radius: 5px;
      overflow: hidden;
      z-index: 1;

      .am-period,
      .pm-period {
        float: left;
        width: 50%;
        height: 100%;
        margin: 0;
        line-height: 25px;
        text-align: center;
        background: $greyBg;
        color: $watchFaceBg;
        @extend %watchFontStyle;

        &.active {
          background: darken($warning, 10%);
        }

        &:hover {
          cursor: pointer;
        }
      }
    }

    &-display {
      position: absolute;
      bottom: 60px;
      left: 90px;
      width: 100px;
      height: 50px;
      z-index: 1;

      .hour-display,
      .minute-display {
        float: left;
        width: 46px;
        height: 100%;
        line-height: 50px;
        text-align: center;
        font-size: 30px;
        color: $watchFaceBg;
        border-radius: 5px;
        background: $greyBg;
        @extend %watchFontStyle;

        &:hover {
          cursor: pointer;
        }
      }

      .minute-display {
        float: right;
      }
    }

    &-dot {
      position: absolute;
      top: 5px;
      left: calc(50% -15px);
      width: 30px;
      height: 30px;
      border-radius: 50%;
      transform-origin: 15px 135px;
      z-index: 10;

      &::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 10px;
        height: 10px;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background: $greyBg;
      }

      &:hover {
        cursor: pointer;
      }

      &.dot {
        @include dots;
      }
    }

    &-center-dot {
      position: absolute;
      top: 133px;
      left: 133px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: $greyBg;
      z-index: 1;
    }

    &-needles {
      position: absolute;
      background: $greyBg;
      border-radius: 1px;
      box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
      transition: transform 0.2s linear;
      pointer-events: none;
      z-index: 20;

      &.minute-needle {
        top: 10px;
        left: 138px;
        width: 4px;
        height: 150px;
        transform: rotate(120deg);
        transform-origin: center 130px;
      }

      &.hour-needle {
        top: 40px;
        left: 137px;
        width: 6px;
        height: 120px;
        transform: rotate(40deg);
        transform-origin: center 100px;
      }
    }

    
  }
}
</style>

