<template>
  <div class="mt-dropdown-grid">
    <div class="mt-dropdown-grid-selection" :style="`color: ${ fontColor }`">{{ selection || initialValue || '请选择' }}</div>
    <div class="mt-dropdown-grid-carret mt-layout-row row-center"
      :class="showDropdown ? 'active' : ''"
      @click="showDropdown = !showDropdown">

      <mt-icon faName="fas fa-caret-left" faStyleClass="fa-fw" :style="`color: ${ fontColor }`"/>
    </div>
    <div class="dropdown-wrapper mt-layout-row row-left" v-show="showDropdown">
      <div class="chip" 
        v-for="(item, index) in options" :key="index"
        @click="select(item)">{{ item }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      require: true
    },

    initialValue: {
      type: [String, Number],
      require: false
    },

    fontColor: {
      type: String,
      default: 'white'
    }
  },

  data () {
    return {
      selection: null,
      showDropdown: false,
    }
  },

  methods: {
    select (item) {
      this.selection = item
      this.showDropdown = false

      this.$emit('select', item)
    }
  }
}
</script>

<style lang="scss">
@import '~assets/style/color';

.mt-dropdown-grid {
  display: inline-block;
  position: relative;
  z-index: 1;

  &-selection {
    display: inline-block;
    padding: 5px 45px 5px 15px;
    border-radius: 5px;
    line-height: 1;
    font-size: 14px;
    background: $primary;
  }

  &-carret {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 30px;
    height: 100%;

    &:hover {
      cursor: pointer;
    }

    &::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 0px;
      width: 1px;
      height: 50%;
      background: rgba(255, 255, 255, 0.7);
      transform: translate(-50%, -50%);
    }

    i {
      transition: transform 0.3s;
    }

    &.active {
      &::after {
        content: "";
        position: absolute;
        top: calc(100% + 15px);
        right: 15px;
        width: 15px;
        height: 15px;
        background: $primary;
        transform: translate(50%, -50%) rotate(45deg);
        transform-origin: center;
      }

      i {
        transform: rotate(-90deg);
      }
    }
  }

  .dropdown-wrapper {
    position: absolute;
    top: calc(100% + 15px);
    left: 0px;
    padding: 10px 15px;
    border-radius: 5px;
    background: white;
    box-shadow: 0px 2px 10px -3px rgba(0, 0, 0, 0.5);
    z-index: 2;
  }
}

.chip {
  position: relative;
  padding: 5px 8px;
  line-height: 1;
  font-size: 14px;
  border-radius: 5px;

  &:hover {
    background: $primary;
    color: white;
    cursor: pointer;
  }
}
</style>


