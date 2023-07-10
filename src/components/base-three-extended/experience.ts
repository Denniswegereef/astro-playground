import { engine } from "@/components/base-three-extended/engine";
import { Cube } from "@/components/base-three-extended/world/cube";

export class Experience {
  constructor() {
    // Create experience
    this._createWorld();

    // Start rendering
    engine.render();
  }

  _createWorld() {
    const cube = new Cube();

    cube.setModel();
  }
}
