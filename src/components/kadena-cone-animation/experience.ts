import "@/utilities/events"
// Start up the engine
import "@/components/kadena-cone-animation/engine"

import { engine } from "@/components/kadena-cone-animation/engine"
import { Sphere } from "./world/sphere"
import { Cone } from "./world/cone"

export class Experience {
  constructor() {
    // Create experience
    this._createWorld()

    // Start rendering
    engine.render()
  }

  _createWorld() {
    const cone = new Cone()

    cone.setModel()
  }
}
