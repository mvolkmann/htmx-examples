import Component from '../../components/mutation-observer/mutation-observer.component.js';
import { type EventName } from '@lit/react';
import type { SlMutationEvent } from '../../events/events.js';
export type { SlMutationEvent } from '../../events/events.js';
/**
 * @summary The Mutation Observer component offers a thin, declarative interface to the [`MutationObserver API`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver).
 * @documentation https://shoelace.style/components/mutation-observer
 * @status stable
 * @since 2.0
 *
 * @event {{ mutationList: MutationRecord[] }} sl-mutation - Emitted when a mutation occurs.
 *
 * @slot - The content to watch for mutations.
 */
declare const reactWrapper: import("@lit/react").ReactWebComponent<Component, {
    onSlMutation: EventName<SlMutationEvent>;
}>;
export default reactWrapper;
