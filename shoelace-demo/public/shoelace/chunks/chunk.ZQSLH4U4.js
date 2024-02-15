import {
  tag_styles_default
} from "./chunk.2FVP4SGD.js";
import {
  SlIconButton
} from "./chunk.LAJLA5X5.js";
import {
  LocalizeController
} from "./chunk.WLV3FVBR.js";
import {
  ShoelaceElement
} from "./chunk.U5X52PUD.js";
import {
  __decorateClass
} from "./chunk.IFDWM6P4.js";

// src/components/tag/tag.component.ts
import { classMap } from "lit/directives/class-map.js";
import { html } from "lit";
import { property } from "lit/decorators.js";
var SlTag = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.localize = new LocalizeController(this);
    this.variant = "neutral";
    this.size = "medium";
    this.pill = false;
    this.removable = false;
  }
  handleRemoveClick() {
    this.emit("sl-remove");
  }
  render() {
    return html`
      <span
        part="base"
        class=${classMap({
      tag: true,
      // Types
      "tag--primary": this.variant === "primary",
      "tag--success": this.variant === "success",
      "tag--neutral": this.variant === "neutral",
      "tag--warning": this.variant === "warning",
      "tag--danger": this.variant === "danger",
      "tag--text": this.variant === "text",
      // Sizes
      "tag--small": this.size === "small",
      "tag--medium": this.size === "medium",
      "tag--large": this.size === "large",
      // Modifiers
      "tag--pill": this.pill,
      "tag--removable": this.removable
    })}
      >
        <slot part="content" class="tag__content"></slot>

        ${this.removable ? html`
              <sl-icon-button
                part="remove-button"
                exportparts="base:remove-button__base"
                name="x-lg"
                library="system"
                label=${this.localize.term("remove")}
                class="tag__remove"
                @click=${this.handleRemoveClick}
                tabindex="-1"
              ></sl-icon-button>
            ` : ""}
      </span>
    `;
  }
};
SlTag.styles = tag_styles_default;
SlTag.dependencies = { "sl-icon-button": SlIconButton };
__decorateClass([
  property({ reflect: true })
], SlTag.prototype, "variant", 2);
__decorateClass([
  property({ reflect: true })
], SlTag.prototype, "size", 2);
__decorateClass([
  property({ type: Boolean, reflect: true })
], SlTag.prototype, "pill", 2);
__decorateClass([
  property({ type: Boolean })
], SlTag.prototype, "removable", 2);

export {
  SlTag
};
