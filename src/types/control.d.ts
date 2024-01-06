/** @format */

import { Directive, ReadonlyGrain } from '@grainular/nord';
import { Validator } from './validator';
import { ControlError } from './control-error';
import { ControlGroup } from './control-group';
import { ControlTypes } from './control-types';

/**
 * A Control created using the `createControl` function.
 */
export type Control<Type extends ControlTypes> = {
    /**
     * @readonly
     * @type { Directive<Element> } -
     *
     *  The `control` Directive of the `Control`. Used to connect the control to a `HTMLInputElement`to create a two way  binding
     */
    readonly control: Directive<Element>;
    /**
     * @readonly
     * @type { string } -
     *
     * The id of the Control. Value is set during the creation of the control and can be used to uniquely identify the control.
     */
    readonly id: string;
    /**
     * @type { ControlGroup<any> | undefined } -
     *
     * The `ControlGroup` of the `Control`, if used inside one.
     */
    parentGroup: ControlGroup<any> | undefined;
    /**
     * @type { string| undefined } -
     *
     * The `propertyName` of the `Control`, if used inside a `ControlGroup`.
     */
    controlName: string | undefined;
    /**
     * @type {string | undefined} -
     *
     * The `name` attribute of the control, if set on the `HTMLInputElement`
     */
    name: string | undefined;
    /**
     * @type {string | undefined} -
     *
     * The `type` attribute of the control, if set on the `HTMLInputElement`
     */
    type: string | undefined;
    /**
     * @readonly
     * @type { ReadonlyGrain<Type | null> } -
     *
     * The value of the `Control` accessible as Grain. Can be used to track changes in the value via the `subscribe` method.
     */
    readonly value: ReadonlyGrain<Type | null>;
    /**
     * @readonly
     * @type { Type | null} -
     *
     * The raw value of the `Control` at the current moment.
     */
    readonly rawValue: Type | null;
    /**
     * @readonly
     * @type { (value: Type | null) => void} -
     *
     * A method to set the value of the `Control`.
     */
    readonly setValue: (value: Type | null) => void;
    /**
     * @readonly
     * @type { ReadonlyGrain<boolean> } -
     *
     * Indicates whether the `Control` has been touched (interacted with by the user).
     * Can be observed for changes using the `subscribe` method.
     */
    readonly touched: ReadonlyGrain<boolean>;

    /**
     * @readonly
     * @type { boolean } -
     *
     * Indicates whether the `Control` is currently touched (interacted with by the user).
     */
    readonly isTouched: boolean;

    /**
     * @readonly
     * @type { ReadonlyGrain<boolean> } -
     *
     * Indicates whether the `Control` is disabled.
     * Can be observed for changes using the `subscribe` method.
     */
    readonly disabled: ReadonlyGrain<boolean>;

    /**
     * @readonly
     * @type { boolean } -
     *
     * Indicates whether the `Control` is currently disabled.
     */
    readonly isDisabled: boolean;

    /**
     * @readonly
     * @type { () => void } -
     *
     * Disables the `Control`.
     */
    readonly disable: () => void;

    /**
     * @readonly
     * @type { () => void } -
     *
     * Enables the `Control`.
     */
    readonly enable: () => void;

    /**
     * @readonly
     * @type { ReadonlyGrain<boolean> } -
     *
     * Indicates whether the `Control` is focused (has user focus).
     * Can be observed for changes using the `subscribe` method.
     */
    readonly focused: ReadonlyGrain<boolean>;

    /**
     * @readonly
     * @type { boolean } -
     *
     * Indicates whether the `Control` is currently focused.
     */
    readonly isFocused: boolean;

    /**
     * @readonly
     * @type { (handler: (event: FocusEvent) => void) => void } -
     *
     * Registers a callback function to be executed when the `Control` gains focus.
     */
    readonly registerOnFocus: (handler: (event: FocusEvent) => void) => void;

    /**
     * @readonly
     * @type { (handler: (event: FocusEvent) => void) => void } -
     *
     * Registers a callback function to be executed when the `Control` loses focus.
     */
    readonly registerOnBlur: (handler: (event: FocusEvent) => void) => void;

    /**
     * @readonly
     * @type { ReadonlyGrain<boolean> } -
     *
     * Indicates whether the `Control` is valid (passes all validation checks).
     * Can be observed for changes using the `subscribe` method.
     */
    readonly valid: ReadonlyGrain<boolean>;

    /**
     * @readonly
     * @type { boolean } -
     *
     * Indicates whether the `Control` is currently valid (passes all validation checks).
     */
    readonly isValid: boolean;

    /**
     * @readonly
     * @type { Validator<Type>[] } -
     *
     * An array of validators associated with the `Control`.
     */
    readonly validators: Validator<Type>[];

    /**
     * @readonly
     * @type { (...validator: Validator<Type>[]) => void } -
     *
     * Adds one or more validators to the `Control`.
     */
    readonly addValidator: (...validator: Validator<Type>[]) => void;

    /**
     * @readonly
     * @type { (validator: Validator<Type>) => void } -
     *
     * Removes a validator from the `Control`.
     */
    readonly removeValidator: (validator: Validator<Type>) => void;

    /**
     * @readonly
     * @type { ReadonlyGrain<ControlError> } -
     *
     * An object containing errors associated with the `Control`.
     * Can be observed for changes using the `subscribe` method.
     */
    readonly errors: ReadonlyGrain<ControlError>;

    /**
     * @readonly
     * @type { () => void } -
     *
     * Resets the `Control` to its initial state, clearing errors and values.
     */
    readonly reset: () => void;

    /**
     * @readonly
     * @type { HTMLInputElement | null } -
     *
     * The native HTMLInputElement associated with the `Control`.
     */
    readonly nativeElement: HTMLInputElement | null;
};
