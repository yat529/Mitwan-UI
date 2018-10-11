<template>
  <div class="mt-layout-abs cover-screen mt-layout-row row-center">
    <div class="text--caption mt-layout-row row-center subtitle text--pureblack" v-if="subtitle">
      {{ subtitle }}
    </div>
  
    <div id="animated-initial-entry" class="animated-initial-entry-effect mt-layout-abs cover-screen mt-layout-row row-center">
      <div id="animated-initial-content">
        <div class="title text--pureblack" v-html="titleHTML"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },

    subtitle: {
      type: String,
      required: false
    }
  },

  data () {
    return {
      showInitScreen: true
    }
  },

  computed: {
    titleHTML () {
      let titleChars = this.title.split(' '),
          html = ''

      titleChars.forEach(word => {
        let initial = word.slice(0, 1).toUpperCase(),
            remain = word.slice(1) + ' '

        html += `<span class="title-initial hide-initial">${ initial }</span>${ remain }`
      })

      return html
    }
  },

  mounted() {
    
    let $animationWrapper = document.querySelector('#animated-initial-entry')
        $animationWrapper.classList.add('bg--pureblack')

    let $animationContentWrapper = document.querySelector('#animated-initial-content')

    let $titleWrapper = document.querySelector('.title'),
        $initialLetters = document.querySelectorAll('.title-initial')

    // Cache the initial letter copy element
    let initialLetterCopyCache = []

    // Cache the width of the title wrapper
    let wrapperWidth = $titleWrapper.offsetWidth

    // Cache the left position of each initial letter
    let initialPositionLeftCache = []

    // Cache the initial letters' width (the width of each letter is different)
    let initialLetterWidthCache = []

    // Promise array for transitioned state
    let transitionedState = []

    $initialLetters.forEach(($letter, index) => {
      // letter width
      initialLetterWidthCache.push($letter.offsetWidth)
    })

    // MAIN PART - create intial letter coppy and assign translate state
    $initialLetters.forEach(($letter, index) => {
      initialPositionLeftCache.push($letter.offsetLeft)

      // create initial letter copy and cache
      let $initialLettersCopy = document.createElement('div')
      initialLetterCopyCache.push($initialLettersCopy)

      // prepare the copy element
      $initialLettersCopy.innerHTML = $letter.innerHTML
      $initialLettersCopy.classList.add('text--white')
      $initialLettersCopy.classList.add('initial-copy')
      $initialLettersCopy.classList.add('title-initial')

      // letter width
      let letterWidth = $letter.offsetWidth

      // assign translate state according to index
      $initialLettersCopy.style = `transform: translateX(${getTranslateDistance(index, letterWidth, wrapperWidth)}px)`

      // append letter copy to div.animated-initial-content
      $animationContentWrapper.appendChild($initialLettersCopy)
    })

    /* 
    ** Toggle transformation
    */
    window.addEventListener('click', animateInitialLetter)


    /* 
    ** Helper function: Calculate Translate Distance
    */
    function getTranslateDistance(index, letterWidth, wrapperWidth) {
      let letterCount = $initialLetters.length,
          isOdd = letterCount % 2 !== 0,
          midPointDistance = wrapperWidth/2,
          midPointIndex = Math.floor(letterCount/2),
          midPointFix = 0,
          endPointFix = 0,
          margin = 5,
          sign = 1

      if (isOdd) {
        midPointFix = initialLetterWidthCache[midPointIndex]/2
      } else {
        midPointFix = margin/2
      }

      if (index <= midPointIndex) {
        sign = -1
      } else {
        if (isOdd) {
          endPointFix = -letterWidth
        } else {
          endPointFix = -(Math.abs(midPointIndex - index) + 1) * margin
        }
      }

      return sign * (Math.abs(midPointIndex - index) * (letterWidth + margin) + midPointFix) + midPointDistance + endPointFix
    }

    /* 
    ** Helper function: Translate initial letter to location
    */
    function animateInitialLetter () {
      window.removeEventListener('click', animateInitialLetter)

      initialLetterCopyCache.forEach(($letter, index) => {
        $letter.classList.add('transition')
        
        let style = `transform: translateX(${ initialPositionLeftCache[index] }px)`
        $letter.style = style

        // toggle letter copy color classes
        $letter.classList.remove('text--white')
        $letter.classList.add('text--pureblack')

        $letter.addEventListener('transitionend', finishEmUp)

        setTimeout(() => {
          // toggle full screen wrapper bg color classes
          if ($animationWrapper.classList.contains('bg--pureblack')) {
            $animationWrapper.classList.remove('bg--pureblack')
          }
        }, 100)


        /* 
        ** Helper Function
        ** Reveal original initial letter and remove initial letter copy
        */
        function finishEmUp () {
          $letter.removeEventListener('transitionend', finishEmUp)
          // unhide original initial letter
          $initialLetters[index].classList.remove('hide-initial')
          // remove initial letter copy element
          $animationContentWrapper.removeChild($letter)
        }
      })
    }
  }
}
</script>


<style lang="scss">
.animated-initial-entry-effect {
  transition: background-color 0.6s ease-in-out;

  #animated-initial-content,
  .title {
    position: relative;
  }

  .title,
  .title-initial,
  .initial-copy {
    font-family: 'Oswald', sans-serif;
    font-size: 130px;
    font-weight: bold;
  }

  .hide-initial {
    opacity: 0;
  }

  .title-initial {
    display: inline-block;
  }

  .initial-copy {
    position: absolute;
    top: 0;
    left: 0;
    text-align: center;
  }

  .transition {
    transition: all 1.5s cubic-bezier(0, 0, 0, 1.01);
    will-change: transform;
  }
}

.subtitle {
  position: absolute;
  top: 39%;
  left: 50%;
  width: 1200px;
  transform: translate(-50%, -90%);
  font-family: 'Oswald', sans-serif;
  font-size: 18px !important;
  font-weight: bold;
  text-align: center;
}
</style>

