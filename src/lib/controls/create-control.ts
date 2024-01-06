/** @format */

import { createDirective, grain, readonly } from '@grainular/nord';
import { ControlInit } from '../../types/control-init';
import { Control } from '../../types/control';
import { ControlError } from '../../types/control-error';
import { isNonNull } from '../../utils/is-non-null';
import { Validator } from '../../types/validator';
import { ControlTypes } from '../../types/control-types';
import { øParseValueByTarget } from './parse-value-by-target';
import { øSetValueByTarget } from './set-value-by-target';
import { InputElement } from '../../types/input-element';

/**
 * Creates a control for managing form input elements with validation and state management.
 *
 * This function is used to create a control that can be associated with form input elements.
 * The control manages the state, validation, and interaction with the input element.
 *
 * @template Type - The type of value managed by the control.
 *
 * @param {ControlInit<Type>} init - The initial configuration for the control.
 * @param {Validator<Type | null>[]} [validators] - An optional array of validators to apply to the control's value.
 *
 * @returns {Control<Type>} A control instance that manages the state and behavior of the associated input element.
 */

export const createControl = <Type extends ControlTypes>(
    init: ControlInit<Type>,
    validators?: Validator<Type | null>[]
): Control<Type> => {
    const control = {};
    const setProperty = (name: keyof Control<any>, descriptor: PropertyDescriptor) => {
        Object.defineProperty(control, name, { ...descriptor, ...(descriptor.value ? { writable: false } : {}) });
    };
    setProperty(`id`, { value: `ø-${crypto.randomUUID().slice(0, 5)}` });

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
    let inputElement: InputElement | null = null;
    setProperty('nativeElement', { get: () => inputElement });

    // Set up value
    const _value = grain<Type | null>(init.value ?? null);
    setProperty('value', { value: _value });
    setProperty('setValue', { value: (value: Type | null) => _value.set(value) });

    // Create the control directive
    setProperty('control', {
        value: createDirective((element: Element) => {
            if (
                !(element instanceof HTMLInputElement) &&
                !(element instanceof HTMLTextAreaElement) &&
                !(element instanceof HTMLSelectElement)
            ) {
                console.warn(`[Nørd:Forms]: Element is not a input, select or text-area element: ${element}`);
                return;
            }

            inputElement = element as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

            // Handle enabled/disabled state and attribute
            _disabled.subscribe((state) => {
                inputElement?.[state ? 'setAttribute' : 'removeAttribute']('disabled', '');
            });

            // handle name & type property
            setProperty('name', { value: inputElement.getAttribute('name') });
            setProperty('type', { value: inputElement.getAttribute('type') });
            inputElement.setAttribute(`control-id`, (control as Control<any>).id);

            // Set up the two way binding
            _value.subscribe((value) => {
                if (inputElement) {
                    øSetValueByTarget(value, inputElement as InputElement);
                }
            });

            element.addEventListener(`input`, (ev) => {
                if (ev.currentTarget) {
                    const target = ev.currentTarget as InputElement;
                    øParseValueByTarget(control as Control<Type>, target);
                }
            });

            // Set up touch state listener
            element.addEventListener('focus', (event) => {
                _focused.set(true);
                _touched.set(true);
                onFocus?.(event as FocusEvent);
            });
            element.addEventListener('blur', (event) => {
                _focused.set(false);
                onBlur?.(event as FocusEvent);
            });
        }),
    });

    // Set up validity engine
    const _validators = [...(validators ?? [])];
    setProperty('validators', { get: () => _validators });
    setProperty('addValidator', { value: (...validator: Validator<Type | null>[]) => _validators.push(...validator) });
    setProperty('removeValidator', {
        value: (validator: Validator<Type | null>) => {
            const idx = _validators.indexOf(validator);
            if (idx !== -1) {
                _validators.splice(idx, 1);
            }
        },
    });

    const _valid = grain(false);
    setProperty('valid', { value: readonly(_valid) });
    setProperty('isValid', { get: () => _valid() });

    const _errors = grain<ControlError>({});
    setProperty('errors', { value: readonly(_errors) });

    // Subscribe to the value to track the validity by passing the value through every
    // registered validator
    _value.subscribe((changedValue) => {
        if (!_validators.length) {
            _valid.set(true);
            return;
        }

        const validatorErrors: (null | ControlError)[] = _validators.map((validator) => validator(changedValue));
        _errors.set(validatorErrors.filter(isNonNull).reduce((cur, acc) => ({ ...cur, ...acc }), {}));
        _valid.set(validatorErrors.every((value) => value === null));
    });

    setProperty('reset', {
        value: () => {
            _errors.set({});
            _valid.set(true);
            _focused.set(false);
            _touched.set(false);
            _value.set(null);
        },
    });

    return control as Control<Type>;
};
