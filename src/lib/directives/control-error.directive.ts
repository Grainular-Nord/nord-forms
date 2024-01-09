/** @format */

import { Directive, ReadonlyGrain, createDirective, grain } from '@grainular/nord';
import { ControlError } from '../../types';

/**
 * Creates a directive that displays a control error message.
 * The directive dynamically updates to show the relevant error message based on the current error state.
 *
 * @template E - The type representing control errors.
 * @template D - A dictionary type mapping control error keys to their respective messages.
 *
 * @param {ReadonlyGrain<E>} errors - A `grain` value representing the current error state of a control.
 * @param {(errors: E) => keyof E | null} [strategy] - An optional function to determine which error message to display.
 *                                                      If not provided, the default strategy will use the first error in the errors object.
 *
 * @returns {Directive<Text> & { fromDict: (dict: D) => Directive<Text> }}
 *          A directive that can be used to display control error messages in the DOM.
 *          Use `fromDict` to specify the dictionary mapping error keys to messages.
 *
 * @example
 * const form = createControlGroup({
 *     name: createControl<string>({ value: null }, [required]),
 * });
 *
 * const errors = {
 *     required: 'This field is required.',
 * };
 *
 * // Usage in HTML template
 * return html`<form>
 *     <label is-valid="${form.name.valid}" is-touched="${form.name.touched}">
 *         Name:
 *         <input ${form.name.control} type="text" placeholder="Name..." />
 *         <span>${controlError(form.name.errors).fromDict(errors)}</span>
 *     </label>
 *     <button>Submit</button>
 * </form>`;
 */
export const controlError = <E extends ControlError, D extends Record<keyof E, string>>(
    errors: ReadonlyGrain<E>,
    strategy?: (errors: E) => keyof E | null
) => {
    let dict: D | null = null;

    // create and assign the default strategy if necessary
    const _strategy = strategy ?? ((errors: E) => Object.entries(errors)?.[0]?.[0]);
    const retrieveErrorFromDict = (errors: E) => {
        const resolvedError = _strategy(errors);

        if (!resolvedError) return null;
        return (dict ? dict[resolvedError] : resolvedError?.toString()) ?? null;
    };

    const contentDirective = createDirective<Text>((element) => {
        // Get the initial nodeValue to replace the current value;
        const text = retrieveErrorFromDict(errors());
        element.nodeValue = text;

        const unsubscribe = errors.subscribe((errors) => {
            if (!element.isConnected) {
                unsubscribe();
            }

            const text = retrieveErrorFromDict(errors);
            element.nodeValue = text;
        });
    });

    const fromDict = (_dict: D) => {
        dict = _dict;
        return contentDirective;
    };

    Object.defineProperty(contentDirective, 'fromDict', {
        value: fromDict,
        writable: false,
    });

    return contentDirective as Directive<Text> & { fromDict: (dict: D) => Directive<Text> };
};
