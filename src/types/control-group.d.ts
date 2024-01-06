/** @format */

import { ReadonlyGrain } from '@grainular/nord';
import { Control } from './control';
import { ControlValues } from './control-values';
import { GroupControls } from './group-controls';
import { FormActions } from './form-actions';
import { Validator } from './validator';
/**
 * Represents a group of controls, allowing you to manage and interact with multiple controls as a single unit.
 *
 * @template Controls - The schema of controls within the group.
 */
export type ControlGroup<Controls extends GroupControls> = {
    /**
     * @readonly
     * @type { string } -
     *
     * The unique identifier of the ControlGroup. This ID is typically set during creation
     * and can be used to uniquely identify the ControlGroup.
     */
    readonly id: string;

    /**
     * @readonly
     * @type { ReadonlyGrain<ControlValues<Controls>> } -
     *
     * A reactive grain representing the values of all controls within the ControlGroup.
     * Changes in the values of controls are reflected in this grain.
     */
    readonly value: ReadonlyGrain<ControlValues<Controls>>;

    /**
     * @readonly
     * @type { ControlValues<Controls> } -
     *
     * The current raw values of all controls within the ControlGroup.
     */
    readonly rawValue: ControlValues<Controls>;

    /**
     * @type { ControlGroup<any> | undefined } -
     *
     * The parent ControlGroup of the ControlGroup, if nested within another ControlGroup.
     */
    parentGroup: ControlGroup<any> | undefined;

    /**
     * @type { string | undefined } -
     *
     * The control name associated with the ControlGroup, if used within a ControlGroup.
     */
    controlName: string | undefined;

    /**
     * @readonly
     * @type { (values: Partial<ControlValues<Controls>>) => void } -
     *
     * A method to set the values of controls within the ControlGroup.
     * You can provide partial values to update specific controls.
     */
    readonly setValue: (values: Partial<ControlValues<Controls>>) => void;

    /**
     * @readonly
     * @type { ReadonlyGrain<boolean> } -
     *
     * Indicates whether any of the controls within the ControlGroup have been touched (interacted with by the user).
     * Can be observed for changes using the `subscribe` method.
     */
    readonly touched: ReadonlyGrain<boolean>;

    /**
     * @readonly
     * @type { boolean } -
     *
     * Indicates whether any of the controls within the ControlGroup are currently touched (interacted with by the user).
     */
    readonly isTouched: boolean;

    /**
     * @readonly
     * @type { ReadonlyGrain<boolean> } -
     *
     * Indicates whether any of the controls within the ControlGroup are focused (have user focus).
     * Can be observed for changes using the `subscribe` method.
     */
    readonly focused: ReadonlyGrain<boolean>;

    /**
     * @readonly
     * @type { boolean } -
     *
     * Indicates whether any of the controls within the ControlGroup are currently focused.
     */
    readonly isFocused: boolean;

    /**
     * @readonly
     * @type { () => void } -
     *
     * Resets all controls within the ControlGroup to their initial state, clearing errors and values.
     */
    readonly reset: () => void;

    /**
     * @readonly
     * @type { (formActions: FormActions) => Directive<Element> } -
     *
     * A method to handle form actions for the ControlGroup, such as submitting or resetting the form.
     * It returns a directive that defines how form actions should be handled.
     */
    readonly handle: (formActions: FormActions) => Directive<Element>;

    /**
     * @readonly
     * @type { ReadonlyGrain<boolean> } -
     *
     * Indicates whether all controls within the ControlGroup are valid (pass all validation checks).
     * Can be observed for changes using the `subscribe` method.
     */
    readonly valid: ReadonlyGrain<boolean>;

    /**
     * @readonly
     * @type { boolean } -
     *
     * Indicates whether all controls within the ControlGroup are currently valid (pass all validation checks).
     */
    readonly isValid: boolean;

    /**
     * @readonly
     * @type { Validator<any[]>[] } -
     *
     * An array of validators associated with the ControlGroup as a whole.
     */
    readonly validators: Validator<any[]>[];

    /**
     * @readonly
     * @type { (...validator: Validator<any[]>) => void } -
     *
     * Adds one or more validators to the ControlGroup.
     */
    readonly addValidator: (...validator: Validator<any[]>) => void;

    /**
     * @readonly
     * @type { (validator: Validator<any[]>) => void } -
     *
     * Removes a validator from the ControlGroup.
     */
    readonly removeValidator: (validator: Validator<any[]>) => void;

    /**
     * @readonly
     * @type { ReadonlyGrain<ControlError> } -
     *
     * An object containing errors associated with the ControlGroup.
     * Can be observed for changes using the `subscribe` method.
     */
    readonly errors: ReadonlyGrain<ControlError>;
} & {
    [Key in keyof Controls]: Controls[Key];
};
