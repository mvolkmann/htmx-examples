import {
  tab_panel_styles_default
} from "./chunk.JTIOSPX3.js";
import {
  watch
} from "./chunk.2FB5TK5H.js";
import {
  ShoelaceElement
} from "./chunk.U5X52PUD.js";
import {
  __decorateClass
} from "./chunk.IFDWM6P4.js";

// src/components/tab-panel/tab-panel.component.ts
import { classMap } from "lit/directives/class-map.js";
import { html } from "lit";
import { property } from "lit/decorators.js";
var id = 0;
var SlTabPanel = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.attrId = ++id;
    this.componentId = `sl-tab-panel-${this.attrId}`;
    this.name = "";
    this.active = false;
  }
  connectedCallback() {
    super.connectedCallback();
    this.id = this.id.length > 0 ? this.id : this.componentId;
    this.setAttribute("role", "tabpanel");
  }
  handleActiveChange() {
    this.setAttribute("aria-hidden", this.active ? "false" : "true");
  }
  render() {
    return html`
      <slot
        part="base"
        class=${classMap({
      "tab-panel": true,
      "tab-panel--active": this.active
    })}
      ></slot>
    `;
  }
};
SlTabPanel.styles = tab_panel_styles_default;
__decorateClass([
  property({ reflect: true })
], SlTabPanel.prototype, "name", 2);
__decorateClass([
  property({ type: Boolean, reflect: true })
], SlTabPanel.prototype, "active", 2);
__decorateClass([
  watch("active")
], SlTabPanel.prototype, "handleActiveChange", 1);

export {
  SlTabPanel
};
