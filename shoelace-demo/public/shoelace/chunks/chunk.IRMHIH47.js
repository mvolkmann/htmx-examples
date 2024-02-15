import {
  breadcrumb_item_styles_default
} from "./chunk.ICCEXFDQ.js";
import {
  HasSlotController
} from "./chunk.NYIIDP5N.js";
import {
  ShoelaceElement
} from "./chunk.U5X52PUD.js";
import {
  __decorateClass
} from "./chunk.IFDWM6P4.js";

// src/components/breadcrumb-item/breadcrumb-item.component.ts
import { classMap } from "lit/directives/class-map.js";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { property } from "lit/decorators.js";
var SlBreadcrumbItem = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.hasSlotController = new HasSlotController(this, "prefix", "suffix");
    this.rel = "noreferrer noopener";
  }
  render() {
    const isLink = this.href ? true : false;
    return html`
      <div
        part="base"
        class=${classMap({
      "breadcrumb-item": true,
      "breadcrumb-item--has-prefix": this.hasSlotController.test("prefix"),
      "breadcrumb-item--has-suffix": this.hasSlotController.test("suffix")
    })}
      >
        <span part="prefix" class="breadcrumb-item__prefix">
          <slot name="prefix"></slot>
        </span>

        ${isLink ? html`
              <a
                part="label"
                class="breadcrumb-item__label breadcrumb-item__label--link"
                href="${this.href}"
                target="${ifDefined(this.target ? this.target : void 0)}"
                rel=${ifDefined(this.target ? this.rel : void 0)}
              >
                <slot></slot>
              </a>
            ` : html`
              <button part="label" type="button" class="breadcrumb-item__label breadcrumb-item__label--button">
                <slot></slot>
              </button>
            `}

        <span part="suffix" class="breadcrumb-item__suffix">
          <slot name="suffix"></slot>
        </span>

        <span part="separator" class="breadcrumb-item__separator" aria-hidden="true">
          <slot name="separator"></slot>
        </span>
      </div>
    `;
  }
};
SlBreadcrumbItem.styles = breadcrumb_item_styles_default;
__decorateClass([
  property()
], SlBreadcrumbItem.prototype, "href", 2);
__decorateClass([
  property()
], SlBreadcrumbItem.prototype, "target", 2);
__decorateClass([
  property()
], SlBreadcrumbItem.prototype, "rel", 2);

export {
  SlBreadcrumbItem
};
