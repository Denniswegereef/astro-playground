export class FitText {
  element: HTMLElement;
  compressor: number;
  options: { minFontSize: number; maxFontSize: number };

  constructor(
    el: HTMLElement,
    kompressor: number = 1,
    options: { minFontSize?: number; maxFontSize?: number } = {}
  ) {
    this.element = el;
    this.compressor = kompressor;
    this.options = {
      minFontSize: -1 / 0,
      maxFontSize: 1 / 0,
      ...options,
    };

    this._init();
  }

  _init() {
    this._fit();
  }

  _fit() {
    const resizer = () => {
      this.element.style.fontSize =
        Math.max(
          Math.min(
            this.element.clientWidth / (this.compressor * 10),
            parseFloat(this.options.maxFontSize.toString())
          ),
          parseFloat(this.options.minFontSize.toString())
        ) + "px";
    };

    // Call once to set.
    resizer();

    // Bind events
    window.addEventListener("resize", resizer);
    window.addEventListener("orientationchange", resizer);
  }
}
