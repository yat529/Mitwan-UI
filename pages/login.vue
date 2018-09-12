<template>
  <div>
    <mt-navbar
      :showMenuToggle="false"
      barFontColor="black"
      barBackground="rgba(255, 255, 255, 0.1)"/>

    <mt-dual-panel :centerContent="true" :backgroundURL="backgroundURL"/>
  </div>
</template>

<script>
export default {
  computed: {
    backgroundURL () {
      // return 'https://static.zhihu.com/heifetz/sign_bg.db29b0fbd2f78dd8c1b7.png'
      return ''
    }
  }
}
</script>

