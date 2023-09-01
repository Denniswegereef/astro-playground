import "@/utilities/events"
import "./engine"

import { engine } from "./engine"
import { Cube } from "./world/cube/cube"

class Experience {
  constructor() {
    // Create experience
    this._createWorld()

    // Start rendering
    engine.render()
  }

  _createWorld() {
    const cube = new Cube()

    cube.setModel()
  }
}

export default new Experience()
