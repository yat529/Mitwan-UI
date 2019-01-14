const drawLine = function ($canvas, canvasOption) {

  if (!$canvas || !$canvas.nodeType) {
    return
  }

  const options = canvasOption || {
    width: window.innerWidth,
    height: window.innerHeight,
    color: 'rgba(0,0,0,0.5)',
    onEnter: null
  }

  let lines = [],
      ctx = canvas.getContext('2d')

  // higg dpi screen resolution fix
  let dratio = window.devicePixelRatio
  $canvas.width = options.width * dratio
  $canvas.height = options.height * dratio
  $canvas.style.width = options.width + 'px'
  $canvas.style.height = options.height + 'px'

  /* 
  ** Line Object Constructor
  */
  function Line (startx, starty) {
    this.i = 1
    this.drop = !! Math.round( Math.random() )
    this.startx = startx || Math.floor( Math.random() * $canvas.width )
    this.endx = this.startx + Math.floor( this.i * Math.random() * ($canvas.width - this.startx) )
    this.starty = this.drop ? 0 : $canvas.height
    this.endy = this.drop ? $canvas.height : 0
    this.x = this.startx
    this.y = this.starty
    this.easing = 0.005
    this.entered = false
    this.color = options.color

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
    ctx.moveTo(this.x, this.starty)
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
    let sign = this.drop ? 1 : -1
    this.y = this.y + sign * Math.abs(this.endy - this.y) * this.easing * 5
    return this
  }

  Line.prototype.draw = function () {
    let sign = this.drop ? 1 : -1

    if (!this.entered) {
      if ( Math.abs(this.endy - this.y) < 5 ) {
        this.y = this.y + sign * 10
        this.entered = true

        if (options.onEnter && typeof options.onEnter === 'function') {
          console.log('run cb')
          options.onEnter()
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
      lines.push( new Line(startx).update() )
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