import "@/utilities/events"
import "./engine"

import { engine } from "./engine"
import { CubeModel } from "./world/cube"
import { ScrollContainer } from "./scroll-container"

class Experience {
  constructor() {
    // Create experience
    this._createWorld()

    // Start rendering
    engine.render()
  }

  _createWorld() {
    new CubeModel()
    new ScrollContainer()
  }
}

export default new Experience()
