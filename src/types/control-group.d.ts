/** @format */

import { ReadonlyGrain } from '@grainular/nord';
import { Control } from './control';
import { ControlValues } from './control-values';
import { GroupControls } from './group-controls';
import { FormActions } from './form-actions';
import { Validator } from './validator';

export type ControlGroup<Controls extends GroupControls> = {
    /**
     * @readonly
     * @type { string } -
     *
     * The id of the Control. Value is set during the creation of the control and can be used to uniquely identify the control.
     */
    readonly id: string;
    readonly value: ReadonlyGrain<ControlValues<Controls>>;
    readonly rawValue: ControlValues<Controls>;
    parentGroup: ControlGroup<any> | undefined;
    controlName: string | undefined;
    readonly setValue: (values: Partial<ControlValues<Controls>>) => void;
    readonly touched: ReadonlyGrain<boolean>;
    readonly isTouched: boolean;
    readonly focused: ReadonlyGrain<boolean>;
    readonly isFocused: boolean;
    readonly reset: () => void;
    readonly handle: (formActions: FormActions) => Directive<Element>;
    readonly valid: ReadonlyGrain<boolean>;
    readonly isValid: boolean;
    readonly validators: Validator<any>[];
    readonly addValidator: (...validator: Validator<any>[]) => void;
    readonly removeValidator: (validator: Validator<any>) => void;
    readonly errors: ReadonlyGrain<ControlError>;
} & {
    [Key in keyof Controls]: Controls[Key];
};
