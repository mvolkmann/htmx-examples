import {
  component_styles_default
} from "./chunk.TUVJKY7S.js";

// src/components/visually-hidden/visually-hidden.styles.ts
import { css } from "lit";
var visually_hidden_styles_default = css`
  ${component_styles_default}

  :host(:not(:focus-within)) {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    clip: rect(0 0 0 0) !important;
    clip-path: inset(50%) !important;
    border: none !important;
    overflow: hidden !important;
    white-space: nowrap !important;
    padding: 0 !important;
  }
`;

export {
  visually_hidden_styles_default
};
