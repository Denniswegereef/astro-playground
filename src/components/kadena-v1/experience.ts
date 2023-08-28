import "@/utilities/events"
// Start up the engine
import "@/components/kadena-v1/engine"

import { engine } from "@/components/kadena-v1/engine"
import { Sphere } from "@/components/kadena-v1/world/sphere/sphere"
import { Cubes } from "@/components/kadena-v1/world/cubes"

export class Experience {
  constructor() {
    // Create experience
    this._createWorld()

    // Start rendering
    engine.render()
  }

  _createWorld() {
    // const cube = new Cube();
    // const sphere = new Sphere()
    const cubes = new Cubes()

    cubes.setModel()
  }
}
