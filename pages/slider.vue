<template>
  <div id="viewport" class="container">
    <div class="slider-container">
      <div class="slider"></div>
      <div class="doc-content">
        <div class="doc mt-layout-row row-center" v-for="(page, index) in 5" :key="index">
          <h1>Page{{ index + 1 }}</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted () {
    let $viewport = document.querySelector('.slider-container'),
        $slider = document.querySelector('.slider'),
        $contentBody = document.querySelector('.doc-content')

    let scrollHeight = $contentBody.scrollHeight,
        viewportWidth = $viewport.offsetWidth,
        viewportHeight = $viewport.offsetHeight,
        scrollbarWidth = $slider.offsetWidth,
        scrollBarHeight = (viewportHeight/scrollHeight) * viewportHeight,
        scrollDistance = scrollHeight - viewportHeight

    let factor = (viewportHeight - scrollBarHeight)/(scrollHeight - viewportHeight),
        proportion = 1 / (Math.abs(1 - 1/factor) + 2)

    
    // // auto hide feature
    // let hideScrollbar = false
    $slider.style.opacity = 1

    // let timeout = setTimeout(() => {
    //       hideScrollbar = true
    //       $slider.style.opacity = 0
    //     }, 1500)

    // document.addEventListener('wheel', e => {
    //   if (!hideScrollbar) return
    //   if (timeout) {
    //     clearTimeout(timeout)
    //   }

    //   hideScrollbar = false
    //   $slider.style.opacity = 1
      
    //   timeout = setTimeout(() => {
    //     hideScrollbar = true
    //     $slider.style.opacity = null
    //   }, 2500)
    // })

    // define the perspective origin to left top with some adjustment
    $viewport.style = `perspective-origin: ${viewportWidth - scrollbarWidth/2 - 10 * (1 - proportion)}px ${viewportHeight * proportion}px`

    // define the scrollbar height
    $slider.style.height = `${ scrollBarHeight }px`

    // these two properties actually is top, right
    // since we invert the 4th axis in matrix, we need to manually invert the postioin properties
    // therefore, it becomes bottom, right
    $slider.style.right = `0px`
    // center before transformation
    $slider.style.bottom = `${ viewportHeight/2 - scrollBarHeight/2 }px`

    // apply the scrollbar transformation
    $slider.style.transform = `
      matrix3d(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, -1
      )
      scale(${1/factor})
      translateZ(-2px)
      translateZ(${1 - 1/factor}px)`
  }
}
</script>



<style lang="scss">

/* 
** Key css for custom slider
*/
.slider-container {
  position: absolute;
  left: 0;
  top: 0;
  overflow-y: scroll;
  overflow-x: hidden;
  width: 100%;
  padding-right: 10px;
  width: calc(100% + 10px);
  height: 100%;
  perspective: 1px;

  .slider {
    position: absolute;
    width: 7px;
    background: black;
    border-radius: 3px;
    will-change: transform;
    opacity: 0;
    transition: opacity 0.2s linear;
    z-index: 10;

    &:hover {
      cursor: pointer;
      opacity: 1;
    }

    &::before {
      content: '看这里!';
      display: block;
      position: absolute;
      top: 50%;
      left: 0px;
      width: 80px;
      transform: translate(-100%, -50%);
      text-align: center;
    }
  }
}

.container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #ffde1d;
  overflow: hidden;
}

.doc-content {
  position: relative;

  .doc {
    width: 100%;
    height: 100vh;
    border-bottom:  2px solid black;

    &:last-child {
      border-bottom: 2px solid transparent;
    }
  }
}

h1 {
  font-family: 'Oswald', sans-serif;
  font-size: 36px !important;
  font-weight: bold;
}
</style>
