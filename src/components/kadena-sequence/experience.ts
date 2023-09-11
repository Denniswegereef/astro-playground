import "@/utilities/events"
import "./engine"

import { engine } from "./engine"
import { CubeModel } from "./world/cube"

class Experience {
  constructor() {
    // Create experience
    this._createWorld()

    // Start rendering
    engine.render()
  }

  _createWorld() {
    new CubeModel()
  }
}

export default new Experience()
