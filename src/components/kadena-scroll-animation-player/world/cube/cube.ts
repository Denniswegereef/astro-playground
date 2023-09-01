import * as THREE from "three"
import { engine } from "../../engine"
import fragmentShader from "./_fragment.glsl"
import vertexShader from "./_vertex.glsl"
import { GUI } from "dat.gui"
import { ENABLE_GUI } from "../../settings"

export class Cube {
  mesh: THREE.Mesh | null = null
  uniforms: { [uniform: string]: THREE.IUniform }
  gui: GUI
  guiOptions: {
    [key: string]: number
  }

  constructor() {
    this.gui = new GUI()

    // Start options
    this.guiOptions = {
      progress: 0,
    }

    this.uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
    }

    this._createMesh()
    if (ENABLE_GUI) this._setControls()

    engine.addTickHandler((elapsedTime: number) => this._tick(elapsedTime))
  }

  _createMesh() {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.ShaderMaterial({
      fragmentShader,
      vertexShader,
      uniforms: this.uniforms,
    })

    this.mesh = new THREE.Mesh(geometry, material)
  }

  _tick(elapsedTime: number) {
    if (!this.mesh) return

    this.uniforms.uTime.value = elapsedTime

    this.mesh.rotation.x += Math.sin(elapsedTime) * 0.01
    this.mesh.rotation.z += Math.sin(elapsedTime) * 0.01
  }

  _setControls() {
    const cubeFolder = this.gui.addFolder("Mesh")

    cubeFolder
      .add(this.guiOptions, "progress", 0, 1)
      .step(0.0001)
      .name("Progress")
      .onChange((value) => {
        this.uniforms.uProgress.value = value
      })

    cubeFolder.open()
  }

  // Public
  setModel() {
    if (!engine.scene || !this.mesh) return

    // engine.scene.add(this.mesh)
  }
}
