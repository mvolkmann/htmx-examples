import Component from '../../components/checkbox/checkbox.component.js';
import { type EventName } from '@lit/react';
import type { SlBlurEvent } from '../../events/events.js';
import type { SlChangeEvent } from '../../events/events.js';
import type { SlFocusEvent } from '../../events/events.js';
import type { SlInputEvent } from '../../events/events.js';
import type { SlInvalidEvent } from '../../events/events.js';
export type { SlBlurEvent } from '../../events/events.js';
export type { SlChangeEvent } from '../../events/events.js';
export type { SlFocusEvent } from '../../events/events.js';
export type { SlInputEvent } from '../../events/events.js';
export type { SlInvalidEvent } from '../../events/events.js';
/**
 * @summary Checkboxes allow the user to toggle an option on or off.
 * @documentation https://shoelace.style/components/checkbox
 * @status stable
 * @since 2.0
 *
 * @dependency sl-icon
 *
 * @slot - The checkbox's label.
 *
 * @event sl-blur - Emitted when the checkbox loses focus.
 * @event sl-change - Emitted when the checked state changes.
 * @event sl-focus - Emitted when the checkbox gains focus.
 * @event sl-input - Emitted when the checkbox receives input.
 * @event sl-invalid - Emitted when the form control has been checked for validity and its constraints aren't satisfied.
 *
 * @csspart base - The component's base wrapper.
 * @csspart control - The square container that wraps the checkbox's checked state.
 * @csspart control--checked - Matches the control part when the checkbox is checked.
 * @csspart control--indeterminate - Matches the control part when the checkbox is indeterminate.
 * @csspart checked-icon - The checked icon, an `<sl-icon>` element.
 * @csspart indeterminate-icon - The indeterminate icon, an `<sl-icon>` element.
 * @csspart label - The container that wraps the checkbox's label.
 */
declare const reactWrapper: import("@lit/react").ReactWebComponent<Component, {
    onSlBlur: EventName<SlBlurEvent>;
    onSlChange: EventName<SlChangeEvent>;
    onSlFocus: EventName<SlFocusEvent>;
    onSlInput: EventName<SlInputEvent>;
    onSlInvalid: EventName<SlInvalidEvent>;
}>;
export default reactWrapper;
