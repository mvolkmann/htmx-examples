import Component from '../../components/include/include.component.js';
import { type EventName } from '@lit/react';
import type { SlLoadEvent } from '../../events/events.js';
import type { SlErrorEvent } from '../../events/events.js';
export type { SlLoadEvent } from '../../events/events.js';
export type { SlErrorEvent } from '../../events/events.js';
/**
 * @summary Includes give you the power to embed external HTML files into the page.
 * @documentation https://shoelace.style/components/include
 * @status stable
 * @since 2.0
 *
 * @event sl-load - Emitted when the included file is loaded.
 * @event {{ status: number }} sl-error - Emitted when the included file fails to load due to an error.
 */
declare const reactWrapper: import("@lit/react").ReactWebComponent<Component, {
    onSlLoad: EventName<SlLoadEvent>;
    onSlError: EventName<SlErrorEvent>;
}>;
export default reactWrapper;
