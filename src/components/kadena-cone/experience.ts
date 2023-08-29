import "@/utilities/events"
// Start up the engine
import "@/components/kadena-cone/engine"

import { engine } from "@/components/kadena-cone/engine"
import { Sphere } from "./world/sphere"

export class Experience {
  constructor() {
    // Create experience
    this._createWorld()

    // Start rendering
    engine.render()
  }

  _createWorld() {
    const cone = new Sphere()

    cone.setModel()
  }
}
