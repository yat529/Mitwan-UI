<template>
  <div class="mt-layout-abs cover-screen">
    <div class="mt-layout-abs cover-screen mt-layout-row row-center">
      <div class="text--caption mt-layout-row row-center subtitle text--pureblack" v-if="subtitle">
        <div id="subtitle" class="text--grey"></div>
      </div>
      <div class="title text--pureblack transition element-to-enter" v-html="titleHTML" ref="title"></div>

      <div class="initial-overlay mt-layout-abs cover-screen mt-layout-row row-center" v-if="!disableInitials"
        :class="showInitScreen ? 'bg--pureblack' : ''"
        @click="translateInitials">

        <div class="title" :class="showInitScreen ? 'text--white' : 'text--pureblack'" v-html="initialHTML" ref="initials"></div>
      </div>
    </div>

    <transition name="fade">
    <div class="mt-layout-row row-end" v-if="disableInitials" style="padding-right: 8px;">
      <slot class="mt-layout-abs" name="tl-corner"></slot>
      <slot class="mt-layout-abs" name="tr-corner"></slot>
    </div>
    </transition>
  </div>
</template>

<script>
import typing from '~/assets/custom_modules/typing.js'

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
      showInitScreen: true,
      disableInitials: false,
      transitionLength: 1500,
    }
  },

  computed: {
    /* 
    ** Title HTML
    */
    titleHTML () {
      if (this.title) {
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

    /* 
    ** Array of title span
    */
    titleSpans () {
      if (this.$refs.title) {
        let arry = []
        for ( let $titleSpan of this.$refs.title.querySelectorAll('.title-initial') ) {
          arry.push($titleSpan)
        }
        return arry
      }
    },

    /* 
    ** Array of span.title-initial
    */
    initialSpans () {
      if (this.$refs.initials) {
        let arry = []
        for ( let $initialSpan of this.$refs.initials.querySelectorAll('.title-initial') ) {
          arry.push($initialSpan)
        }
        return arry
      }
    },

    /* 
    ** Array of title initials, Capitalized
    */
    titleInitialList () {
      if (this.title) {
        let titleChars = this.title.split(' '),
            array = []
        titleChars.forEach(word => {
          let initial = word.slice(0, 1).toUpperCase()
          array.push(initial)
        })
        return array
      }
    },

    /* 
    ** Initial HTML
    */
    initialHTML () {
      if (this.titleInitialList) {
        let html = ''
        this.titleInitialList.forEach(initial => {
          html += `<span class="title-initial">${ initial }</span>`
        })
        return html
      }
    },

    /* 
    ** Initial Translation Destination Coordinates
    */
    initialTranslateCoord () {
      if (this.titleSpans && this.initialSpans) {
        let distArray = []

        this.titleSpans.forEach(($title, index) => {
          distArray.push({
            x: $title.getBoundingClientRect().left - this.initialSpans[index].getBoundingClientRect().left,
            y: $title.getBoundingClientRect().top - this.initialSpans[index].getBoundingClientRect().top + 25
          })
        })

        return distArray
      }
    }
  },

  methods: {
    translateInitials () {
      this.initialSpans.forEach(($initialSpan, index) => {
        $initialSpan.classList.add('transition')
        this.$nextTick(() => {
          $initialSpan.style.transform = `translate(${ this.initialTranslateCoord[index].x }px, ${ this.initialTranslateCoord[index].y }px)`
        })
      })

      this.showInitScreen = false
      this.enter()

      // Disable Initial DOM Element when transition ends
      setTimeout(() => {
        this.disableInitials = true
        this.revealInitial()
        this.typeSubtitle()
        this.$emit('introEnd', true)
      }, this.transitionLength)
    },

    revealInitial () {
      this.titleSpans.forEach($title => {
        if ( $title.classList.contains('hide-initial') ) {
          $title.classList.remove('hide-initial')
        }
      })
    },

    typeSubtitle () {
      let charList = this.subtitle.split(''),
          mp = Math.floor( 2*(charList.length -1)/3 ),
          part1 = charList.slice(0, mp).join(''),
          part2 = charList.slice(mp).join('')

      typing('subtitle', 40)
      .type(part1, {
        fontWeight: "400", 
        color: "#b4b4b4",
      })
      .lineBreak()
      .type(part2, {
        fontWeight: "400", 
        color: "#b4b4b4",
      })
    },

    enter () {
      let $title = this.$refs.title
      $title.classList.remove('before-enter')
    }
  },

  mounted () {
    let $title = this.$refs.title
    $title.classList.add('before-enter')
  }
}
</script>


<style lang="scss">
.initial-overlay {
  transition: background-color 0.6s ease-in-out;
}

.tl-corner {
  top: 0px;
  left: 0px;
}

.tr-corner {
  top: 0px;
  right: 0px;
}

.title,
.title-initial,
.initial-copy {
  font-family: 'Oswald', sans-serif;
  font-size: 110px;
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

.element-to-enter {
  // opacity: 1;

  &.before-enter {
    transform: translateY(-25px);
    opacity: 0;
  }
}

.subtitle {
  position: absolute;
  top: 39%;
  left: 50%;
  width: 1200px;
  transform: translate(-50%, -90%);
  font-family: 'Oswald', sans-serif;
  font-size: 20px !important;
  font-weight: bold;
  text-align: center;
}


/* 
** Typing js css
*/
#subtitle .line,
#subtitle span {
    height: 25px;
    line-height: 25px;
    vertical-align: middle;
}

#subtitle span {
    display: inline-block;
    position: relative;
    color: #b4b4b4;
}

#subtitle span.head {
    margin-left: 4px;
}

#subtitle span.space {
    margin-right: 4px;
}

#subtitle span.current::after {
    content: "";
    position: absolute;
    display: inline-block;
    height: 25px;
    top: 50%;
    right: -6px;
    transform: translateY(-50%);
    border-left: 3px solid #000;
    animation: blink-caret 0.9s step-end infinite;
}

#subtitle span.current.space::after {
    right: -6px;
}

/* Optional */
#subtitle span.past {
    color: gray;
}

@keyframes blink-caret {
    0% { border-color: #000 }
    50% { border-color: transparent }
    100% { border-color: #000 }
}
</style>

