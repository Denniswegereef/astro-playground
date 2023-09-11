import { clamp } from "three/src/math/MathUtils.js"
import { engine } from "./engine"
import Events from "@/utilities/events"
import { EVENT } from "./settings"

// Calculate the scroll progress normalized
export const calculateScrollProgress = () => {
  return clamp(
    window.scrollY / (document.body.offsetHeight - window.innerHeight),
    0,
    1
  )
}

export class ScrollContainer {
  settings: GuiOptions

  constructor() {
    // Initialize settings with current scrollheight
    this.settings = {
      scrollProgress: calculateScrollProgress(),
    }

    this._bindEvents()
    this._createControls()
  }

  _bindEvents() {
    window.addEventListener("scroll", this._handleScroll.bind(this))
  }

  _handleScroll() {
    // Normalize the scroll and clamp between 0 and 1
    const scrollProgress = calculateScrollProgress()

    this.settings.scrollProgress = scrollProgress

    Events.$trigger(EVENT.WORLD_SCROLL, {
      data: {
        scrollProgress: this.settings.scrollProgress,
      },
    })

    if (engine.worldGuiFolder) {
      const controller = engine.worldGuiFolder.__controllers.find(
        (control) => control.property === "scrollProgress"
      )

      if (controller) {
        controller.updateDisplay()
      }
    }
  }

  _createControls() {
    if (!engine.gui) return

    engine.worldGuiFolder
      ?.add(this.settings, "scrollProgress")
      .name("Scroll progress")
      .step(0.0001)
      .listen()
  }
}
