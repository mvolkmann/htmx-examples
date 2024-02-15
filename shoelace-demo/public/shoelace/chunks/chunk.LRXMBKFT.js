import {
  progress_bar_styles_default
} from "./chunk.RFBDALHK.js";
import {
  LocalizeController
} from "./chunk.WLV3FVBR.js";
import {
  ShoelaceElement
} from "./chunk.U5X52PUD.js";
import {
  __decorateClass
} from "./chunk.IFDWM6P4.js";

// src/components/progress-bar/progress-bar.component.ts
import { classMap } from "lit/directives/class-map.js";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
var SlProgressBar = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.localize = new LocalizeController(this);
    this.value = 0;
    this.indeterminate = false;
    this.label = "";
  }
  render() {
    return html`
      <div
        part="base"
        class=${classMap({
      "progress-bar": true,
      "progress-bar--indeterminate": this.indeterminate,
      "progress-bar--rtl": this.localize.dir() === "rtl"
    })}
        role="progressbar"
        title=${ifDefined(this.title)}
        aria-label=${this.label.length > 0 ? this.label : this.localize.term("progress")}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow=${this.indeterminate ? 0 : this.value}
      >
        <div part="indicator" class="progress-bar__indicator" style=${styleMap({ width: `${this.value}%` })}>
          ${!this.indeterminate ? html` <slot part="label" class="progress-bar__label"></slot> ` : ""}
        </div>
      </div>
    `;
  }
};
SlProgressBar.styles = progress_bar_styles_default;
__decorateClass([
  property({ type: Number, reflect: true })
], SlProgressBar.prototype, "value", 2);
__decorateClass([
  property({ type: Boolean, reflect: true })
], SlProgressBar.prototype, "indeterminate", 2);
__decorateClass([
  property()
], SlProgressBar.prototype, "label", 2);

export {
  SlProgressBar
};
