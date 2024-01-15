const JS_HOOK_DATA_TRACK = "[js-hook-data-track]"

export class ScrollGroup {
  constructor() {
    const scrollElements = Array.from(
      document.querySelectorAll(JS_HOOK_DATA_TRACK)
    )

    console.log(scrollElements)

    this._init()
  }

  _init() {
    console.log("test")
  }
}
