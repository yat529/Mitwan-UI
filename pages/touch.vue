<template>
  <div id="touch" class="mt-layout-abs cover-screen">
    <div id="container" class="mt-layout-abs container" :style="translateStyle">
      <div class="doc mt-layout-row row-center" v-for="(doc, index) in 5" :key="index">
        <h1>{{ `page ${index + 1}` }}</h1>
      </div>
    </div>
    <div class="log mt-layout-abs">{{ log }}</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      log: 'ere',
      translateX: 0,
      translateY: 0,
    }
  },

  computed: {
    translateStyle () {
      return `transform: translateY(${this.translateY}px);`
    }
  },

  mounted () {
    let $wrapper = document.getElementById('touch'),
        $container = document.getElementById('container'),
        viewportWidth = $wrapper.offsetWidth,
        viewportHeight = $wrapper.offsetHeight,
        startY = 0,
        translateY = 0,
        sign = 1,
        growRate = 0.95,
        now = 0,
        timeSpan = 0,
        timeConstant = -16.7 / Math.log(growRate),
        vm = this,
        sum = 0

    $wrapper.addEventListener('touchstart', handleTouchStart)
    $wrapper.addEventListener('touchmove', handleTouchMove)
    $wrapper.addEventListener('touchend', handleTouchEnd)
    // $wrapper.addEventListener('touchcancel')



    function handleTouchStart (evt) {
      now = performance.now()
      startY = evt.changedTouches.item(0).pageY

      vm.log = 'touch starts, pageY: ' + startY

    }

    function handleTouchMove (evt) {
      // do nothing
    }

    function handleTouchEnd (evt) {
      timeSpan = performance.now() - now
      translateY = evt.changedTouches.item(0).pageY - startY
      sign = Math.sign(translateY)

      requestAnimationFrame(easeOut)

      setTimeout(() => {
        vm.log = 'scrolled: ' + translateY + 'px, time unit: ' + timeSpan / timeConstant
        now = 0
        console.log(translateY)
      }, 6 * timeConstant + 1)
    }

    // function handleTouchCancel () {}

    function easeOut () {
      if (timeSpan < 6 * timeConstant) {
        timeSpan = performance.now() - now
        vm.translateY += Math.exp(-timeSpan * growRate / timeConstant) * Math.abs(translateY) * sign

        if (vm.translateY < 0) {
          requestAnimationFrame(easeOut)
        } else {
          vm.translateY = 0
        }

      }
    }



    /* 
    ** Helper Functions
    */

    function copyObj (obj) {
      return {
        pageX: obj.pageX,
        pageY: obj.pageY
      }
    }

  }
}
</script>


<style lang="scss">
#touch {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.container {
  position: relative;
  width: 100%;
  // height: 100%;
  will-change: transform;
}

.log {
  top: 25px;
  left: 50%;
  width: 80vw;
  min-height: 35px;
  padding: 10px;
  transform: translateX(-50%);
  background: red;
  color: white;
}


.doc {
  width: 100vw;
  height: 100vh;
  background: black;
  color: white;
}
</style>

