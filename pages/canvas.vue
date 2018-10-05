<template>
  <div class="canvas-wrapper mt-layout-row row-center">
    <canvas id="canvas" width="500" height="300"></canvas>
  </div>
</template>

<script>
export default {
  mounted () {
    let canvas = document.querySelector('#canvas'),
        ctx= canvas.getContext('2d')

    console.log(ctx)

    ctx.beginPath();
    ctx.arc(75,75,50,0,Math.PI*2,true); // 绘制
    ctx.lineTo(110,75);
    ctx.arc(75,75,35,0,Math.PI,false);   // 口(顺时针)
    ctx.lineTo(65,65);
    ctx.arc(60,65,5,0,Math.PI*2,true);  // 左眼
    ctx.lineTo(95,65);
    ctx.arc(90,65,5,0,Math.PI*2,true);  // 右眼
    ctx.stroke();
  }
}
</script>


<style lang="scss">
.canvas-wrapper {
  width: 100vw;
  height: 100vh;
}
</style>
