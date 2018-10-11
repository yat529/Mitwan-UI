const drawLine = function ($canvas, canvasOption) {

  let lines = [],
      ctx = canvas.getContext('2d')

  // higg dpi screen resolution fix
  let dratio = window.devicePixelRatio
  $canvas.width = canvasOption.width * dratio
  $canvas.height = canvasOption.height * dratio
  $canvas.style.width = canvasOption.width + 'px'
  $canvas.style.height = canvasOption.height + 'px'

  /* 
  ** Line Object Constructor
  */
  function Line (startx, starty) {
    this.i = 1
    this.startx = startx || Math.floor( Math.random() * $canvas.width )
    this.endx = this.startx + Math.floor( this.i * Math.random() * ($canvas.width - this.startx) )
    this.starty = starty || 0
    this.endy = $canvas.height + 20
    this.x = this.startx
    this.y = this.starty
    this.easing = 0.005
    this.entered = false
    this.color = canvasOption.color || "rgba(0,0,0,0.5)"

    this.randomDirection().updateEndpoints()
    return this
  }

  Line.prototype.updateEndpoints = function () {
    this.startx = this.x
    this.endx = this.startx + Math.floor( this.i * Math.random() * Math.abs(this.endx - this.startx) )
    return this
  }

  Line.prototype.randomDirection = function () {
    this.i = Math.random() > 0.5 ? 1 : -1

    if (this.i > 0) {
      this.endx = $canvas.width
    } else {
      this.endx = 0
    }

    return this
  }

  Line.prototype.update = function () {
    ctx.beginPath();
    ctx.moveTo(this.x, 0)
    ctx.lineTo(this.x, this.y)
    ctx.strokeStyle = this.color
    ctx.stroke()
    return this
  }

  Line.prototype.move = function () {
    this.x += Math.abs(this.endx - this.x) * this.easing * this.i
    return this
  }

  Line.prototype.enter = function () {
    this.y += Math.abs(this.endy - this.y) * this.easing * 5
    return this
  }

  Line.prototype.draw = function () {

    if (!this.entered) {
      if ( Math.abs(this.endy - this.y) < 20 ) {
        this.entered = true

        if (canvasOption.onEnter && typeof canvasOption.onEnter === 'function') {
          console.log('run cb')
          canvasOption.onEnter()
        }
      }

      this.enter().update()
    } else {
      if ( Math.abs(this.endx - this.x) < 15 ) {
        
        if ($canvas.width - this.endx < 5) {
          this.i = -1
          this.endx = 0
          this.updateEndpoints()
        } else if (this.endx - 0 < 5) {
          this.i = 1
          this.endx = $canvas.width
          this.updateEndpoints()
        } else {
          this.randomDirection().updateEndpoints()
        }
      }

      this.move().update()
    }

    return this
  }

  /* 
  ** Main functions
  */
  function drawLines () {
    for (let i = 0; i < canvasOption.lines; i++) {
      let startx = Math.floor((i + 1) * canvas.width / canvasOption.lines)
      lines.push( new Line(startx, 0).update() )
    }
  }

  function animateLines () {
    ctx.clearRect(0, 0, $canvas.width, $canvas.height)

    lines.forEach(line => {
      line.draw()
    })

    requestAnimationFrame(animateLines)
  }

  // Do it!
  drawLines()
  requestAnimationFrame(animateLines)
}

module.exports = drawLine