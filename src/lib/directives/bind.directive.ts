/** @format */

import { createDirective, grain } from '@grainular/nord';

/**
 * The `bind` directive creates a two-way binding between a specific attribute of an `HTMLInputElement` and a `grain` value.
 *
 * @template A - The attribute key of the `HTMLInputElement`.
 *
 * @param {A} attribute - The attribute of the `HTMLInputElement` to bind.
 * @param {keyof HTMLElementEventMap} [event='input'] - The event to listen to for changes (e.g., 'input' for input changes).
 *
 * @returns {{ value: HTMLInputElement[A] | null, bind: Directive<Element> }} An object representing the two-way binding. The `value` property holds the current value of the attribute, and the `bind` directive connects the binding to the DOM.
 *
 * @example
 * // Create a two-way binding for the 'value' attribute of an input element.
 * const boundInput = bind('value');
 *
 * // Use the binding to set and get values.
 * boundInput.value = 'Hello, World!'; // Sets the 'value' attribute of the input element.
 * const inputValue = boundInput.value; // Gets the current value from the 'value' attribute.
 *
 * // Apply the binding to an input element in the DOM.
 * const inputElement = document.getElementById('myInput');
 * boundInput.bind(inputElement); // Binds the 'value' attribute of the input element.
 */

export const bind = <A extends keyof HTMLInputElement>(attribute: A, event: keyof HTMLElementEventMap = 'input') => {
    let _element: HTMLInputElement | undefined;
    const _value = grain<HTMLInputElement[A] | null>(null);

    return {
        ..._value,
        get value() {
            return _value();
        },
        bind: createDirective<Element>((element) => {
            if (!(element instanceof HTMLInputElement)) {
                console.warn(`[Nørd:Forms]: Bind directive should only be used with 'HTMLInputElements'`);
                return;
            }

            _element = element;

            if (_element) {
                _value.subscribe((value) => {
                    if (value !== null && _element) {
                        _element?.setAttribute(attribute, `${value}`);
                        _element[attribute] = value;
                    }
                });

                _element.addEventListener(event, (ev) => {
                    const target = ev.currentTarget as HTMLInputElement;
                    if (target) {
                        _value.set(target[attribute]);
                    }
                });
            }
        }),
    };
};
