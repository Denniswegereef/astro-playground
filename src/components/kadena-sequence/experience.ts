import "@/utilities/events"
import "./engine"

import { engine } from "./engine"
import { CubeModel } from "./world/cube"
import { FloorModel } from "./world/floor"
import { ScrollContainer } from "./scroll-container"

class Experience {
  constructor() {
    // Create experience
    this._createWorld()

    // Start rendering
    engine.render()
  }

  _createWorld() {
    new ScrollContainer()
    new FloorModel()
    new CubeModel()
  }
}

export default new Experience()
