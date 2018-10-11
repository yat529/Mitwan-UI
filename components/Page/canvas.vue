<template>
  <div class="canvas-wrapper mt-layout-row row-center z-background" :style="bgColorStyle">
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>
/* 
Canvas has a fixed position, and z-index of -10
Covers whole screen
*/

import drawLine from '~/assets/custom_modules/drawLine.js'

export default {
  props: {
    bgColor: {
      stype: String,
      required: false,
      default: 'transparent'
    },

    startAnimation: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  computed: {
    bgColorStyle () {
      if (this.bgColor) {
        return `background-color: ${this.bgColor}`
      }
    }
  },

  mounted () {
    let $canvas = document.querySelector('#canvas')

    if (this.startAnimation) {
      drawLine($canvas, {
        width: $canvas.offsetWidth,
        height: $canvas.offsetHeight,
        lines: 10,
        color: 'rgba(0,0,0,0.5)'
      })
    }

  }
}
</script>


<style lang="scss">
.canvas-wrapper {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;

  #canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
