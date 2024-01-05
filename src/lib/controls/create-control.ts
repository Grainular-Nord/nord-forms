/** @format */

import { createDirective, grain, readonly } from '@grainular/nord';
import { ControlInit } from '../../types/control-init';
import { Control } from '../../types/control';
import { ControlError } from '../../types/control-error';
import { isNonNull } from '../../utils/is-non-null';
import { Validator } from '../../types/validator';
import { ControlTypes } from '../../types/control-types';

// Convert element value -> grain value
const parseValueByTarget = (control: Control<any>, target: HTMLInputElement) => {
    const ignored = ['button', 'image', 'file', 'reset', 'hidden', 'submit'];
    const { type } = target;

    if (ignored.includes(type)) {
        console.warn(
            `[Nørd:Forms]: Input of type '${type}' is not supported as input directive type and may not work as intended.`
        );
        return;
    }

    switch (type) {
        case 'radio':
            // radio is a special kind of input, that needs to change values on parentElement inputs
            const controls = Object.entries(control.parentGroup ?? {}).filter(
                ([_, _c]) => _c.type === control.type && _c.name === control.name && _c !== control
            );
            // Setting the value via the parent group means the value is updated only once
            control.parentGroup?.setValue({
                [`${control.controlName}`]: true,
                ...Object.fromEntries(controls.map(([name]) => [name, false])),
            });
        case 'checkbox':
            control.setValue(target.checked);
            break;
        case 'number':
        case 'range':
            control.setValue(Number(target.value));
            break;
        // encompasses all cases not handled prior
        default:
            control.setValue(target.value);
            break;
    }
};

const setValueByTarget = (control: Control<any>, target: HTMLInputElement, value: any) => {
    const ignored = ['button', 'image', 'file', 'reset', 'hidden', 'submit'];
    const { type } = target;

    if (ignored.includes(type)) {
        console.warn(
            `[Nørd:Forms]: Input of type '${type}' is not supported as input directive type and may not work as intended.`
        );
        return target.value;
    }

    switch (type) {
        case 'radio':
        case 'checkbox':
            target.checked = value;
            break;
        // encompasses all not previously handled cases
        default:
            target.value = value;
            break;
    }
};

export const createControl = <Type extends ControlTypes>(init: ControlInit<Type>, validators?: Validator[]) => {
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
    let inputElement: HTMLInputElement | null = null;
    setProperty('nativeElement', { get: () => inputElement });

    // Set up value
    const _value = grain<Type | null>(init.value ?? null);
    setProperty('value', { value: _value });
    setProperty('setValue', { value: (value: Type | null) => _value.set(value) });

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

            // handle name & type property
            setProperty('name', { value: inputElement.getAttribute('name') });
            setProperty('type', { value: inputElement.getAttribute('type') });

            // Set up the two way binding
            _value.subscribe((value) => {
                if (inputElement) {
                    setValueByTarget(control as Control<Type>, inputElement, value);
                }
            });

            element.addEventListener(`input`, (ev) => {
                if (ev.currentTarget) {
                    const target = ev.currentTarget as HTMLInputElement;
                    parseValueByTarget(control as Control<Type>, target);
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
    const _validators = [...(validators ?? [])];
    setProperty('validators', { get: () => _validators });
    setProperty('addValidator', { value: (...validator: Validator[]) => _validators.push(...validator) });
    setProperty('removeValidator', {
        value: (validator: Validator) => {
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
