import * as THREE from "three"

import fragmentShader from "./_fragment.glsl"
import vertexShader from "./_vertex.glsl"

import { ENABLE_GUI } from "../../settings"
import { engine } from "../../engine"
import Events from "@/utilities/events"

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

    Events.$on("engine::background", (_, data) => console.log(data))
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

    engine.scene.add(this.mesh)

    if (ENABLE_GUI) this._createControls()
  }

  _createControls() {
    if (!engine.gui) return

    const guiOptions: GuiOptions = {
      progress: 0,
    }

    const guiFolder = engine.gui.addFolder("Mesh")

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
