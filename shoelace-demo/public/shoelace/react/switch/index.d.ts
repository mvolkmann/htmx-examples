import Component from '../../components/switch/switch.component.js';
import { type EventName } from '@lit/react';
import type { SlBlurEvent } from '../../events/events.js';
import type { SlChangeEvent } from '../../events/events.js';
import type { SlInputEvent } from '../../events/events.js';
import type { SlFocusEvent } from '../../events/events.js';
import type { SlInvalidEvent } from '../../events/events.js';
export type { SlBlurEvent } from '../../events/events.js';
export type { SlChangeEvent } from '../../events/events.js';
export type { SlInputEvent } from '../../events/events.js';
export type { SlFocusEvent } from '../../events/events.js';
export type { SlInvalidEvent } from '../../events/events.js';
/**
 * @summary Switches allow the user to toggle an option on or off.
 * @documentation https://shoelace.style/components/switch
 * @status stable
 * @since 2.0
 *
 * @slot - The switch's label.
 *
 * @event sl-blur - Emitted when the control loses focus.
 * @event sl-change - Emitted when the control's checked state changes.
 * @event sl-input - Emitted when the control receives input.
 * @event sl-focus - Emitted when the control gains focus.
 * @event sl-invalid - Emitted when the form control has been checked for validity and its constraints aren't satisfied.
 *
 * @csspart base - The component's base wrapper.
 * @csspart control - The control that houses the switch's thumb.
 * @csspart thumb - The switch's thumb.
 * @csspart label - The switch's label.
 *
 * @cssproperty --width - The width of the switch.
 * @cssproperty --height - The height of the switch.
 * @cssproperty --thumb-size - The size of the thumb.
 */
declare const reactWrapper: import("@lit/react").ReactWebComponent<Component, {
    onSlBlur: EventName<SlBlurEvent>;
    onSlChange: EventName<SlChangeEvent>;
    onSlInput: EventName<SlInputEvent>;
    onSlFocus: EventName<SlFocusEvent>;
    onSlInvalid: EventName<SlInvalidEvent>;
}>;
export default reactWrapper;
