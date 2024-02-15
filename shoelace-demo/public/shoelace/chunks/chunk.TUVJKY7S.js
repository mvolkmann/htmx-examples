// src/styles/component.styles.ts
import { css } from "lit";
var component_styles_default = css`
  :host {
    box-sizing: border-box;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  [hidden] {
    display: none !important;
  }
`;

export {
  component_styles_default
};
