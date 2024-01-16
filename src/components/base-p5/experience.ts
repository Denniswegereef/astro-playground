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
    canvas.elt.style.width = "  100%"
    canvas.elt.style.height = "100%"
  }

  p.draw = () => {
    const speed = p.dist(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY)

    p.fill("red")
    p.strokeWeight(0)
    p.ellipse(p.mouseX, p.mouseY, speed, speed)

    speedController.setValue(speed)
  }
}

new p5(sketch)
