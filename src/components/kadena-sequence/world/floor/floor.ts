import * as THREE from "three"
import { engine } from "../../engine"
import fragmentShader from "./_fragment.glsl"
import vertexShader from "./_vertex.glsl"

import gsap from "gsap"
import { ENABLE_GUI } from "../../settings"

export class FloorModel {
  mesh: THREE.Mesh | null = null
  uniforms: Uniforms

  constructor() {
    this.uniforms = {
      uTime: { value: 0 },
      uIntroProgress: { value: 0 },
      uFloorOpacity: { value: 0.0 },
      uPatternDensity: { value: 5 },
      uFloorWidth: { value: 50 },
      uFloorHeight: { value: 10 },
    }

    this._createMesh()
    if (ENABLE_GUI) this._createControls()
  }

  _createMesh() {
    const geometry = new THREE.PlaneGeometry(
      this.uniforms.uFloorWidth.value,
      this.uniforms.uFloorHeight.value
    )
    const material = new THREE.ShaderMaterial({
      fragmentShader,
      vertexShader,
      uniforms: this.uniforms,
      transparent: true,
    })

    this.mesh = new THREE.Mesh(geometry, material)

    this.mesh.geometry.rotateX(-Math.PI * 0.5)

    this.mesh.position.set(0, -1, 0)

    if (engine.scene) engine.scene.add(this.mesh)

    const timeline = gsap.timeline()

    timeline
      .fromTo(
        this.mesh.rotation,
        {
          y: 0,
        },
        {
          duration: 2.5,
          delay: 0.25,
          y: -Math.PI * 0.05,
        }
      )
      .fromTo(
        this.uniforms.uIntroProgress,
        {
          value: 0,
        },
        {
          value: 1,
          duration: 1.5,
          delay: 0.3,
        },
        0
      )
  }

  _createControls() {
    if (!engine.gui) return

    const guiOptions: GuiOptions = {
      floorOpacity: this.uniforms.uFloorOpacity.value,
      patternDensity: this.uniforms.uPatternDensity.value,
      isVisible: true,
    }

    const guiFolder = engine.gui.addFolder("Floor")

    guiFolder
      .add(guiOptions, "floorOpacity", 0, 0.5)
      .step(0.0001)
      .name("Opacity")
      .onChange((value) => {
        this.uniforms.uFloorOpacity.value = value
      })

    guiFolder
      .add(guiOptions, "patternDensity", 1, 15)
      .step(1)
      .name("Pattern density")
      .onChange((value) => {
        this.uniforms.uPatternDensity.value = value
      })

    guiFolder
      .add(guiOptions, "isVisible")
      .name("Visible")
      .onChange((value) => {
        this.mesh!.visible = value
      })

    guiFolder.open()
  }
}
