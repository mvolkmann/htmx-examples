import Component from '../../components/menu/menu.component.js';
import { type EventName } from '@lit/react';
import type { SlSelectEvent } from '../../events/events.js';
export type { SlSelectEvent } from '../../events/events.js';
/**
 * @summary Menus provide a list of options for the user to choose from.
 * @documentation https://shoelace.style/components/menu
 * @status stable
 * @since 2.0
 *
 * @slot - The menu's content, including menu items, menu labels, and dividers.
 *
 * @event {{ item: SlMenuItem }} sl-select - Emitted when a menu item is selected.
 */
declare const reactWrapper: import("@lit/react").ReactWebComponent<Component, {
    onSlSelect: EventName<SlSelectEvent>;
}>;
export default reactWrapper;
