import "@/utilities/events"
import "./engine"

import { engine } from "./engine"
import { SphereModel } from "./world/sphere"

class Experience {
  constructor() {
    // Create experience
    this._createWorld()

    // Start rendering
    engine.render()
  }

  _createWorld() {
    const sphere = new SphereModel()

    sphere.setModel()
  }
}

export default new Experience()
