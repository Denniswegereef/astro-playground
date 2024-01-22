// canvasHelpers.ts
import p5 from "p5"

export const setFullScreen = (p: p5, canvas: p5.Renderer) => {
  p.resizeCanvas(p.windowWidth, p.windowHeight)
  canvas.elt.style.width = "100%"
  canvas.elt.style.height = "100%"
}

export const setFixedSize = (p: p5, canvas: p5.Renderer, size: number) => {
  p.resizeCanvas(size, size)
  canvas.elt.style.width = `${size}px`
  canvas.elt.style.height = `${size}px`
}
