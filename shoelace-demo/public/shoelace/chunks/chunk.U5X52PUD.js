import {
  __decorateClass,
  __spreadValues
} from "./chunk.IFDWM6P4.js";

// src/internal/shoelace-element.ts
import { LitElement } from "lit";
import { property } from "lit/decorators.js";
var ShoelaceElement = class extends LitElement {
  constructor() {
    super();
    Object.entries(this.constructor.dependencies).forEach(([name, component]) => {
      this.constructor.define(name, component);
    });
  }
  emit(name, options) {
    const event = new CustomEvent(name, __spreadValues({
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: {}
    }, options));
    this.dispatchEvent(event);
    return event;
  }
  /* eslint-enable */
  static define(name, elementConstructor = this, options = {}) {
    const currentlyRegisteredConstructor = customElements.get(name);
    if (!currentlyRegisteredConstructor) {
      customElements.define(name, class extends elementConstructor {
      }, options);
      return;
    }
    let newVersion = " (unknown version)";
    let existingVersion = newVersion;
    if ("version" in elementConstructor && elementConstructor.version) {
      newVersion = " v" + elementConstructor.version;
    }
    if ("version" in currentlyRegisteredConstructor && currentlyRegisteredConstructor.version) {
      existingVersion = " v" + currentlyRegisteredConstructor.version;
    }
    if (newVersion && existingVersion && newVersion === existingVersion) {
      return;
    }
    console.warn(
      `Attempted to register <${name}>${newVersion}, but <${name}>${existingVersion} has already been registered.`
    );
  }
};
/* eslint-disable */
// @ts-expect-error This is auto-injected at build time.
ShoelaceElement.version = "2.13.1";
ShoelaceElement.dependencies = {};
__decorateClass([
  property()
], ShoelaceElement.prototype, "dir", 2);
__decorateClass([
  property()
], ShoelaceElement.prototype, "lang", 2);

export {
  ShoelaceElement
};
