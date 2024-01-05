/** @format */

import { ReadonlyGrain } from '@grainular/nord';
import { Validator } from './validator';
import { ControlError } from './control-error';
import { ControlGroup } from './control-group';

export type Control<Type> = {
    readonly control: Directive<Element>;
    parentGroup: ControlGroup<any> | undefined;
    controlName: string | undefined;
    name: string | undefined;
    type: string | undefined;
    readonly value: ReadonlyGrain<Type | null>;
    readonly setValue: (value: Type | null) => void;
    readonly touched: ReadonlyGrain<boolean>;
    readonly isTouched: boolean;
    readonly disabled: ReadonlyGrain<boolean>;
    readonly isDisabled: boolean;
    readonly disable: () => void;
    readonly enable: () => void;
    readonly focused: ReadonlyGrain<boolean>;
    readonly isFocused: boolean;
    readonly registerOnFocus: (handler: (event: FocusEvent) => void) => void;
    readonly registerOnBlur: (handler: (event: FocusEvent) => void) => void;
    readonly valid: ReadonlyGrain<boolean>;
    readonly isValid: boolean;
    readonly validators: Validator[];
    readonly addValidator: (...validator: Validator[]) => void;
    readonly removeValidator: (validator: Validator) => void;
    readonly errors: ReadonlyGrain<ControlError>;
    readonly reset: () => void;
    readonly nativeElement: HTMLInputElement | null;
};
