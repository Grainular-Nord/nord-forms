/** @format */

import { createDirective, grain, readonly } from '@grainular/nord';
import { ControlInit } from '../types/control-init';
import { Control } from '../types/control';
import { defaultFormatter } from '../utils/default-formatter';
import { ControlError } from '../types/control-error';
import { isNonNull } from '../utils/is-non-null';
import { Validator } from '../types/validator';
import { ControlTypes } from '../types/control-types';

export const createControl = <Type extends ControlTypes>(init: ControlInit<Type>) => {
    const control = {};
    const setProperty = (name: keyof Control<any>, descriptor: PropertyDescriptor) => {
        Object.defineProperty(control, name, { ...descriptor, ...(descriptor.value ? { writable: false } : {}) });
    };

    // Touched Status
    const _touched = grain(false);
    setProperty('touched', { value: readonly(_touched) });
    setProperty('isTouched', { get: () => _touched() });

    // Focused Status
    const _focused = grain(false);
    setProperty('focused', { value: readonly(_focused) });
    setProperty('isFocused', { get: () => _focused() });
    let onFocus: ((event: FocusEvent) => void) | null = init.handleOnFocus ?? null;
    setProperty('registerOnFocus', {
        value: (handler: (event: FocusEvent) => void) => {
            onFocus = handler;
        },
    });
    let onBlur: ((event: FocusEvent) => void) | null = init.handleOnBlur ?? null;
    setProperty('registerOnBlur', {
        value: (handler: (event: FocusEvent) => void) => {
            onBlur = handler;
        },
    });

    // Disabled Status & handlers
    const _disabled = grain(init.disabled ?? false);
    setProperty('disabled', { value: readonly(_disabled) });
    setProperty('isDisabled', { get: () => _disabled() });
    setProperty('disable', { value: () => _disabled.set(true) });
    setProperty('enable', { value: () => _disabled.set(false) });

    // Set up the control elements
    const formatter = init.formatter ?? defaultFormatter<Type>;
    let inputElement: HTMLInputElement | null = null;
    setProperty('nativeElement', { get: () => inputElement });

    // Set up value
    const value = grain<Type | null>(init.value ?? null);
    setProperty('value', { value });

    // Create the control directive
    setProperty('control', {
        value: createDirective((element: Element) => {
            if (!(element instanceof HTMLInputElement)) {
                console.warn(`[Nørd:Forms]: Element is not a input: ${element}`);
                return;
            }

            inputElement = element;

            // Handle enabled/disabled state and attribute
            _disabled.subscribe((state) => {
                inputElement?.[state ? 'setAttribute' : 'removeAttribute']('disabled', '');
            });

            // Set up the two way binding
            value.subscribe((value) => {
                if (inputElement) {
                    inputElement!.value = `${value ?? ''}`;
                }
            });

            element.addEventListener(`input`, (ev) => {
                if (ev.currentTarget) {
                    const target = ev.currentTarget as HTMLInputElement;
                    value.set(formatter(target.value));
                }
            });

            // Set up touch state listener
            element.addEventListener('focus', (event) => {
                _focused.set(true);
                _touched.set(true);
                onFocus?.(event);
            });
            element.addEventListener('blur', (event) => {
                _focused.set(false);
                onBlur?.(event);
            });
        }),
    });

    // Set up validity engine
    const validators = [...(init.validators ?? [])];
    setProperty('validators', { get: () => validators });
    setProperty('addValidator', { value: (...validator: Validator[]) => validators.push(...validator) });
    setProperty('removeValidator', {
        value: (validator: Validator) => {
            const idx = validators.indexOf(validator);
            if (idx !== -1) {
                validators.splice(idx, 1);
            }
        },
    });

    const _valid = grain(false);
    setProperty('valid', { value: readonly(_valid) });
    setProperty('isValid', { get: () => _valid() });

    const _errors = grain<ControlError>({});
    setProperty('errors', { get: () => _errors() });

    // Subscribe to the value to track the validity by passing the value through every
    // registered validator
    value.subscribe((changedValue) => {
        if (!validators.length) {
            _valid.set(true);
            return;
        }

        const validatorErrors: (null | ControlError)[] = validators.map((validator) => validator(changedValue));
        _errors.set(validatorErrors.filter(isNonNull).reduce((cur, acc) => ({ ...cur, ...acc }), {}));
        _valid.set(validatorErrors.every((value) => value === null));
    });

    setProperty('reset', {
        value: () => {
            _errors.set({});
            _valid.set(true);
            _focused.set(false);
            _touched.set(false);
            value.set(null);
        },
    });

    return control as Control<Type>;
};
