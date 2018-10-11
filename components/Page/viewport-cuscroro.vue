<template>
  <div id="viewport" class="cus-slider-viewport">
    <div class="cus-slider-container" v-custom-scrollbar="true">
      <div class="doc-content">
        <slot name="pageContent"></slot>
      </div>
    </div>
  </div>
</template>

<script>

/* 
#viewport is the outter container, should be parent/root element of the page document size of the full screen overflow-x hidden will hide the browser scroll bar
.slider-container in the inner container, size of the full screen, but overflow-y set to scroll, to allow the scroll of doc content
.slider is the custom scrollbar
*/

</script>



<style lang="scss">

/* 
** Key css for custom slider
*/
.cus-slider-container {
  position: absolute;
  left: 0;
  top: 0;
  overflow-y: scroll;
  overflow-x: hidden;
  width: 100%;
  padding-right: 15px;
  width: calc(100% + 15px);
  height: 100%;
  perspective: 1px;

  .cus-slider {
    position: absolute;
    width: 7px;
    background: black;
    border-radius: 3px;
    will-change: transform;
    transition: opacity 0.2s linear;
    z-index: 10;

    &:hover {
      cursor: pointer;
    }

    &.hide {
      opacity: 0;

      &:hover {
        opacity: 1;
      }
    }
  }
}

.cus-slider-viewport {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
