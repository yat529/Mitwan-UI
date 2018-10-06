
const Cuscroro = function (el, option) {

  // DOM Cache
  let $scrollBar = null,
      $scrollBarCtnr = null,
      $scrollBarCtnrParent = null,
      $pageContentCtnr = null

  // Functional Date
  let translateY = 0,
      translatedY = 0,
      factor = 0,
      proportion = 0,
      isDragging = false,
      isHide = false,
      duration = 0,
      hideTimeout = null

  // Event Handlers
  let dragStart, onDrag, dragEnd, hideScrollBar

  // Constructor
  function fn (el, option) {
    // If hide on inactive is enabled
    if (option.hideOnInactive) {
      duration = option.hideOnInactive || 2500
    }

    $scrollBarCtnr = el
    return this
  }

  // Attach prototype methods
  let methods = fn.prototype = {

    /* 
    ** Append $scrollbar to DOM
    */
    init: function () {
      $scrollBarCtnrParent = $scrollBarCtnr.parentElement
      if (!$scrollBarCtnrParent) return

      // Add required CSS classes
      if ( !$scrollBarCtnrParent.classList.contains('slider-viewport') ) {
        $scrollBarCtnrParent.classList.add('slider-viewport')
      }

      if ( !$scrollBarCtnr.classList.contains('slider-container') ) {
        $scrollBarCtnr.classList.add('slider-container')
      }

      
      $scrollBar = document.createElement('div')
      $scrollBar.classList.add('slider')

      $pageContentCtnr = $scrollBarCtnr.querySelector('.doc-content')
      $scrollBarCtnr.insertBefore($scrollBar, $pageContentCtnr)

      return this
    },

    /* 
    ** Update $scrollBar style
    */
    updateStyle: function () {
      // Get and Cache $sliderCntr dimensions
      let containerWidth = $scrollBarCtnr.offsetWidth,
          containerHeight = $scrollBarCtnr.offsetHeight

      let scrollHeight = $pageContentCtnr.scrollHeight,
          scrollBarWidth = $scrollBar.offsetWidth,
          scrollBarHeight = containerHeight * containerHeight/scrollHeight

      factor = (containerHeight - scrollBarHeight)/(scrollHeight - containerHeight)
      proportion = 1 / (Math.abs(1 - 1/factor) + 2)

      console.log(factor, proportion)

      // define the perspective origin to left top with some adjustment
      // 15 is the padding-right, need to take it out to adjust the perspective origin
      $scrollBarCtnr.style = `perspective-origin: ${containerWidth - scrollBarWidth/2 - 15 * (1 - proportion)}px ${containerHeight * proportion}px`

      // define the scrollbar height
      $scrollBar.style.height = `${ scrollBarHeight }px`

      // these two properties actually is top, right
      // since we invert the 4th axis in matrix, we need to manually invert the postioin properties
      // therefore, it becomes bottom, right
      $scrollBar.style.right = `0px`
      // center before transformation
      $scrollBar.style.bottom = `${ containerHeight/2 - scrollBarHeight/2 }px`

      // apply the scrollbar transformation
      $scrollBar.style.transform = `
        matrix3d(
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, -1
        )
        scale(${1/factor})
        translateZ(-2px)
        translateZ(${1 - 1/factor}px)`

      return this
    },

    /* 
    ** Hide scrollbar when inactive
    */
    hideOnInactive: function (duration) {
      hideTimeout = setTimer(duration)

      hideScrollBar = e => {
        if (!isHide) return
        if (hideTimeout) {
          clearTimeout(hideTimeout)
        }

        isHide = false
        $scrollBar.classList.remove('hide')
        
        hideTimeout = setTimer(duration)
      }

      document.addEventListener('wheel', hideScrollBar)

      return this
    },

    /* 
    ** Set click and drag event listener
    */
    enableClickDrag: function () {
      
      // event handlers
      dragStart = e => {
        isDragging = true
        translateY = e.clientY

        $scrollBar.style.pointerEvents = 'none'
        $scrollBar.style.userSelect = 'none'
      }

      onDrag = e => {
        if (!isDragging) return

        if (hideTimeout) {
          clearTimeout(hideTimeout)
        }

        if ($scrollBar.classList.contains('hide')) {
          $scrollBar.classList.remove('hide')
        }
        
        updateTranslateY(e.clientY, translateY)
        translateY = e.clientY
      }

      dragEnd = e => {
        isDragging = false

        $scrollBar.style.pointerEvents = null
        $scrollBar.style.userSelect = null

        hideTimeout = setTimer(duration)
      }

      // assign event listeners
      $scrollBar.addEventListener('mousedown', dragStart)
      document.addEventListener('mousemove', onDrag)
      document.addEventListener('mouseup', dragEnd)

      return this
    },

    // clear all event listeners
    clear: function () {

      $scrollBar.removeEventListener('mousedown', dragStart)
      document.removeEventListener('mousemove', onDrag)
      document.removeEventListener('mouseup', dragEnd)
      document.removeEventListener('wheel', hideScrollBar)

      console.log('cleaning')
      
      return this
    }
  }



  /* 
  ** Helper functions
  */

  function setTimer (duration) {
    setTimeout(() => {
      isHide = true
      $scrollBar.classList.add('hide')
    }, duration || 2500)
  }

  function updateTranslateY (newY, oldY) {
    // drag distance limit
    let limit = $scrollBarCtnr.offsetHeight - $scrollBar.offsetHeight

    translatedY += newY - oldY

    if (translatedY < 0) {
      translatedY = 0
    }
    else if (translatedY > limit) {
      translatedY = limit
    }

    $scrollBar.scrollTop = translatedY * proportion
    $scrollBarCtnr.scrollTop = translatedY / factor
  }



  // add link to method, used senario of new Cuscroro()
  this.prototype = methods

  return new fn(el, option).init().updateStyle().hideOnInactive().enableClickDrag()
}

module.exports = Cuscroro