export class FitTextThree {
  element: HTMLElement;
  compressor: number;
  options: { minFontSize: number; maxFontSize: number };

  constructor(
    el: HTMLElement,
    kompressor: number = 1,
    options: { minFontSize?: number; maxFontSize?: number } = {}
  ) {
    this.element = el;
    this.compressor = 1;
    this.options = {
      minFontSize: -1 / 0,
      maxFontSize: 1 / 0,
      ...options,
    };

    console.log("this");

    this._init();
  }

  _init() {
    this._fit();
  }

  _fit() {
    const containerWidth =
      this.element.parentElement?.getBoundingClientRect().width || 0;
    const textWidth = this.element.getBoundingClientRect().width;
    const baseFontSize = parseFloat(
      window.getComputedStyle(this.element).fontSize
    );
    const scalingFactor = (textWidth / containerWidth) * 100;

    console.log({ containerWidth, textWidth, baseFontSize, scalingFactor });

    console.log("scale by" + baseFontSize * scalingFactor * 2);

    this.element.style.fontSize = `${baseFontSize * scalingFactor * 2.3}px`;

    const resizer = () => {
      // this.element.style.fontSize =
      //   Math.max(
      //     Math.min(
      //       this.element.parentElement?.getBoundingClientRect().width ||
      //         0 / (this.compressor * 10),
      //       parseFloat(this.options.maxFontSize.toString())
      //     ),
      //     parseFloat(this.options.minFontSize.toString())
      //   ) + "px";
    };

    // Call once to set.
    resizer();

    // Bind events
    window.addEventListener("resize", resizer);
    window.addEventListener("orientationchange", resizer);
  }
}
