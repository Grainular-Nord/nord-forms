/** @format */

import { combined, derived, each, grain, mapped, merged, readonly } from '@grainular/nord';
import { ControlError, ControlGroup, ControlList } from '../../types';
import { Validator } from '../../types/validator';
import { isNonNull } from '../../utils/is-non-null';

/**
 * Creates a control list that manages a collection of controls, allowing you to interact with them as a list.
 *
 * @template ControlSchema - The schema of controls within the list.
 *
 * @param {ControlSchema[]} [initial=[]] - An optional initial array of control schemas to initialize the list.
 * @param {Validator<any[]>[]} [validators] - An optional array of validators to apply to the control list.
 *
 * @returns {ControlList<ControlSchema>} A ControlList object that represents the collection of controls.
 *
 * @example
 * // Create a control list with two controls and validators.
 * const list = createControlList([createControlGroup({
 *   name: createControl({ value: null })
 * })], [customValidator()]);
 *
 * // Access and manipulate controls within the list.
 * const item = list.at(0); // Get the control at index 0
 * list.removeAt(1); // Remove the control at index 1
 * list.add(
 *  createControlGroup({
 *      name: createControl({value: null})
 *  })
 * ); // Add a new control to the list
 *
 * // Check the validity of the entire list.
 * const isListValid = list.isValid;
 *
 * // Iterate through the controls in the list.
 * const entries = list.entries();
 */

export const createControlList = <ControlSchema extends ControlGroup<any>>(
    initial: ControlSchema[] | never[] = [],
    validators?: Validator<any[]>[]
) => {
    const list = {};
    const _controls = grain<ControlSchema[]>(initial);
    const setProperty = (name: keyof ControlList<ControlSchema>, descriptor: PropertyDescriptor) => {
        Object.defineProperty(list, name, { ...descriptor, ...(descriptor.value ? { writable: false } : {}) });
    };

    setProperty(`id`, { value: `ø-${crypto.randomUUID().slice(0, 5)}` });
    const _value = merged(
        derived(_controls, (controls) => {
            return mapped(controls.map((control) => control.value));
        })
    );
    setProperty('value', { value: _value });
    setProperty('rawValue', { get: () => _value() });

    // Create the primary directive used to render the control list
    setProperty('list', {
        value: (run: (entry: ControlSchema, index: number) => NodeList) => {
            return each(_controls).as(run);
        },
    });

    // Set up derived control state
    const _itemsTouched = merged(derived(_controls, (controls) => mapped(controls.map((control) => control.touched))));
    const _touched = derived(_itemsTouched, (touchStates) => touchStates.some(Boolean));
    setProperty('touched', { value: _touched });
    setProperty('isTouched', { get: () => _touched() });

    const _itemsFocused = merged(derived(_controls, (controls) => mapped(controls.map((control) => control.focused))));
    const _focused = derived(_itemsFocused, (focusStates) => focusStates.some(Boolean));
    setProperty('focused', { value: _focused });
    setProperty('isFocused', { get: () => _focused() });

    // Set up validation engine
    const _validators = [...(validators ?? [])];
    setProperty('validators', { get: () => _validators });
    setProperty('addValidator', { value: (...validator: Validator<any[]>[]) => _validators.push(...validator) });
    setProperty('removeValidator', {
        value: (validator: Validator<any[]>) => {
            const idx = _validators.indexOf(validator);
            if (idx !== -1) {
                _validators.splice(idx, 1);
            }
        },
    });

    const _isListValid = grain<boolean>(true);
    const _itemsValid = merged(derived(_controls, (controls) => mapped(controls.map((control) => control.valid))));
    const _valid = combined([_isListValid, _itemsValid], (states) => states.flat().every(Boolean));
    setProperty('valid', { value: _valid });
    setProperty('isValid', { get: () => _valid() });

    const _errors = grain<ControlError>({});
    setProperty('errors', { value: readonly(_errors) });

    // Subscribe to the value to track the validity by passing the value through every
    // registered validator
    _value.subscribe((changedValue) => {
        if (!_validators.length) {
            _isListValid.set(true);
            return;
        }

        const validatorErrors: (null | ControlError)[] = _validators.map((validator) => validator(changedValue));
        _errors.set(validatorErrors.filter(isNonNull).reduce((cur, acc) => ({ ...cur, ...acc }), {}));
        _isListValid.set(validatorErrors.every((value) => value === null));
    });

    // Set up reset handle
    setProperty('reset', {
        value: () => {
            _controls.set([]);
        },
    });

    // Set up iterable methods

    // Entries returns the current entries of the list
    setProperty('entries', { value: () => _controls() });

    // At returns an item at a specified index
    setProperty('at', {
        value: (index: number) => {
            return _controls().at(index);
        },
    });

    // RemoveAt & removes are methods that remove an item at a specified index or a specified element
    setProperty('removeAt', {
        value: (index: number) => {
            _controls.update((curr) => {
                const newArr = [...curr];
                newArr.splice(index, 1);
                return newArr;
            });
        },
    });

    setProperty('remove', {
        value: (value: ControlSchema) => {
            _controls.update((curr) => [...curr].filter((item) => item !== value));
        },
    });

    // Set & Add are methods to add to the array, either by pushing or by setting at a specified index
    setProperty('set', {
        value: (index: number, value: ControlSchema) => {
            _controls.update((curr) => {
                const newArr = [...curr];
                newArr.splice(index, 0, value);
                return newArr;
            });
        },
    });

    setProperty('add', {
        value: (...value: ControlSchema[]) => {
            _controls.update((curr) => [...curr, ...value]);
        },
    });

    return list as ControlList<ControlSchema>;
};
