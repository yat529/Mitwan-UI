<template>
  <mt-viewport-cuscroro :start="introEnd">

    <!-- Scrollable Content -->
    <div class="content-wrapper" slot="pageContent" ref="pageContent">
      
      <!-- Landing Page -->
      <mt-landing class="full-page" 
        :title="title"
        :subtitle="subtitle"
        @introEnd="introEnd = true">
        
        <div class="branding mt-layout-row z-10" slot="tl-corner">
          <h1 class="px-25">LID</h1>
          <div class="mt-layout-column">
            <div>P: 123-456-7890</div>
            <div>E: 123@123.com</div>
          </div>
        </div>

        <div class="navi-toggle mt-layout-column row-center bg--pureblack z-10" slot="tr-corner">
          <span class="bar bg--white"></span>
          <span class="bar bg--white"></span>
          <span class="bar bg--white"></span>
        </div>
      </mt-landing>

      <div class="full-page mt-layout-row row-center section" v-if="introEnd" v-for="(page, index) in pages" :key="index">
        <h1>Page {{index + 1}}</h1>
      </div>
    </div>


    <!-- Fixed Layer -->
    <div class="" slot="fixed-layer">
      <mt-canvas class="mt-layout-abs cover-screen" v-if="introEnd"></mt-canvas>

      <transition name="fade">
      <div class="pagination mt-layout-abs mt-layout-column" v-if="introEnd">
        <div class="index text--grey" v-for="(page, index) in pages" :key="index">
          {{ index + 1}}
        </div>
      </div>
      </transition>
    </div>
    
  </mt-viewport-cuscroro>
</template>

<script>
export default {
  data () {
    return {
      title: 'Lorem Ipsum Dolor',
      subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ac mi at odio blandit efficitur eu quis felis. Sed felis neque, maximus ut dignissim vel',
      pages: 5,

      introEnd: false,
      sectionOffsetTopList: [],
    }
  },

  watcher: {
    introEnd (newVal, oldVal) {
      if (newVal) {
        this.$forceUpdate()
      }
    }
  },

  updated () {
    console.log(this.$refs.pageContent)

    let sections = this.$refs.pageContent.querySelectorAll('.section')

    for (let $section of sections) {
      this.sectionOffsetTopList.push($section.offsetTop)
    }

  }
}
</script>



<style lang="scss">
.content-wrapper {
  position: relative;
}

.hide-overflow {
  overflow: hidden;
}

.branding {
  width: 300px;
  height: 80px;

  h1 {
    line-height: 80px;
  }

  div {
    justify-content: center;
    align-items: flex-start;
  }
}

.navi-toggle {
  width: 80px;
  height: 80px;

  .bar {
    width: 25px;
    height: 3px;
    margin-bottom: 4px;
    transition: transform 0.3s ease-out;

    &:nth-child(2) {
      transform: translateX(-5px);
    }

    &:last-child {
      margin-bottom: 0px;
    }
  }

  &:hover {
    cursor: pointer;

    .bar {
      &:nth-child(2n) {
        transform: translateX(0px);
      }
      &:nth-child(2n + 1) {
        transform: translateX(-5px);
      }
    }
  }
}

.pagination {
  width: 80px;
  top: 50vh;
  left: 0px;
  transform: translateY(-50%);

  .index {
    position: relative;
    width: 100%;
    text-align: center;
    font-family: 'Oswald', sans-serif;
    font-size: 26px !important;
    font-weight: bold;
    transition: all 0.2s ease-out;

    &:hover {
      cursor: pointer;
      color: black;
      transform: scale(1.1);

      &::before {
        content: "";
        position: absolute;
        top: 50%;
        width: 10px;
        height: 2px;
        background: black;
        transform: translateY(-50%);
      }

      &::before {
        left: 0px;
      }
    }

    &.active {
      color: black;

      &::before {
        content: "";
        position: absolute;
        top: 50%;
        width: 10px;
        height: 2px;
        background: black;
        transform: translateY(-50%);
      }

      &::before {
        left: 0px;
      }
    }
  }
}

.full-page {
  position: relative;
  width: 100vw;
  height: 100vh;

  &::after {
    content: '';
    position: absolute;
    left: 0px;
    bottom: 0px;
    width: 100%;
    height: 2px;
    background: black;
  }
}

h1 {
  font-family: 'Oswald', sans-serif;
  font-size: 36px !important;
  font-weight: bold;
}
</style>
