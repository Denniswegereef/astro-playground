import * as THREE from "three";
import { engine } from "../engine";

export class Cube {
  geometry: THREE.BoxGeometry;
  material: THREE.MeshBasicMaterial;
  cube: THREE.Mesh;

  constructor() {
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({ color: "red" });

    this.cube = new THREE.Mesh(this.geometry, this.material);

    engine.addTickHandler((elapsedTime: number) => this._tick(elapsedTime));
  }

  _tick(elapsedTime: number) {
    console.log(elapsedTime);
    // const elapsedTime = engine.clock?.getElapsedTime() || 0;

    this.cube.rotation.x += Math.sin(elapsedTime) * 0.01;
    this.cube.rotation.z += Math.sin(elapsedTime) * 0.01;

    if (elapsedTime > 5) {
      engine.pause();
    }
  }

  // Public
  setModel() {
    if (!engine.scene) return;

    engine.scene.add(this.cube);
  }
}
