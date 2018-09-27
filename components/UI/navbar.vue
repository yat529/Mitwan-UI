<template>
  <div class="mt-navbar-wrapper">

    <div class="mt-navbar mt-layout-row" :style="navbarStyle">

      <div class="toggle" v-if="showMenuToggle">
        <hamburger ref="hamburger" :color="barFontColor" @toggle="toggleSideMenu"></hamburger>
      </div>
      <div class="px-15" v-else></div>

      <div class="brand">
        <img />
        <h1>Title</h1>
      </div>

      <div class="menu mt-layout-row row-right pr-15">
        <!-- <div class="menu-item mt-layout-row row-center" v-for="(item, index) in menu" :key="index">
          <mt-icon v-if="item.icon"
            :style="`color: ${ barFontColor }`"
            faStyleClass="fa-fw"
            :faName="item.icon"/>

          <span>{{ item.label }}</span>
        </div> -->

        <div class="menu-item square-item mt-layout-row row-center" @click="searchClicked">
          <mt-icon class="mr-0"
            :style="`color: ${ barFontColor }`"
            faStyleClass="fa-fw"
            faName="fas fa-search"/>
        </div>

        <div class="menu-item square-item mt-layout-row row-center" v-if="avatarURL" @click="avatarClicked">
          <div class="avatar" :style="avatarBgStyle"></div>
        </div>
      </div>

    </div><!-- .mt-navbar -->

    <div class="mt-navbar-side" :class="showSideMenu ? 'dim' : ''">

      <transition name="slide">
      <div class="side-menu" ref="sideMenu"
        :style="sidebarStyle"
        v-if="showSideMenu"
        v-click-outside="clickOutsideTohide">

        <div class="brand">
          <img />
          <h1>Title</h1>
        </div>

        <mt-list :list="menu"/>

        <div class="control mt-layout-row">
          <div class="toggle">
            <hamburger ref="sideHamburger" :color="barFontColor" @toggle="hieSideMenu"></hamburger>
          </div>

          <div class="setting"></div>
        </div>

      </div>
      </transition>
    </div> <!-- .mt-navbar-side -->

  </div><!-- .mt-navbar-wrapper -->
</template>

<script>
import hamburger from '@/components/icons/hamburger'

export default {
  components: {
    hamburger
  },

  props: {
    menu: {
      type: Array,
      require: true,
      default () {
        return [
          {
            label: 'Home',
            icon: 'fas fa-home',
            link: '/home'
          },
          {
            label: 'User',
            icon: 'fas fa-user',
            link: '/user',
            sublist: [
              {
                label: 'Admin',
                icon: 'fas fa-cog',
                link: '/admin'
              },
              {
                label: 'New Post',
                icon: 'fas fa-pen',
                link: '/new'
              },
              {
                label: 'View Post',
                icon: 'fas fa-list-ul',
                link: '/view'
              },
            ]
          },
          {
            label: 'About',
            icon: 'fas fa-info-circle',
            link: '/3'
          },
          {
            label: 'Contact',
            icon: 'fas fa-phone',
            link: '/4'
          },
        ]
      }
    },

    // Avatar URL
    avatarURL: {
      type: String,
      require: false
    },

    // Hamburger function toggle
    showMenuToggle: {
      type: Boolean,
      require: false,
      default: true,
    },

    /* 
    ** Navbar Style Props
    */

    // Navbar font color
    barFontColor: {
      type: String,
      require: false,
      default: 'white'
    },

    barSubmenuFontColor: {
      type: String,
      require: false,
      default: 'white'
    },

    // background color
    barBackground: {
      type: String,
      require: false,
      // default: '#7167D5'
    },

    // gradient background
    // ['from color', 'to color', 'direction]
    barGradientBackground: {
      type: Array,
      require: false,
      // default () {
      //   return ['#7167D5', '#53A0FD']
      // }
    },

    // submenu backgorund
    barSubmenuBackground: {
      type: String,
      require: false
    },
    

    /* 
    ** Submenu Style Props
    */

    // Sidebar font color
    SidebarFontColor: {
      type: String,
      require: false,
      default: 'white'
    },

    SidebarSubmenuFontColor: {
      type: String,
      require: false,
      default: 'black'
    },

    // background color
    SidebarBackground: {
      type: String,
      require: false,
      default: '#7167D5'
    },

    // gradient background
    // ['from color', 'to color', 'direction]
    SidebarGradientBackground: {
      type: Array,
      require: false,
      default () {
        return ['#7167D5', '#53A0FD']
      }
    },

    // submenu backgorund
    SidebarSubmenuBackground: {
      type: String,
      require: false,
      default: 'white'
    },


  },

  data () {
    return {
      active: false,
      showSideMenu: false,
    }
  },

  computed: {
    avatarBgStyle () {
      return `background-image: url('${ this.avatarURL }')`
    },
    navbarStyle () {
      let style ='',
          color = 'color: ',
          backgroundColor = 'background-color: ',
          backgroundImage = 'background-image: '

      if (this.barFontColor) {
        color += this.barFontColor + ';'
        style += color
      }

      if (this.barGradientBackground) {
        let direction = this.barGradientBackground.length === 3 ? this.barGradientBackground[2] : 'right'
        backgroundImage += `linear-gradient(to ${direction}, ${this.barGradientBackground[0]}, ${this.barGradientBackground[1]};`
        style += backgroundImage
      } else if (this.barBackground) {
        backgroundColor += this.barBackground + ';'
        style += backgroundColor
      }

      return style
    },

    sidebarStyle () {
      let style ='',
          color = 'color: ',
          backgroundColor = 'background-color: ',
          backgroundImage = 'background-image: '

      if (this.SidebarFontColor) {
        color += this.SidebarFontColor + ';'
        style += color
      }

      if (this.SidebarGradientBackground) {
        let direction = this.SidebarGradientBackground.length === 3 ? this.SidebarGradientBackground[2] : 'bottom'
        backgroundImage += `linear-gradient(to ${direction}, ${this.SidebarGradientBackground[0]}, ${this.SidebarGradientBackground[1]};`
        style += backgroundImage
      } else if (this.SidebarBackground) {
        backgroundColor += this.SidebarBackground + ';'
        style += backgroundColor
      }

      return style
    },

    sidebarSubmenuStyle () {
      let style ='',
          color = 'color: ',
          backgroundColor = 'background-color: '
      
      if (this.SidebarSubmenuFontColor) {
        color += this.SidebarSubmenuFontColor + ';'
        style += color
      }

      if (this.SidebarSubmenuBackground) {
        backgroundColor += this.SidebarSubmenuBackground + ';'
        style += backgroundColor
      }

      return style
    },
  },

  methods: {
    toggleSideMenu (payload) {
      this.active = payload
      this.showSideMenu = payload

      // sync active property of hamburger
      this.$nextTick(() => {
        let sideToggle = this.$refs.sideHamburger
        sideToggle.active = payload
      })
    },

    hieSideMenu () {
      let toggle = this.$refs.hamburger

      this.active = false
      this.showSideMenu = false

      // sync active property of hamburger
      toggle.active = false
    },

    clickOutsideTohide (event) {
      let $toggle = this.$refs.hamburger.$el,
          $sideToggle = this.$refs.sideHamburger.$el,
          $sideMenu = this.$refs.sideMenu

      if (this.showSideMenu && ((event.target === $sideToggle || $sideToggle.contains(event.target)) || !(event.target === $sideMenu || $sideMenu.contains(event.target)) && !(event.target === $toggle || $toggle.contains(event.target))) ) {
        this.hieSideMenu()
      }
    },


    /* 
    ** Events to emit
    */
    avatarClicked () {
      this.$emit('avatarClicked')
    },

    searchClicked () {
      this.$emit('searchClicked')
    }
  }
}
</script>



<style lang="scss">
@import '~assets/style/_color';
@import '~assets/style/_variable';

.mt-navbar-wrapper {
  position: relative;
  width: 100%;
  height: 50px;
  z-index: 99;

  .mt-navbar {
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
      height: 100%;

      // @media (max-width: 500px) {
      //   display: none;
      // }

      .menu-item {
        width: 100%;
        max-width: 100px;
        height: 100%;

        &.square-item {
          width: 50px !important;
        }

        span {
          font-weight: 500;
        }

        i {
          margin-right: 10px;
        }

        .avatar {
          width: 35px;
          height: 35px;
          border: 2px solid white;
          border-radius: 50%;
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
        }
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
      transition: all 0.2s $easing;
      user-select: none;
      pointer-events: none;
      z-index: -1;
    }

    &.dim::after {
      background: rgb(48, 48, 48);
      opacity: 0.45;
      pointer-events: auto;
    }

    .side-menu {
      position: absolute;
      top: 0px;
      bottom: 0px;
      left: 0px;
      width: 80%;
      max-width: 350px;
      background: white;
      box-shadow: 3px 0px 25px -5px rgba(0, 0, 0, 0.4);
      user-select: auto;
      pointer-events: auto;
      will-change: transform;

      .brand {
        height: 100px;
        max-width: 340px;
        text-align: center;
      }

      .control {
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
</style>
