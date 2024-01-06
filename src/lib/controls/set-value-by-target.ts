/** @format */

import { InputElement } from '../../types/input-element';

export const øSetValueByTarget = (value: any, target: InputElement) => {
    const ignored = ['button', 'image', 'file', 'reset', 'hidden', 'submit'];
    const { type } = target;

    if (ignored.includes(type)) {
        console.warn(
            `[Nørd:Forms]: Input of type '${type}' is not supported as input directive type and may not work as intended.`
        );
        return;
    }

    switch (type) {
        case 'select-multiple':
            const _values = [value].flat();
            const options = [...target.querySelectorAll('option')] as HTMLOptionElement[];
            options.forEach((opt) => (opt.selected = _values.includes(opt.value)));
            break;
        case 'radio':
        case 'checkbox':
            (target as HTMLInputElement).checked = value;
            break;
        // encompasses all not previously handled cases
        default:
            target.value = value;
            break;
    }
};
