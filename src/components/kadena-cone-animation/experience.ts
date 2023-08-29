import "@/utilities/events"
// Start up the engine
import "@/components/kadena-cone-animation/engine"

import { engine } from "@/components/kadena-cone-animation/engine"
import { ConeModel } from "./world/cone-model"

export class Experience {
  constructor() {
    // Create experience
    this._createWorld()

    // Start rendering
    engine.render()
  }

  _createWorld() {
    const cone = new ConeModel()

    cone.setModel()
  }
}
