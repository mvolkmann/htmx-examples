import {
  icon_button_styles_default
} from "./chunk.7BLP64MK.js";
import {
  SlIcon
} from "./chunk.Y62EZWMI.js";
import {
  ShoelaceElement
} from "./chunk.U5X52PUD.js";
import {
  __decorateClass
} from "./chunk.IFDWM6P4.js";

// src/components/icon-button/icon-button.component.ts
import { classMap } from "lit/directives/class-map.js";
import { html, literal } from "lit/static-html.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { property, query, state } from "lit/decorators.js";
var SlIconButton = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.hasFocus = false;
    this.label = "";
    this.disabled = false;
  }
  handleBlur() {
    this.hasFocus = false;
    this.emit("sl-blur");
  }
  handleFocus() {
    this.hasFocus = true;
    this.emit("sl-focus");
  }
  handleClick(event) {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
  /** Simulates a click on the icon button. */
  click() {
    this.button.click();
  }
  /** Sets focus on the icon button. */
  focus(options) {
    this.button.focus(options);
  }
  /** Removes focus from the icon button. */
  blur() {
    this.button.blur();
  }
  render() {
    const isLink = this.href ? true : false;
    const tag = isLink ? literal`a` : literal`button`;
    return html`
      <${tag}
        part="base"
        class=${classMap({
      "icon-button": true,
      "icon-button--disabled": !isLink && this.disabled,
      "icon-button--focused": this.hasFocus
    })}
        ?disabled=${ifDefined(isLink ? void 0 : this.disabled)}
        type=${ifDefined(isLink ? void 0 : "button")}
        href=${ifDefined(isLink ? this.href : void 0)}
        target=${ifDefined(isLink ? this.target : void 0)}
        download=${ifDefined(isLink ? this.download : void 0)}
        rel=${ifDefined(isLink && this.target ? "noreferrer noopener" : void 0)}
        role=${ifDefined(isLink ? void 0 : "button")}
        aria-disabled=${this.disabled ? "true" : "false"}
        aria-label="${this.label}"
        tabindex=${this.disabled ? "-1" : "0"}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @click=${this.handleClick}
      >
        <sl-icon
          class="icon-button__icon"
          name=${ifDefined(this.name)}
          library=${ifDefined(this.library)}
          src=${ifDefined(this.src)}
          aria-hidden="true"
        ></sl-icon>
      </${tag}>
    `;
  }
};
SlIconButton.styles = icon_button_styles_default;
SlIconButton.dependencies = { "sl-icon": SlIcon };
__decorateClass([
  query(".icon-button")
], SlIconButton.prototype, "button", 2);
__decorateClass([
  state()
], SlIconButton.prototype, "hasFocus", 2);
__decorateClass([
  property()
], SlIconButton.prototype, "name", 2);
__decorateClass([
  property()
], SlIconButton.prototype, "library", 2);
__decorateClass([
  property()
], SlIconButton.prototype, "src", 2);
__decorateClass([
  property()
], SlIconButton.prototype, "href", 2);
__decorateClass([
  property()
], SlIconButton.prototype, "target", 2);
__decorateClass([
  property()
], SlIconButton.prototype, "download", 2);
__decorateClass([
  property()
], SlIconButton.prototype, "label", 2);
__decorateClass([
  property({ type: Boolean, reflect: true })
], SlIconButton.prototype, "disabled", 2);

export {
  SlIconButton
};
