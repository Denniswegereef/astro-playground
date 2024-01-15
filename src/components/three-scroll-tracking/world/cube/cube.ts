import * as THREE from "three"

import fragmentShader from "./_fragment.glsl"
import vertexShader from "./_vertex.glsl"

import { GUI } from "dat.gui"
import { ENABLE_GUI } from "../../settings"
import { engine } from "../../engine"

export class CubeModel {
  // Base
  mesh: THREE.Mesh | null = null
  uniforms: Uniforms

  constructor() {
    // Options
    this.uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
    }

    this._createMesh()
    this._bindEvents()

    // Start tick handler
    engine.addTickHandler((args: tickHandler) => this._onTickHandler(args))
  }

  _bindEvents() {
    // Bind events
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

  _onTickHandler({ elapsedTime, deltaTime }: tickHandler) {
    if (!this.mesh) return

    this.uniforms.uTime.value = elapsedTime

    this.mesh.rotation.x += Math.sin(elapsedTime) * 0.01
    this.mesh.rotation.z += Math.sin(elapsedTime) * 0.01
  }

  // Public
  setModel() {
    if (!engine.scene || !this.mesh) return

    console.log("test")

    engine.scene.add(this.mesh)

    if (ENABLE_GUI) this._createControls()
  }

  _createControls() {
    const guiOptions: GuiOptions = {
      progress: 0,
    }

    const gui = new GUI()

    const guiFolder = gui.addFolder("Mesh")

    guiFolder
      .add(guiOptions, "progress", 0, 1)
      .step(0.0001)
      .name("Progress")
      .onChange((value) => {
        this.uniforms.uProgress.value = value
      })

    guiFolder.open()
  }
}
