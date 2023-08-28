import * as THREE from "three"
import { engine } from "../../engine"
import { GUI } from "dat.gui"
import fragmentShader from "./shaders/fragment.glsl"
import vertexShader from "./shaders/vertex.glsl"

export class Sphere {
  geometry: THREE.IcosahedronGeometry
  shaderMaterial: THREE.ShaderMaterial
  mesh: THREE.Mesh
  gui: GUI
  uniforms: { [uniform: string]: THREE.IUniform }
  loader: THREE.TextureLoader
  material: THREE.MeshBasicMaterial

  constructor() {
    this.gui = new GUI()
    this.geometry = new THREE.IcosahedronGeometry(1, 10)
    this.loader = new THREE.TextureLoader()
    this.material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
    })

    this.uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      t1: { value: 0 },
      t2: { value: 0 },
    }

    this.shaderMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this.uniforms,
      wireframe: true,
    })

    this.mesh = new THREE.Mesh(this.geometry, this.shaderMaterial)

    this.mesh.position.x = -2

    engine.addTickHandler((elapsedTime: number) => this._tick(elapsedTime))

    this._addGui()
  }

  _tick(elapsedTime: number) {
    this.uniforms.uTime.value = elapsedTime
  }

  // Public
  setModel() {
    if (!engine.scene) return

    engine.scene.add(this.mesh)
  }

  _addGui() {
    const cubeFolder = this.gui.addFolder("Mesh")
    cubeFolder
      .add(this.uniforms.uProgress, "value", 0)
      .min(0)
      .max(1)
      .name("Progress")

    cubeFolder.open()
  }

  parabola(x: number, k: number) {
    return Math.pow(4 * x * (1 - x), k)
  }
}
