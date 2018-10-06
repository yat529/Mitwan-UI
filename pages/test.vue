<template>
  <div id="viewport" class="container">
    <div class="slider-container" v-custom-scrollbar="true">
      <div class="doc-content">
        <div class="doc mt-layout-row row-center" v-for="(page, index) in 5" :key="index">
          <h1>Page{{ index + 1 }}</h1>
        </div>
      </div>
    </div>
  </div>
</template>

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
  padding-right: 15px;
  width: calc(100% + 15px);
  height: 100%;
  perspective: 1px;

  .slider {
    position: absolute;
    width: 7px;
    background: black;
    border-radius: 3px;
    will-change: transform;
    transition: opacity 0.2s linear;
    z-index: 10;

    &.hide {
      opacity: 0;
    }

    &:hover {
      cursor: pointer;
      opacity: 1 !important;
    }

    &::before {
      content: '';
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
