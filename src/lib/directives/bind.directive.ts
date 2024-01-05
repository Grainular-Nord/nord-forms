/** @format */

import { createDirective, grain } from '@grainular/nord';

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
