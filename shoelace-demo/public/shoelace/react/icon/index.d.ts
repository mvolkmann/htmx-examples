import Component from '../../components/icon/icon.component.js';
import { type EventName } from '@lit/react';
import type { SlLoadEvent } from '../../events/events.js';
import type { SlErrorEvent } from '../../events/events.js';
export type { SlLoadEvent } from '../../events/events.js';
export type { SlErrorEvent } from '../../events/events.js';
/**
 * @summary Icons are symbols that can be used to represent various options within an application.
 * @documentation https://shoelace.style/components/icon
 * @status stable
 * @since 2.0
 *
 * @event sl-load - Emitted when the icon has loaded. When using `spriteSheet: true` this will not emit.
 * @event sl-error - Emitted when the icon fails to load due to an error. When using `spriteSheet: true` this will not emit.
 *
 * @csspart svg - The internal SVG element.
 * @csspart use - The <use> element generated when using `spriteSheet: true`
 */
declare const reactWrapper: import("@lit/react").ReactWebComponent<Component, {
    onSlLoad: EventName<SlLoadEvent>;
    onSlError: EventName<SlErrorEvent>;
}>;
export default reactWrapper;
