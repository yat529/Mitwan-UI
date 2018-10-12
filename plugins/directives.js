import Vue from 'vue'
import Cuscroro from '~/assets/custom_modules/cuscroro.js'

/* 
** custom scroobar directive
** @ full screen block element, with class 'cus-slider-container'
** ex: hide the default scrollbar by place an extra 10px width of the 
**     inner .cus-slider-container element, and hide it by applying 
**     overflow: hidden to parent element.
*/

const customScrollBar = {
  bind (el, binding, vnode) {

    if (el && binding.value) {
      el.__Cuscroro = Cuscroro(el, {
        hideOnInactive: 2000
      })
    }

  },
  update (newVal, oldVal) {
    if (newVal) {
      // new Cuscroro in nextTick
      Vue.nextTick(() => {
        newVal.__Cuscroro = Cuscroro(newVal, {
          hideOnInactive: 2000
        })
      })
    }
  },
  unbind () {
    el.__Cuscroro.clear()
    el.__Cuscroro = null
  }
}

Vue.directive('custom-scrollbar', customScrollBar)

/* 
** click outside directive
** @ select component
** ex: toggle off the selection list when click outside
*/

const clickOutside = {
  bind (el, binding, vnode) {

    // bind the handler to el, so it can be used by other hook
    el.__cus_evnt_clickOutside = (event) => {
      // if click target is not el or children of el
      if ( !( event.target === el || el.contains(event.target) ) ) {

        // directive only takes function
        if (typeof binding.value === 'function') {
          vnode.context[binding.expression](event)
        }
      }
    }

    document.addEventListener('click', el.__cus_evnt_clickOutside)
  },

  unbind (el) {
    document.removeEventListener('click', el.__cus_evnt_clickOutside)
    el.__cus_evnt_clickOutside = null
  }
}

Vue.directive('click-outside', clickOutside)


/* 
** Show Ripple Effect onclick
** @ click event on element, show ripple effect if v-ripple is true
** required css class: .ripple-container .ripple
*/

const ripple = {
  bind (el, binding, vnode) {
    let $rippleContainer = document.createElement('div')

    el.$rippleContainer = $rippleContainer
    el.style.position = 'relative'
    el.appendChild($rippleContainer)
    $rippleContainer.classList.add('ripple-container')

    el.__cus_evnt_addRipple = (event) => {
      // clear delayed process
      if (el.timeoutID) {
        clearTimeout(el.timeoutID)
      }

      if ( typeof binding.value === 'object' && binding.value.color ) {
        createRipple(event, el, $rippleContainer, binding.value.color)
        // setTimeout(() => createRipple(event, el, $rippleContainer, binding.value.color), 140)
      }

      function createRipple (event, el, $parent, color) {
        let $ripple = document.createElement('span')
          
        // set inline style
        let width = el.offsetWidth,
            height = el.offsetHeight,
            top = event.pageY - el.getBoundingClientRect().top - height/2,
            left = event.pageX - el.getBoundingClientRect().left - width/2,
            style = `top: ${top}px; left: ${left}px; width: ${width}px; height: ${height}px;`
  
        // add the color
        style += `background-color: ${color}`
        // fire up
        $parent.appendChild($ripple)
        $ripple.classList.add('ripple')
        $ripple.setAttribute('style', style)
      }
    }

    el.__cus_evnt_cleanRipple = (event) => {
      if ( event.target === el || el.contains(event.target) ) {
        
          // ripple effect duration is 2000
          el.timeoutID = setTimeout(() => {
            while ($rippleContainer.firstElementChild) {
              $rippleContainer.removeChild($rippleContainer.firstElementChild)
            }
          }, 2000)
      }
    }

    el.addEventListener('mousedown', el.__cus_evnt_addRipple)
    el.addEventListener('mouseup', el.__cus_evnt_cleanRipple)
  },

  unbind (el) {
    el.removeEventListener('mousedown', el.__cus_evnt_addRipple)
    el.removeEventListener('mouseup', el.__cus_evnt_cleanRipple)

    el.__cus_evnt_addRipple = null
    el.__cus_evnt_cleanRipple = null

    el.style.position = null
    el.removeChild(el.$rippleContainer)
  }
}

Vue.directive('ripple', ripple)


/* 
** Apply box shadow
*/

const addShadow = {
  bind (el, binding, vnode) {
    if (typeof binding.value === 'boolean' && binding.value) {
      let $shadow = el.$shadow = document.createElement('div'),
          parentStyle = `position: relative; z-index: 1`

      el.setAttribute('style', parentStyle)
      el.appendChild($shadow)
      $shadow.classList.add('shadow')
    }
  },

  unbind (el) {
    if (el.$shadow) {
      el.style = null
      el.removeChild(el.$shadow)
    }
  }
}

Vue.directive('shadow', addShadow)