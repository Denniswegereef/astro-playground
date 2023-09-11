import * as THREE from "three"
import { engine } from "../../engine"
import fragmentShader from "./_fragment.glsl"
import vertexShader from "./_vertex.glsl"

import gsap from "gsap"

export class FloorModel {
  mesh: THREE.Mesh | null = null
  uniforms: Uniforms

  constructor() {
    this.uniforms = {
      uTime: { value: 0 },
      uIntroProgress: { value: 0 },
    }

    this._createMesh()
  }

  _createMesh() {
    const geometry = new THREE.PlaneGeometry(50, 10)
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
}
