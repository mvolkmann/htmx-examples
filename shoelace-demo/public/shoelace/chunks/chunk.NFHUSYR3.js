import {
  carousel_item_styles_default
} from "./chunk.TRSVZP6J.js";
import {
  ShoelaceElement
} from "./chunk.U5X52PUD.js";

// src/components/carousel-item/carousel-item.component.ts
import { html } from "lit";
var SlCarouselItem = class extends ShoelaceElement {
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("role", "group");
  }
  render() {
    return html` <slot></slot> `;
  }
};
SlCarouselItem.styles = carousel_item_styles_default;

export {
  SlCarouselItem
};
