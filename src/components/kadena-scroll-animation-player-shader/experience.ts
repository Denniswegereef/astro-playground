import "@/utilities/events"
import "./engine"

import { engine } from "./engine"
import { ConeModel } from "./world/cone-model"

class Experience {
  constructor() {
    // Create experience
    this._createWorld()

    // Start rendering
    engine.render()
  }

  _createWorld() {
    new ConeModel()
  }
}

export default new Experience()
