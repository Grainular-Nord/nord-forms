/** @format */

import { Directive, ReadonlyGrain } from '@grainular/nord';
import { ControlGroup } from './control-group';
import { ControlValues } from './control-values';

export type ControlList<ControlSchema extends ControlGroup<any>> = {
    readonly value: ReadonlyGrain<ControlValues<Controls>[]>;
    readonly rawValue: ControlValues<Controls>[];
    readonly list: (run: (item: ControlSchema, index: number) => NodeList) => Directive<Text>;
    readonly reset: () => void;
    readonly touched: ReadonlyGrain<boolean>;
    readonly isTouched: boolean;
    readonly focused: ReadonlyGrain<boolean>;
    readonly isFocused: boolean;

    // Validation Properties
    readonly valid: ReadonlyGrain<boolean>;
    readonly isValid: boolean;
    readonly validators: Validator[];
    readonly addValidator: (...validator: Validator[]) => void;
    readonly removeValidator: (validator: Validator) => void;
    readonly errors: ReadonlyGrain<ControlError>;

    // Implementing iterator methods
    readonly add: (...items: ControlSchema[]) => void;
    readonly set: (index: number, item: ControlSchema) => void;
    readonly remove: (item: ControlSchema) => void;
    readonly removeAt: (index: number) => void;
    readonly at: (index: number) => ControlSchema | undefined;
    readonly entries: () => ControlSchema[];
};