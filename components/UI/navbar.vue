<template>
  <div class="mt-navbar-wrapper">

    <div class="mt-navbar">

      <div class="toggle">
        <div class="hamburger" :class="active ? 'active' : ''" ref="hamburger" @click="toggleSideMenu">
          <span class="bar top"></span>
          <span class="bar middle"></span>
          <span class="bar bottom"></span>
        </div>
      </div>

      <div class="brand">
        <img />
        <h1>米团</h1>
      </div>

      <div class="menu">
        <div class="menu-item" v-for="num in 3" :key="num">
          <mt-icon v-if="true" 
            faStyleClass="fa-fw fa-lg"
            :faName="menuIcon" 
            :color="textColor"/>

          <span>{{ '项目 ' + num }}</span>
        </div>
      </div>
    </div><!-- .mt-navbar -->

    <div class="mt-navbar-side" 
      :class="showSideMenu ? 'dim' : ''">

      <transition name="slide">
      <div class="side-menu" ref="sideMenu"
        v-show="showSideMenu"
        v-click-outside="hdieSideMenu">

        <div class="brand">
          <img />
          <h1>米团</h1>
        </div>

        <div class="menu-item" v-for="num in 3" :key="num">
          <mt-icon v-if="true" 
            faStyleClass="fa-fw"
            :faName="menuIcon" 
            :color="textColor"/>

          <span>{{ '项目 ' + num }}</span>
        </div>

        <div class="control">
          <div class="toggle">
            <div class="hamburger" :class="active ? 'active' : ''">
              <span class="bar top"></span>
              <span class="bar middle"></span>
              <span class="bar bottom"></span>
            </div>
          </div>

          <div class="setting"></div>
        </div>

      </div>
      </transition>
    </div> <!-- .mt-navbar-side -->

  </div><!-- .mt-navbar-wrapper -->
</template>

<script>
export default {
  data () {
    return {
      active: false,
      showSideMenu: false,
    }
  },

  computed: {
    menuIcon () {
      return 'far fa-dot-circle'
    },
    textColor () {
      return 'black'
    }
  },

  methods: {
    toggleSideMenu (event) {
      let $toggle = this.$refs.hamburger

      if (event.target === $toggle || $toggle.contains(event.target) ) {
        this.active = !this.active
        this.showSideMenu = !this.showSideMenu
      }
    },

    hdieSideMenu (event) {
      let $toggle = this.$refs.hamburger,
          $sideMenu = this.$refs.sideMenu

      if (this.showSideMenu && !(event.target === $sideMenu || $sideMenu.contains(event.target)) && !(event.target === $toggle || $toggle.contains(event.target)) ) {
        this.active = false
        this.showSideMenu = false
      }
    },
  }
}
</script>



<style lang="scss">
.mt-navbar-wrapper {
  position: relative;
  width: 100%;
  height: 45px;

  .mt-navbar {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;

    .toggle {
      flex: 0;
      flex-basis: 60px;
      width: 60px;
      height: 100%;
    }

    .menu {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 100%;

      @media (max-width: 500px) {
        display: none;
      }

      .menu-item {
        display: flex;
        align-items: center;
        width: 100%;
        max-width: 100px;
        height: 100%;

        i {
          margin-right: 5px;
        }

        span {}
      }
    }
  }

  .mt-navbar-side {
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    user-select: none;
    pointer-events: none;
    z-index: 99;

    &::after {
      content: '';
      position: absolute;
      top: 0px;
      left: 0px;
      right: 0px;
      bottom: 0px;
      background: transparent;
      opacity: 0;
      transition: all 0.2s ease-out;
      user-select: none;
      pointer-events: none;
      z-index: -1;
    }

    &.dim::after {
      background: rgb(48, 48, 48);
      opacity: 0.45;
      pointer-events: auto;
    }

    @media (min-width: 501px) {
      display: none;
    }

    .side-menu {
      position: absolute;
      top: 0px;
      bottom: 0px;
      left: 0px;
      width: 60%;
      max-width: 340px;
      background: #7167D5;
      user-select: auto;
      pointer-events: auto;

      .brand {
        height: 50px;
        max-width: 340px;
        text-align: center;
      }
      
      .menu-item {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 50px;

        i {
          flex: 0;
          margin-right: 15px;
          max-width: 50px;
        }
        span {
          flex: 1;
          max-width: 150px;
        }
      }

      .control {
        display: flex;
        position: absolute;
        left: 0px;
        bottom: 0px;
        width: 100%;
        height: 50px;

        .toggle {
          flex: 1;
          height: 100%;
        }

        .setting {
          flex: 1;
          height: 100%;
        }
      }
    }

    
    
  }
}

.toggle {
  display: flex;
  justify-content: center;
  align-items: center;

  .hamburger {
    position: absolute;
    cursor: pointer;

    .bar {
      display: block;
      width: 18px;
      height: 2px;
      margin-bottom: 3px;
      background: black;
      transform-origin: center;
      transition: all 0.2s ease-out;
      opacity: 1;

      &:last-child {
        margin-bottom: 0px;
      }
    }

    &.active {
      .bar {
        &.top {
          transform: translateY(5px) rotate(45deg);
        }
        &.middle {
          opacity: 0;
        }
        &.bottom {
          transform: translateY(-5px) rotate(-45deg);
        }

      }
    }
  }
}

.brand {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  img {
    flex: 0
  }

  h1 {
    flex: 1;
    font-size: 20px;
  }
}


.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease-out;
}
.slide-enter, .slide-leave-to {
  transform: translateX(-340px);
}

</style>
