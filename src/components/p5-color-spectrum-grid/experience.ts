import p5 from "p5"
import * as dat from "dat.gui"

const gui = new dat.GUI()

let stepX = 50
let stepY = 50
let startTime = 0

const distort = { x: 0, y: 0 }

const sketch = (p: p5) => {
  let canvas: p5.Renderer

  p.setup = () => {
    canvas = p.createCanvas(p.windowWidth, p.windowHeight, "p2d")
    styleCanvas()
    p.frameRate(120)

    console.log(p.width, p.height)

    p.colorMode(p.HSB, p.width, p.height, 100)

    startTime = p.millis()

    gui.add(distort, "x", 0, 100)
    gui.add(distort, "y", 0, 100)

    // xDistort = gui.add({ x: 0 }, "x", 0, 250)
    // yDistort = gui.add({ y: 0 }, "y", 0, 250)

    p.noStroke()
  }

  p.preload = () => {
    // p.loadImage()
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
    styleCanvas()
  }

  const styleCanvas = () => {
    canvas.elt.style.width = "100%"
    canvas.elt.style.height = "100%"
  }

  p.draw = () => {
    stepX = p.mouseX + 1
    stepY = p.mouseY + 1

    for (let gridY = 0; gridY < p.height; gridY += stepY) {
      for (let gridX = 0; gridX < p.width; gridX += stepX) {
        p.fill(gridX, p.height - gridY, 100)
        p.rect(gridX, gridY, stepX - distort.x, stepY - distort.y)
      }
    }
  }
}

new p5(sketch)
