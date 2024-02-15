import {
  qr_code_styles_default
} from "./chunk.4XPIAYA2.js";
import {
  watch
} from "./chunk.2FB5TK5H.js";
import {
  ShoelaceElement
} from "./chunk.U5X52PUD.js";
import {
  __decorateClass
} from "./chunk.IFDWM6P4.js";

// src/components/qr-code/qr-code.component.ts
import { html } from "lit";
import { property, query } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import QrCreator from "qr-creator";
var SlQrCode = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.value = "";
    this.label = "";
    this.size = 128;
    this.fill = "black";
    this.background = "white";
    this.radius = 0;
    this.errorCorrection = "H";
  }
  firstUpdated() {
    this.generate();
  }
  generate() {
    if (!this.hasUpdated) {
      return;
    }
    QrCreator.render(
      {
        text: this.value,
        radius: this.radius,
        ecLevel: this.errorCorrection,
        fill: this.fill,
        background: this.background,
        // We draw the canvas larger and scale its container down to avoid blurring on high-density displays
        size: this.size * 2
      },
      this.canvas
    );
  }
  render() {
    var _a;
    return html`
      <canvas
        part="base"
        class="qr-code"
        role="img"
        aria-label=${((_a = this.label) == null ? void 0 : _a.length) > 0 ? this.label : this.value}
        style=${styleMap({
      width: `${this.size}px`,
      height: `${this.size}px`
    })}
      ></canvas>
    `;
  }
};
SlQrCode.styles = qr_code_styles_default;
__decorateClass([
  query("canvas")
], SlQrCode.prototype, "canvas", 2);
__decorateClass([
  property()
], SlQrCode.prototype, "value", 2);
__decorateClass([
  property()
], SlQrCode.prototype, "label", 2);
__decorateClass([
  property({ type: Number })
], SlQrCode.prototype, "size", 2);
__decorateClass([
  property()
], SlQrCode.prototype, "fill", 2);
__decorateClass([
  property()
], SlQrCode.prototype, "background", 2);
__decorateClass([
  property({ type: Number })
], SlQrCode.prototype, "radius", 2);
__decorateClass([
  property({ attribute: "error-correction" })
], SlQrCode.prototype, "errorCorrection", 2);
__decorateClass([
  watch(["background", "errorCorrection", "fill", "radius", "size", "value"])
], SlQrCode.prototype, "generate", 1);

export {
  SlQrCode
};
