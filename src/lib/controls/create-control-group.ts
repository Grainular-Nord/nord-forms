/** @format */

import { combined, createDirective, grain, readonly } from '@grainular/nord';
import { ControlGroup } from '../../types/control-group';
import { GroupControls } from '../../types/group-controls';
import { FormActions } from '../../types/form-actions';
import { ControlValues } from '../../types/control-values';
import { Validator } from '../../types/validator';
import { noop } from '../../utils/noop';
import { ControlError } from '../../types/control-error';
import { isNonNull } from '../../utils/is-non-null';

export const createControlGroup = <Controls extends GroupControls>(controls: Controls, validators?: Validator[]) => {
    const group = {};
    const controlNames = Object.keys(controls);
    const setProperty = (name: keyof ControlGroup<Controls>, descriptor: PropertyDescriptor) => {
        Object.defineProperty(group, name, { ...descriptor, ...(descriptor.value ? { writable: false } : {}) });
    };

    const _value = grain(
        Object.fromEntries(Object.entries(controls).map(([name, control]) => [name, control.value()]))
    );
    setProperty('value', { value: readonly(_value) });
    setProperty('rawValue', { get: () => _value() });
    const setValue = (values: Partial<ControlValues<Controls>>) => {
        _value.update((state) => {
            return {
                ...state,
                ...Object.fromEntries(Object.entries(values).filter(([name]) => !(name in controlNames))),
            };
        });
    };
    setProperty('setValue', { value: setValue });

    // Process the group controls
    Object.entries(controls).forEach(([name, control]) => {
        // Add all child controls under their respective name, so that they can be accessed
        (group as any)[name] = control;

        // Connect the passed controls to the group value, by subscribing to each one
        // and whenever the properties are changed, the group value is also changed
        // This is done, so that it is possible to subscribe to the group value
        control.value.subscribe((value) => {
            const partial = { [name]: value } as Partial<ControlValues<Controls>>;
            setValue(partial);

            ///@todo -> handle unsubscriber
        });
    });

    setProperty('handle', {
        value: (formActions?: FormActions) =>
            createDirective((element) => {
                if (!(element instanceof HTMLFormElement)) {
                    console.warn(
                        '[Nørd:Forms]: The element the ControlGroup has been attached to is not a Form element'
                    );
                    return;
                }

                const { onSubmit, onReset } = formActions ?? {};

                if (onSubmit) {
                    element.addEventListener('submit', (event) => {
                        // prevent the default submit action
                        event.preventDefault();

                        onSubmit(event);
                    });
                }

                if (onReset) {
                    element.addEventListener('reset', (event) => {
                        // prevent the default reset action
                        event.preventDefault();

                        onReset(event);
                    });
                }
            }),
    });

    // Set up derived control state
    const _touched = combined(
        [readonly(grain(false)), ...Object.values(controls).map((control) => control.touched)],
        (touchStates) => touchStates.slice(1).some((state) => state === true)
    );
    // avoid lazy subscription issues
    _touched.subscribe(noop);
    setProperty('touched', { value: _touched });
    setProperty('isTouched', { get: () => _touched() });

    const _focused = combined(
        [readonly(grain(false)), ...Object.values(controls).map((control) => control.focused)],
        (focusStates) => focusStates.slice(1).some((state) => state === true)
    );
    // avoid lazy subscription issues
    _focused.subscribe(noop);
    setProperty('focused', { value: _focused });
    setProperty('isFocused', { get: () => _focused() });

    // Set up validation engine
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

    const _isGroupValid = grain<boolean>(true);
    const _valid = combined(
        [_isGroupValid, ...Object.values(controls).map((control) => control.valid)],
        (validityStates) => validityStates.every((state) => state === true)
    );
    // avoid lazy subscription issues
    _valid.subscribe(noop);
    setProperty('valid', { value: _valid });
    setProperty('isValid', { get: () => _valid() });

    const _errors = grain<ControlError>({});
    setProperty('errors', { value: readonly(_errors) });

    // Subscribe to the value to track the validity by passing the value through every
    // registered validator
    _value.subscribe((changedValue) => {
        if (!_validators.length) {
            _isGroupValid.set(true);
            return;
        }

        const validatorErrors: (null | ControlError)[] = _validators.map((validator) => validator(changedValue));
        _errors.set(validatorErrors.filter(isNonNull).reduce((cur, acc) => ({ ...cur, ...acc }), {}));
        _isGroupValid.set(validatorErrors.every((value) => value === null));
    });

    // Reset
    setProperty('reset', {
        value: () => {
            controlNames.forEach((name) => {
                const control = (group as ControlGroup<Controls>)[name];
                if (control) {
                    control.reset();
                }
            });
        },
    });

    return group as ControlGroup<Controls>;
};
