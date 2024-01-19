import p5 from "p5"
import * as dat from "dat.gui"

const gui = new dat.GUI()

let segmentCount = 6

const segments = { amount: segmentCount }

const sketch = (p: p5) => {
  let canvas: p5.Renderer

  let segmentController: dat.GUIController

  p.setup = () => {
    canvas = p.createCanvas(p.windowWidth, p.windowHeight, "p2d")
    styleCanvas()
    p.frameRate(120)

    segmentController = gui.add(segments, "amount", 1, 360, 1)
    segmentController

    p.noStroke()
  }

  p.preload = () => {
    // p.loadImage()
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
    styleCanvas()
  }

  p.keyPressed = () => {
    switch (p.key) {
      case "1":
        segmentController.setValue(360)
        break
      case "2":
        segmentController.setValue(45)
        break
      case "3":
        segmentController.setValue(24)
        break
      case "4":
        segmentController.setValue(12)
        break
      case "5":
        segmentController.setValue(6)
        break
    }
  }

  const styleCanvas = () => {
    canvas.elt.style.width = "100%"
    canvas.elt.style.height = "100%"
  }

  p.draw = () => {
    p.colorMode(p.HSB, 360, p.width, p.height)

    p.background(360, 0, p.height)

    const angleStep = 360 / segments.amount

    p.beginShape(p.TRIANGLE_FAN)

    p.vertex(p.width / 2, p.height / 2)

    for (let angle = 0; angle <= 360; angle += angleStep) {
      const vx = p.width / 2 + p.cos(p.radians(angle)) * p.width
      const vy = p.height / 2 + p.sin(p.radians(angle)) * p.height

      p.vertex(vx, vy)

      p.fill(angle, p.width, p.height)
    }

    p.endShape()
  }
}

new p5(sketch)
