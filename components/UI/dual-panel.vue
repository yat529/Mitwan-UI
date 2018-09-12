<template>
  <div class="mt-layout-abs mt-layout-row cover-screen">
    <div class="panel bg-panel" :style="bgStyle"></div>
    <div class="panel fg-panel" :class="centerContent ? 'mt-layout-row row-center' : ''">
      <slot class="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // background image on bg panel
    backgroundURL: {
      type: String,
      require: false
    },

    // Horizontal & Verticle center
    centerContent: {
      type: Boolean,
      require: false
    }
  },

  computed: {
    bgStyle () {
      let style = ''
      if (this.backgroundURL) {
        style += `background-image: url('${ this.backgroundURL }')`
      }
      return style
    }
  }
}
</script>


<style lang="scss">
.panel {
  position: absolute;
  top: 0px;
  height: 100%;

  &.bg-panel {
    left: 0px;
    width: 100%;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    z-index: -1;
  }

  &.fg-panel {
    right: 0px;
    width: 50%;
    transition: all 0.2s ease-out;
  }

  @media (max-width: 1200px) {
    &.fg-panel {
      right: 50%;
      transform: translateX(50%);
    }
  }

  @media (max-width: 600px) {
    &.fg-panel {
      width: 100%;
      height: 100%;
      top: 50%;
      right: 50%;
      transform: translate(50%, -50%);
    }
  }
}
</style>
