import p5, { Color } from "p5"
import * as dat from "dat.gui"
import { setFixedSize, setFullScreen } from "@/helpers/p5-helpers"

const gui = new dat.GUI()

let startTime = 0

const colorsLeft: Color[] = []
const colorsRight: Color[] = []

// Default
let guiOptions = {
  fullScreen: false,
  fixedSize: 500,
}

const sketch = (p: p5) => {
  let canvas: p5.Renderer

  let controller: dat.GUIController

  p.setup = () => {
    canvas = p.createCanvas(p.windowWidth, p.windowHeight, "p2d")
    styleCanvas()
    p.frameRate(120)

    p.colorMode(p.HSB)
    p.noStroke()
    shakeColors(p)

    gui.add(guiOptions, "fullScreen").name("Full Screen").onChange(styleCanvas)
    gui
      .add(guiOptions, "fixedSize", 100, 1000, 10)
      .name("Fixed Size")
      .onChange(styleCanvas)

    startTime = p.millis()
  }

  p.windowResized = () => {
    styleCanvas()
  }

  const styleCanvas = () => {
    if (guiOptions.fullScreen) {
      setFullScreen(p, canvas)
    } else {
      setFixedSize(p, canvas, guiOptions.fixedSize)
    }
  }

  p.draw = () => {
    p.clear()
    p.background(255, 0, 0)

    let tileCountX = p.int(p.map(p.mouseX, 0, p.width, 2, 100))
    let tileCountY = p.int(p.map(p.mouseY, 0, p.height, 2, 100))

    const tileWidth = p.width / tileCountX
    const tileHeight = p.height / tileCountY

    let interCol: p5.Color

    for (let gridY = 0; gridY < tileCountY; gridY += 1) {
      const col1 = colorsLeft[gridY]
      const col2 = colorsRight[gridY]

      for (let gridX = 0; gridX < tileCountX; gridX += 1) {
        const amount = p.map(gridX, 0, tileCountX, 0, 1)

        interCol = p.lerpColor(col1, col2, amount)

        p.fill(interCol)

        const posX = tileWidth * gridX
        const posY = tileHeight * gridY

        p.rect(posX, posY, tileWidth, tileHeight)
      }
    }
  }
}

const shakeColors = (p: p5) => {
  // Since the tile count could never be more than 100, we can just hardcode that
  // and avoid the need to check for the length of the array
  for (let i = 0; i < 100; i++) {
    colorsLeft[i] = p.color(p.random(0, 10), p.random(0, 100), 100)
    colorsRight[i] = p.color(p.random(40, 60), 100, p.random(100, 100))
  }
}

new p5(sketch)
