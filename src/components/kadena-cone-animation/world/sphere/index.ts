import * as THREE from "three"
import { engine } from "../../engine"
import { GUI } from "dat.gui"
import fragmentShader from "./shaders/fragment.glsl"
import vertexShader from "./shaders/vertex.glsl"

export class Sphere {
  geometry: THREE.IcosahedronGeometry
  shaderMaterial: THREE.ShaderMaterial
  mesh: THREE.Mesh
  cones: THREE.Mesh[]
  gui: GUI
  uniforms: { [uniform: string]: THREE.IUniform }
  loader: THREE.TextureLoader
  material: THREE.MeshMatcapMaterial

  constructor() {
    this.gui = new GUI()
    this.geometry = new THREE.IcosahedronGeometry(0.4, 1)
    this.loader = new THREE.TextureLoader()
    this.material = new THREE.MeshMatcapMaterial()

    this.cones = []

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

    this.mesh = new THREE.Mesh(this.geometry, this.material)

    // Position cones along normals and make them point away from the center
    const positionArray = Array.from(
      this.mesh.geometry.attributes.position.array
    )

    const ConeGeometry = new THREE.ConeGeometry(1, 1, 10)

    const center = new THREE.Vector3(0, 0, 0) // Replace with the actual center coordinates if needed

    for (let index = 0; index < positionArray.length; index += 3) {
      const x = positionArray[index]
      const y = positionArray[index + 1]
      const z = positionArray[index + 2]

      const cone = new THREE.Mesh(ConeGeometry, this.material)
      cone.position.set(x, y, z)

      cone.lookAt(center)
      cone.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI * -0.5)

      // coneGeometry.translate(0, coneHeight / 2, 0) // three.js r.72

      this.cones.push(cone)
    }

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
    this.cones.forEach((cone) => {
      if (!engine.scene) return

      cone.scale.set(0.2, 0.2, 0.2)
      // cone.lookAt(0, 0, 0)

      engine.scene.add(cone)
    })
  }

  _addGui() {
    const cubeFolder = this.gui.addFolder("Mesh")
    cubeFolder
      .add(this.uniforms.uProgress, "value", 0)
      .min(0)
      .max(1)
      .name("Progress")
      .onChange((value) => {
        this.mesh.scale.set(1 + value, 1 + value, 1 + value)
        this.cones.forEach((cone) => {
          cone.scale.set(
            0.2 - value * 0.2,
            0.2 - value * 0.2,
            0.2 - value * 0.2
          )
        })
      })

    cubeFolder.open()
  }
}
