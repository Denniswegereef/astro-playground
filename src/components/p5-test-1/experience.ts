import p5 from "p5"
import * as dat from "dat.gui"

const gui = new dat.GUI()

let startTime = 0
let guiOptions = {
  noiseLevel: 255,
  noiseScale: 0.005,
  threshold: 0.5,
  color: 0,
  dotSize: 5,
  timeMultiplier: 0.2,
}

const sketch = (p: p5) => {
  let canvas: p5.Renderer

  let controller: dat.GUIController

  p.setup = () => {
    canvas = p.createCanvas(p.windowWidth, p.windowHeight, "p2d")
    styleCanvas()
    p.frameRate(120)
    p.colorMode(p.RGB, 1)

    // controller = gui.add(guiOptions, "noiseLevel", 0, 255)
    controller = gui.add(guiOptions, "noiseScale", 0, 0.1).step(0.0001)
    controller = gui.add(guiOptions, "color", 0, 1).step(0.0001)
    controller = gui.add(guiOptions, "dotSize", 5, 25).step(0.0001)
    controller = gui.add(guiOptions, "threshold", 0, 1).step(0.0001)
    controller = gui.add(guiOptions, "timeMultiplier", 0, 10).step(0.0001)

    startTime = p.millis()
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
    p.clear()

    p.background(0)
    let elapsedTime = (p.millis() - startTime) / 1000

    let noiseScale = guiOptions.noiseScale

    for (let y = 0; y < p.height; y += guiOptions.dotSize) {
      for (let x = 0; x < p.width; x += guiOptions.dotSize) {
        const noise = p.noise(
          x * noiseScale,
          y * noiseScale,
          elapsedTime * guiOptions.timeMultiplier
        )
        // x
        if (noise < guiOptions.threshold) continue

        p.strokeWeight(guiOptions.dotSize)
        // p.stroke(x / p.windowWidth, guiOptions.color, y / p.windowHeight)
        p.stroke(
          noise,
          p.cos(guiOptions.color) * (x / p.windowWidth) * (y / p.windowHeight),
          guiOptions.color
        )
        p.point(x, y)
      }
    }
  }
}

new p5(sketch)
