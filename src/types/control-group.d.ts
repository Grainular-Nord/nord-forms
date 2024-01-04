/** @format */

import { ReadonlyGrain } from '@grainular/nord';
import { Control } from './control';
import { ControlValues } from './control-values';
import { GroupControls } from './group-controls';
import { FormActions } from './form-actions';

export type ControlGroup<Controls extends GroupControls> = {
    readonly value: ReadonlyGrain<ControlValues<Controls>>;
    readonly rawValue: ControlValues<Controls>;
    readonly setValue: (values: Partial<ControlValues<Controls>>) => void;
    readonly touched: ReadonlyGrain<boolean>;
    readonly isTouched: boolean;
    readonly focused: ReadonlyGrain<boolean>;
    readonly isFocused: boolean;
    readonly reset: () => void;
    readonly handle: (formActions: FormActions) => Directive<Element>;
    readonly valid: ReadonlyGrain<boolean>;
    readonly isValid: boolean;
    readonly validators: Validator[];
    readonly addValidator: (...validator: Validator[]) => void;
    readonly removeValidator: (validator: Validator) => void;
    readonly errors: ReadonlyGrain<ControlError>;
} & {
    [Key in keyof Controls]: Controls[Key];
};
