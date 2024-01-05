/** @format */

import { ReadonlyGrain } from '@grainular/nord';
import { Validator } from './validator';
import { ControlError } from './control-error';
import { ControlGroup } from './control-group';
import { ControlTypes } from './control-types';

export type Control<Type extends ControlTypes> = {
    readonly control: Directive<Element>;
    readonly id: string;
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
    readonly validators: Validator<Type>[];
    readonly addValidator: (...validator: Validator<Type>[]) => void;
    readonly removeValidator: (validator: Validator<Type>) => void;
    readonly errors: ReadonlyGrain<ControlError>;
    readonly reset: () => void;
    readonly nativeElement: HTMLInputElement | null;
};
