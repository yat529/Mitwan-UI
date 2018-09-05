<template>
  <div class="mt-navbar-wrapper">

    <div class="mt-navbar mt-layout-row" :style="navbarStyle">

      <div class="toggle">
        <hamburger ref="hamburger" :color="barFontColor" @toggle="toggleSideMenu"></hamburger>
      </div>

      <div class="brand">
        <img />
        <h1>Title</h1>
      </div>

      <div class="menu mt-layout-row row-right">
        <div class="menu-item mt-layout-row row-center" v-for="(item, index) in menu" :key="index">
          <mt-icon v-if="item.icon"
            faStyleClass="fa-fw fa-lg"
            :faName="item.icon"/>

          <span>{{ item.item }}</span>
        </div>
      </div>
    </div><!-- .mt-navbar -->

    <div class="mt-navbar-side" 
      :class="showSideMenu ? 'dim' : ''">

      <transition name="slide">
      <div class="side-menu" ref="sideMenu"
        :style="sidebarStyle"
        v-if="showSideMenu"
        v-click-outside="clickOutsideTohide">

        <div class="brand">
          <img />
          <h1>Title</h1>
        </div>

        <div class="menu-item-wrapper" v-for="(item, index) in menu" :key="index">
          <nuxt-link class="menu-item mt-layout-row row-center px-35" 
            :to="item.link"
            v-ripple="{ color: '#7167D5' }">
            <mt-icon v-if="item.icon" 
              :style="`color: ${SidebarFontColor}`"
              faStyleClass="fa-fw"
              :faName="item.icon"/>

            <p :style="`color: ${SidebarFontColor}`">{{ item.label }}</p>
          </nuxt-link>

          <div class="carret mt-layout-row row-center" v-if="item.submenu"
            :class="item.showSubmenu ? 'active' : ''"
            @click="toggleSubmenu(item)">

            <mt-icon faName="fas fa-caret-left" :style="`color: ${SidebarFontColor}`"/>
          </div>

          <transition name="show">
          <div class="submenu-item-wrapper" v-if="item.showSubmenu">
            <nuxt-link class="menu-item mt-layout-row row-center px-35" v-for="(subitem, index) in item.submenu" :key="index"
              :to="item.link + '/' + subitem.link"
              :style="sidebarSubmenuStyle"
              v-ripple="{ color: '#7167D5' }">
              <mt-icon v-if="subitem.icon" 
                :style="`color: ${SidebarSubmenuFontColor}`"
                faStyleClass="fa-fw"
                :faName="subitem.icon"/>

              <p :style="`color: ${SidebarSubmenuFontColor}`">{{ subitem.label }}</p>
            </nuxt-link>
          </div>
          </transition>

        </div>

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
            submenu: [
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
      default: '#7167D5'
    },

    // gradient background
    // ['from color', 'to color', 'direction]
    barGradientBackground: {
      type: Array,
      require: false,
      default () {
        return ['#7167D5', '#53A0FD']
      }
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
    navbarStyle () {
      let style ='',
          color = 'color: ',
          backgroundColor = 'background-color: ',
          backgroundImage = 'background-image: '

      if (this.barFontColor) {
        color += this.barFontColor + ';'
        style += color
      }

      if (this.SidebarGradientBackground) {
        let direction = this.SidebarGradientBackground.length === 3 ? this.SidebarGradientBackground[2] : 'right'
        backgroundImage += `linear-gradient(to ${direction}, ${this.SidebarGradientBackground[0]}, ${this.SidebarGradientBackground[1]};`
        style += backgroundImage
      } else if (this.SidebarBackground) {
        backgroundColor += this.SidebarBackground + ';'
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

      if (this.barGradientBackground) {
        let direction = this.barGradientBackground.length === 3 ? this.barGradientBackground[2] : 'bottom'
        backgroundImage += `linear-gradient(to ${direction}, ${this.barGradientBackground[0]}, ${this.barGradientBackground[1]};`
        style += backgroundImage
      } else if (this.barBackground) {
        backgroundColor += this.barBackground + ';'
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

    toggleSubmenu (item) {
      let $menuItemWrapper = event.currentTarget.parentElement
          

      if (!item.showSubmenu || 'showSubmenu' in item === false) {
        if ('showSubmenu' in item === false) {
          this.$set(item, 'showSubmenu', true)
        }

        item.showSubmenu = true

        this.$nextTick(() => {
          let menuItemWrapperHeight = $menuItemWrapper.offsetHeight,
              $submenu = $menuItemWrapper.querySelector('.submenu-item-wrapper'),
              submenuItemWrapperHeight = 0

          for (let $subitem of $submenu.children) {
            submenuItemWrapperHeight += $subitem.offsetHeight
          }

          menuItemWrapperHeight += submenuItemWrapperHeight
          $menuItemWrapper.style.height = menuItemWrapperHeight + 'px'

          $menuItemWrapper.classList.add('active')
        })

      } else {
        item.showSubmenu = false
        $menuItemWrapper.style.height = null
        $menuItemWrapper.classList.remove('active')
      }
    }
  }
}
</script>



<style lang="scss">
@import '~assets/style/color';

$easing: cubic-bezier(0.25, 0.46, 0.45, 0.94); 

.mt-navbar-wrapper {
  position: relative;
  width: 100%;
  height: 50px;

  .mt-navbar {
    // display: flex;
    // align-items: center;
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
      // display: flex;
      // justify-content: flex-end;
      // align-items: center;
      height: 100%;

      @media (max-width: 500px) {
        display: none;
      }

      .menu-item {
        // display: flex;
        // align-items: center;
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

    @media (min-width: 501px) {
      display: none;
    }

    .side-menu {
      position: absolute;
      top: 0px;
      bottom: 0px;
      left: 0px;
      width: 80%;
      max-width: 450px;
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

      .menu-item-wrapper {
        position: relative;
        width: 100%;
        height: 70px;
        transition: height 0.2s $easing;
        overflow: hidden;

        .menu-item {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 70px;
          text-decoration: none;
          color: $fontColor;

          i {
            flex: 0;
            margin-right: 35px;
          }

          p {
            flex: 1;
          }
        }

        .carret {
          position: absolute;
          top: 22.5px;
          right: 35px;
          width: 25px;
          height: 25px;
          border-radius: 100%;
          flex-basis: 25px;
          text-align: center;
          transition: transform 0.2s linear;
          z-index: 3;

          &.active {
            transform: rotate(-90deg);
          }

          i {
            margin: 0;
          }
        }

        .submenu-item-wrapper {
          position: relative;
          width: 100%;
          background: #eeeeee;
          box-shadow: inset -1px 1px 3px -2px rgba(0, 0, 0, 0.4), inset -1px -1px 3px -2px rgba(0, 0, 0, 0.4);

          .menu-item {
            height: 50px;
            text-decoration: none;
            color: lighten($fontColor, 20%);

            &:last-child {
              border-bottom: 1px solid transparent;
            }
          }
        }
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


/* 
** Transitions 
*/


.slide-enter-active, .slide-leave-active {
  transition: all 0.3s $easing;
}

.slide-enter-active {
  transition-delay: 0.1s;
}

.slide-enter, .slide-leave-to {
  transform: translateX(-340px);
  will-change: transform;
}

.show-enter-active, .show-leave-active {
  transition: all 0.1s $easing;
}

.show-enter {
  transition-delay: 0.1s;
}

.show-enter, .show-leave-to {
  opacity: 0;
}

</style>
