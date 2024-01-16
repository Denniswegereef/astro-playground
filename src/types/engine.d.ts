interface tickHandler {
  elapsedTime: number
  deltaTime: number
}

type Uniforms = { [uniform: string]: THREE.IUniform }
type GuiOptions = { [key: string]: number | string | boolean }
