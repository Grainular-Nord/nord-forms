/** @format */

import { ReadonlyGrain, createDirective } from '@grainular/nord';
import { ControlError } from '../../types';

/**
 * The `controlErrors` function creates a directive that displays control errors based on a provided error dictionary and a `grain` value representing errors.
 *
 * @template T - The type representing control errors.
 * @template D - A dictionary type that maps control error keys to error messages.
 *
 * @param {ReadonlyGrain<T> | T} error - The `grain` value or direct value representing control errors.
 * @param {D} errorDict - A dictionary that maps control error keys to error messages.
 * @param {(error: Array<D[keyof T]>) => NodeList} run - A function that receives an array of error messages and returns a `NodeList` to display them.
 *
 * @returns {Directive<Text>} A directive that can be used to display control errors in the DOM based on the provided error dictionary and value.
 */
export const controlErrors = <T extends ControlError, D extends Record<keyof T, string>>(
    error: ReadonlyGrain<T> | T,
    errorDict: D,
    run: (error: Array<D[keyof T]>) => NodeList
) => {
    return createDirective(
        (element: Text) => {
            // Setup the initial transform function:
            const getErrorsFromDict = (error: T) => {
                const errs = Object.keys(error).map((key) => errorDict[key]) as Array<D[keyof T]>;
                console.log({ errs });
                return errs;
            };

            let initial = error;
            if (typeof initial === 'function') {
                initial = initial();
            }

            const [node] = run(getErrorsFromDict(initial));
            element.replaceWith(node);
            const root = node.parentElement;

            // Setup further error tracking
            if (typeof error === 'function') {
                let current = node;
                error.subscribe((errors) => {
                    const [replacement] = run(getErrorsFromDict(errors));
                    root?.replaceChild(replacement, current);

                    current = replacement;
                });
            }
        },
        { nodeType: 'Text' }
    );
};
