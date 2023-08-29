import "@/utilities/events"
// Start up the engine
import "@/components/kadena-cube/engine"

import { engine } from "@/components/kadena-cube/engine"
import { Sphere } from "@/components/kadena-cube/world/sphere/sphere"
import { Cubes } from "@/components/kadena-cube/world/cubes"

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
