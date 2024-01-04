/** @format */

import { ReadonlyGrain } from '@grainular/nord';
import { Validator } from './validator';
import { ControlError } from './control-error';

export type Control<Type> = {
    readonly control: Directive<Element>;
    readonly value: ReadonlyGrain<Type | null>;
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
    readonly errors: ControlError;
    readonly reset: () => void;
    readonly nativeElement: HTMLInputElement | null;
};
