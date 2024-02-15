import {
  component_styles_default
} from "./chunk.TUVJKY7S.js";

// src/components/tab-panel/tab-panel.styles.ts
import { css } from "lit";
var tab_panel_styles_default = css`
  ${component_styles_default}

  :host {
    --padding: 0;

    display: none;
  }

  :host([active]) {
    display: block;
  }

  .tab-panel {
    display: block;
    padding: var(--padding);
  }
`;

export {
  tab_panel_styles_default
};
