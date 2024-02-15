import {
  skeleton_styles_default
} from "./chunk.IQEMV2WD.js";
import {
  ShoelaceElement
} from "./chunk.U5X52PUD.js";
import {
  __decorateClass
} from "./chunk.IFDWM6P4.js";

// src/components/skeleton/skeleton.component.ts
import { classMap } from "lit/directives/class-map.js";
import { html } from "lit";
import { property } from "lit/decorators.js";
var SlSkeleton = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.effect = "none";
  }
  render() {
    return html`
      <div
        part="base"
        class=${classMap({
      skeleton: true,
      "skeleton--pulse": this.effect === "pulse",
      "skeleton--sheen": this.effect === "sheen"
    })}
      >
        <div part="indicator" class="skeleton__indicator"></div>
      </div>
    `;
  }
};
SlSkeleton.styles = skeleton_styles_default;
__decorateClass([
  property()
], SlSkeleton.prototype, "effect", 2);

export {
  SlSkeleton
};
