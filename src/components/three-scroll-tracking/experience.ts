import "@/utilities/events"
import "./engine"

import { engine } from "./engine"
import { CubeModel } from "./world/cube"
import { ScrollGroup } from "./world/scroll-group"

class Experience {
  constructor() {
    // Create experience
    this._createWorld()

    // Start rendering
    engine.render()
  }

  _createWorld() {
    // const cube = new CubeModel()

    // cube.setModel()
    new ScrollGroup()
  }
}

export default new Experience()
