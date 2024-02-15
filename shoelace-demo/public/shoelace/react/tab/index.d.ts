import Component from '../../components/tab/tab.component.js';
import { type EventName } from '@lit/react';
import type { SlCloseEvent } from '../../events/events.js';
export type { SlCloseEvent } from '../../events/events.js';
/**
 * @summary Tabs are used inside [tab groups](/components/tab-group) to represent and activate [tab panels](/components/tab-panel).
 * @documentation https://shoelace.style/components/tab
 * @status stable
 * @since 2.0
 *
 * @dependency sl-icon-button
 *
 * @slot - The tab's label.
 *
 * @event sl-close - Emitted when the tab is closable and the close button is activated.
 *
 * @csspart base - The component's base wrapper.
 * @csspart close-button - The close button, an `<sl-icon-button>`.
 * @csspart close-button__base - The close button's exported `base` part.
 */
declare const reactWrapper: import("@lit/react").ReactWebComponent<Component, {
    onSlClose: EventName<SlCloseEvent>;
}>;
export default reactWrapper;
