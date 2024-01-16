import p5 from "p5"
import * as dat from "dat.gui"

const gui = new dat.GUI()

const sketch = (p: p5) => {
  let canvas: p5.Renderer

  let speedController: dat.GUIController

  p.setup = () => {
    canvas = p.createCanvas(p.windowWidth, p.windowHeight, "p2d")
    styleCanvas()
    p.frameRate(120)
    p.noCursor()
    p.colorMode(p.HSB, 360, 100, 100)
    p.rectMode(p.CENTER)
    p.noStroke()

    console.log(p.map(50, 0, 100, 0, 40))

    speedController = gui.add({ speed: 0 }, "speed")
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
    const speed = p.dist(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY)

    p.background(p.mouseY / 2, 100, 100)

    p.fill((360 * p.mouseX) / p.width, 100, 100)
    p.rect(p.width / 2, p.height / 2, p.mouseX + 1, p.mouseY + 1)

    speedController.setValue(speed)
  }
}

new p5(sketch)
