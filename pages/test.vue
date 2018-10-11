<template>
  <mt-viewport-cuscroro>
    <div class="content-wrapper" slot="pageContent">
      <div>
        <div class="full-page mt-layout-row row-center" v-for="(page, index) in 5" :key="index">

          <div v-if="index === 0">
            <mt-inim title="Some Awesome Staff"></mt-inim>
          </div>

          <h1 v-else>Page {{index + 1}}</h1>
        </div>
      </div>

      <mt-canvas bgColor="#ffde1d"></mt-canvas>
    </div>
  </mt-viewport-cuscroro>
</template>


<style lang="scss">
.content-wrapper {
  position: relative;
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
