import {
  spinner_styles_default
} from "./chunk.EACLXYYC.js";
import {
  LocalizeController
} from "./chunk.WLV3FVBR.js";
import {
  ShoelaceElement
} from "./chunk.U5X52PUD.js";

// src/components/spinner/spinner.component.ts
import { html } from "lit";
var SlSpinner = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.localize = new LocalizeController(this);
  }
  render() {
    return html`
      <svg part="base" class="spinner" role="progressbar" aria-label=${this.localize.term("loading")}>
        <circle class="spinner__track"></circle>
        <circle class="spinner__indicator"></circle>
      </svg>
    `;
  }
};
SlSpinner.styles = spinner_styles_default;

export {
  SlSpinner
};
