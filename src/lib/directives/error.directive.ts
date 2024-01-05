/** @format */

import { ReadonlyGrain, createDirective } from '@grainular/nord';
import { ControlError } from '../../types';

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
