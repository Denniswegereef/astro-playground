import * as THREE from "three"
import { engine } from "../../engine"

export class Cone {
  geometry: THREE.BoxGeometry
  material: THREE.MeshBasicMaterial
  mesh: THREE.Mesh

  constructor() {
    this.geometry = new THREE.BoxGeometry(1, 1, 1)
    this.material = new THREE.MeshBasicMaterial({ color: "red" })

    this.mesh = new THREE.Mesh(this.geometry, this.material)

    engine.addTickHandler((elapsedTime: number) => this._tick(elapsedTime))
  }

  _tick(elapsedTime: number) {
    this.mesh.rotation.x += Math.sin(elapsedTime) * 0.01
    this.mesh.rotation.z += Math.sin(elapsedTime) * 0.01

    if (elapsedTime > 5) {
      engine.pause()
    }
  }

  // Public
  setModel() {
    if (!engine.scene) return

    engine.scene.add(this.mesh)
  }
}
