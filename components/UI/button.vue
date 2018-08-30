<template>
  <button class="mt-btn" ref="btn"
    v-ripple="ripple"
    v-shadow="dropshadow">
    <div class="main-layer" :style="buttonStyle">
      <div class="icon" v-if="icon">
        <mt-icon
          :faName="icon"
          faStyleClass="fa-fw fa-lg"
          :color="textColor"/>
      </div>
      <span :style="textColor">{{ label }}</span>
    </div> 
    <div class="gradient-border-layer" :style="gradientBorderStyle">{{ label }}</div>
  </button>
</template>

<script>
export default {
  props: {

    // button text
    label: {
      type: String,
      require: true
    },

    // if show ripple effect
    rippleColor: {
      type: String,
      required: false,
    },

    // corner roundness
    roundness: {
      type: [String, Number],
      require: false
    },

    // background color
    background: {
      type: String,
      require: false,
    },

    // gradient background
    // ['from color', 'to color', 'direction]
    gradientBackground: {
      type: Array,
      require: false,
      // default () {
      //   return ['#7167D5', '#53A0FD']
      // }
    },

    // gradient border
    // ['from color', 'to color', 'direction]
    gradientBorder: {
      type: Array,
      require: false,
      // default () {
      //   return ['#7167D5', '#53A0FD']
      // }
    },

    // text color
    textColor: {
      type: String,
      require: false,
      default: 'black'
    },

    // dropshadow
    dropshadow: {
      type: Boolean,
      require: false,
      default: true
    },

    // button icon
    icon: {
      type: String,
      require: false
    }

  },

  data () {
    return {
      // 
    }
  },

  computed: {

    // main layer button style
    buttonStyle () {
      let style = ''

      // background style
      if (this.background) {
        style = `background-color: ${this.background};`
      } else if (this.gradientBackground) {
        style += this.gradientBackgroundStyle
      }

      // text color
      if (this.textColor) {
        style += `color: ${this.textColor};`
      }

      // border-radius
      if (this.roundness) {
        style += `border-radius: ${this.roundness - 2}px;`
      }

      return style
    },

    // ripple color
    ripple () {
      if (this.rippleColor) {
        return {
          color: this.rippleColor
        }
      }
    },

    gradientBackgroundStyle () {
      let style = ''
      if (this.gradientBackground) {
        // check if direction is specified, or used default to right
        let direction = this.gradientBackground.length === 3 ? this.gradientBackground[2] : 'right'
        style += `background-image: linear-gradient(to ${direction}, ${this.gradientBackground[0]}, ${this.gradientBackground[1]};`
      }

      return style
    },

    gradientBorderStyle () {
      let style = ''

      if (this.gradientBorder) {
        // check if direction is specified, or used default to right
        let direction = this.gradientBorder.length === 3 ? this.gradientBorder[2] : 'right'
        style += `background-image: linear-gradient(to ${direction}, ${this.gradientBorder[0]}, ${this.gradientBorder[1]};`
      }
      
      // fallbakcs to gradient background if specified
      else if (this.gradientBackgroundStyle) {
        let direction = this.gradientBackground.length === 3 ? this.gradientBackground[2] : 'right'
        style += `background-image: linear-gradient(to ${direction}, ${this.gradientBackground[0]}, ${this.gradientBackground[1]};`
      } 

      // fallbakcs to background if specified
      else if (this.background) {
        style += `background-color: ${this.background};`
      } 
      
      // fall back to transparent background
      else {
        style += `background: transparent;`
      }

      // add border-radius
      if (this.roundness) {
        style += `border-radius: ${this.roundness}px;`
      }

      return style
    }
  }

}
</script>

<style lang="scss">
@import '~assets/style/color';

.mt-btn {
  display: block;
  position: relative;
  padding: 0px;
  margin: 0px;
  border: none;
  background: none;
  outline: none;
  cursor: pointer;
  z-index: 1;

  // remove default appearance
  -webkit-appearance: none;
  // remove blue overlay when click
  -webkit-tap-highlight-color: transparent;

  &:focus {
    outline: none;
    border: none;
  }

  .main-layer {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 2px;
    left: 2px;
    bottom: 2px;
    right: 2px;
    cursor: pointer;
    user-select: none;

    .icon {
      display: flex;
      position: relative;
      justify-content: center;
      align-items: center;
      flex: 0;
      flex-basis: 20%;
      width: 20%;
      height: 100%;
      min-width: 40px;
      max-width: 100px;

      &::after {
        content: '';
        position: absolute;
        top: 50%;
        right: 0px;
        width: 2px;
        height: 60%;
        border-radius: 3px;
        background: #fefefe;
        transform: translateY(-50%);
      }
    }

    span {
      flex: 1;
      font-size: 0.9rem;
      font-weight: 500;
    }
  }

  .gradient-border-layer {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 10px 25px;
    color: transparent;
    user-select: none;
    z-index: -1;
  }

}
</style>


