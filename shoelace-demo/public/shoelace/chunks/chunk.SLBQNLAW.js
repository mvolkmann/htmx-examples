import {
  SlTooltip
} from "./chunk.KMHZYCWU.js";
import {
  copy_button_styles_default
} from "./chunk.PH5IIYTE.js";
import {
  getAnimation,
  setDefaultAnimation
} from "./chunk.DHU6MIVB.js";
import {
  LocalizeController
} from "./chunk.WLV3FVBR.js";
import {
  SlIcon
} from "./chunk.Y62EZWMI.js";
import {
  ShoelaceElement
} from "./chunk.U5X52PUD.js";
import {
  __decorateClass
} from "./chunk.IFDWM6P4.js";

// src/components/copy-button/copy-button.component.ts
import { classMap } from "lit/directives/class-map.js";
import { html } from "lit";
import { property, query, state } from "lit/decorators.js";
var SlCopyButton = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.localize = new LocalizeController(this);
    this.isCopying = false;
    this.status = "rest";
    this.value = "";
    this.from = "";
    this.disabled = false;
    this.copyLabel = "";
    this.successLabel = "";
    this.errorLabel = "";
    this.feedbackDuration = 1e3;
    this.tooltipPlacement = "top";
    this.hoist = false;
  }
  async handleCopy() {
    if (this.disabled || this.isCopying) {
      return;
    }
    this.isCopying = true;
    let valueToCopy = this.value;
    if (this.from) {
      const root = this.getRootNode();
      const isProperty = this.from.includes(".");
      const isAttribute = this.from.includes("[") && this.from.includes("]");
      let id = this.from;
      let field = "";
      if (isProperty) {
        [id, field] = this.from.trim().split(".");
      } else if (isAttribute) {
        [id, field] = this.from.trim().replace(/\]$/, "").split("[");
      }
      const target = "getElementById" in root ? root.getElementById(id) : null;
      if (target) {
        if (isAttribute) {
          valueToCopy = target.getAttribute(field) || "";
        } else if (isProperty) {
          valueToCopy = target[field] || "";
        } else {
          valueToCopy = target.textContent || "";
        }
      } else {
        this.showStatus("error");
        this.emit("sl-error");
      }
    }
    if (!valueToCopy) {
      this.showStatus("error");
      this.emit("sl-error");
    } else {
      try {
        await navigator.clipboard.writeText(valueToCopy);
        this.showStatus("success");
        this.emit("sl-copy", {
          detail: {
            value: valueToCopy
          }
        });
      } catch (error) {
        this.showStatus("error");
        this.emit("sl-error");
      }
    }
  }
  async showStatus(status) {
    const copyLabel = this.copyLabel || this.localize.term("copy");
    const successLabel = this.successLabel || this.localize.term("copied");
    const errorLabel = this.errorLabel || this.localize.term("error");
    const iconToShow = status === "success" ? this.successIcon : this.errorIcon;
    const showAnimation = getAnimation(this, "copy.in", { dir: "ltr" });
    const hideAnimation = getAnimation(this, "copy.out", { dir: "ltr" });
    this.tooltip.content = status === "success" ? successLabel : errorLabel;
    await this.copyIcon.animate(hideAnimation.keyframes, hideAnimation.options).finished;
    this.copyIcon.hidden = true;
    this.status = status;
    iconToShow.hidden = false;
    await iconToShow.animate(showAnimation.keyframes, showAnimation.options).finished;
    setTimeout(async () => {
      await iconToShow.animate(hideAnimation.keyframes, hideAnimation.options).finished;
      iconToShow.hidden = true;
      this.status = "rest";
      this.copyIcon.hidden = false;
      await this.copyIcon.animate(showAnimation.keyframes, showAnimation.options).finished;
      this.tooltip.content = copyLabel;
      this.isCopying = false;
    }, this.feedbackDuration);
  }
  render() {
    const copyLabel = this.copyLabel || this.localize.term("copy");
    return html`
      <sl-tooltip
        class=${classMap({
      "copy-button": true,
      "copy-button--success": this.status === "success",
      "copy-button--error": this.status === "error"
    })}
        content=${copyLabel}
        placement=${this.tooltipPlacement}
        ?disabled=${this.disabled}
        ?hoist=${this.hoist}
        exportparts="
          base:tooltip__base,
          base__popup:tooltip__base__popup,
          base__arrow:tooltip__base__arrow,
          body:tooltip__body
        "
      >
        <button
          class="copy-button__button"
          part="button"
          type="button"
          ?disabled=${this.disabled}
          @click=${this.handleCopy}
        >
          <slot part="copy-icon" name="copy-icon">
            <sl-icon library="system" name="copy"></sl-icon>
          </slot>
          <slot part="success-icon" name="success-icon" hidden>
            <sl-icon library="system" name="check"></sl-icon>
          </slot>
          <slot part="error-icon" name="error-icon" hidden>
            <sl-icon library="system" name="x-lg"></sl-icon>
          </slot>
        </button>
      </sl-tooltip>
    `;
  }
};
SlCopyButton.styles = copy_button_styles_default;
SlCopyButton.dependencies = {
  "sl-icon": SlIcon,
  "sl-tooltip": SlTooltip
};
__decorateClass([
  query('slot[name="copy-icon"]')
], SlCopyButton.prototype, "copyIcon", 2);
__decorateClass([
  query('slot[name="success-icon"]')
], SlCopyButton.prototype, "successIcon", 2);
__decorateClass([
  query('slot[name="error-icon"]')
], SlCopyButton.prototype, "errorIcon", 2);
__decorateClass([
  query("sl-tooltip")
], SlCopyButton.prototype, "tooltip", 2);
__decorateClass([
  state()
], SlCopyButton.prototype, "isCopying", 2);
__decorateClass([
  state()
], SlCopyButton.prototype, "status", 2);
__decorateClass([
  property()
], SlCopyButton.prototype, "value", 2);
__decorateClass([
  property()
], SlCopyButton.prototype, "from", 2);
__decorateClass([
  property({ type: Boolean, reflect: true })
], SlCopyButton.prototype, "disabled", 2);
__decorateClass([
  property({ attribute: "copy-label" })
], SlCopyButton.prototype, "copyLabel", 2);
__decorateClass([
  property({ attribute: "success-label" })
], SlCopyButton.prototype, "successLabel", 2);
__decorateClass([
  property({ attribute: "error-label" })
], SlCopyButton.prototype, "errorLabel", 2);
__decorateClass([
  property({ attribute: "feedback-duration", type: Number })
], SlCopyButton.prototype, "feedbackDuration", 2);
__decorateClass([
  property({ attribute: "tooltip-placement" })
], SlCopyButton.prototype, "tooltipPlacement", 2);
__decorateClass([
  property({ type: Boolean })
], SlCopyButton.prototype, "hoist", 2);
setDefaultAnimation("copy.in", {
  keyframes: [
    { scale: ".25", opacity: ".25" },
    { scale: "1", opacity: "1" }
  ],
  options: { duration: 100 }
});
setDefaultAnimation("copy.out", {
  keyframes: [
    { scale: "1", opacity: "1" },
    { scale: ".25", opacity: "0" }
  ],
  options: { duration: 100 }
});

export {
  SlCopyButton
};
