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
    const cube = new CubeModel()

    cube.setModel()
  }
}

export default new Experience()
