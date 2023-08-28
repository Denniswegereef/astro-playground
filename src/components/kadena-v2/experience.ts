import "@/utilities/events"
// Start up the engine
import "@/components/kadena-v2/engine"

import { engine } from "@/components/kadena-v2/engine"
import { Sphere } from "./world/sphere"

export class Experience {
  constructor() {
    // Create experience
    this._createWorld()

    // Start rendering
    engine.render()
  }

  _createWorld() {
    // const cube = new Cube();
    const sphere = new Sphere()
    // const cubes = new Cubes()
    sphere.setModel()
  }
}