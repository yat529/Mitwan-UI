<template>
<div class="viewport">
  <div id="parnetCtn">
    <div class="panel mt-layout-row row-center" :class="assgignBgClass(index)" v-for="(panel, index) in 5" :key="index">
      <h1>Page {{ index + 1 }}</h1>
    </div>
  </div>
</div>
  
</template>

<script>
export default {
  methods: {
    assgignBgClass (index) {
      let className
      switch (index) {
        case 0:
          className = 'bg--primary text--white'
          break
        case 1:
          className = 'bg--success text--white'
          break
        case 2:
          className = 'bg--warning'
          break
        case 3:
          className = 'bg--error text--white'
          break
        case 4:
          className = 'bg--pureblack text--white'
          break
      }
      return className
    }
  },

  mounted () {
    let $ctn = document.querySelector('#parnetCtn')

    // Cache scroll destination point
    let scrollTo = []
    for (let $child of $ctn.children) {
      scrollTo.push($child.offsetTop)
    }

    let scrolledIndex = 0,
        wheeled = true,
        scrollDown

    $ctn.addEventListener('wheel', e => {

      if (wheeled && Math.abs(e.deltaY) > 100) {
        wheeled = false

        // check direction
        scrollDown = Math.sign(e.deltaY) > 0
        
        // animate scroll
        if (scrollDown) {
          scrolledIndex ++        
        } else {
          scrolledIndex -- 
        }

        // prevent scroll
        if (scrolledIndex > scrollTo.length - 1) {
          scrolledIndex = scrollTo.length - 1
        } else if (scrolledIndex < 0) {
          scrolledIndex = 0
        }

        $ctn.style = `transform: translateY(${ -scrollTo[ scrolledIndex ] }px);`

        // deboucer
        let timeout = setTimeout(waitTransitionEnd, 1500)
        
        /* 
        ** Helper functions
        */
        function waitTransitionEnd () {
          clearTimeout(timeout)
          wheeled = true
        }
      }
    });

    

    // $ctn.addEventListener('transitionend', console.log('transition ends'))
  }
}
</script>


<style lang="scss">
.viewport {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

#parnetCtn {
  position: absolute;
  top: 0;
  left: 0;
  transition: transform 1.2s cubic-bezier(0, 0, 0, 1.01);
  will-change: transform;
}

.panel {
  // position: absolute;
  width: 100vw;
  height: 100vh;
}

h1 {
  font-family: 'Oswald', sans-serif;
  font-size: 36px !important;
  font-weight: bold;
}
</style>

