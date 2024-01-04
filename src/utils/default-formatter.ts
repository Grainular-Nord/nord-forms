/** @format */

import { ControlTypes } from '../types/control-types';
const _primitives = new Map([
    ['true', true],
    ['false', false],
    ['null', null],
    ['undefined', undefined],
]);

export const defaultFormatter = <Type extends ControlTypes>(value: string) => {
    if (_primitives.has(value)) {
        return (_primitives.get(value) as Type) ?? null;
    }

    if (/^-?\d+(\.\d+)?$/gim.test(value.trim())) {
        return Number(value.trim()) as Type;
    }

    return value as Type;
};
