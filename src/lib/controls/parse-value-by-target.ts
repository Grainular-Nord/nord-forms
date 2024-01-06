/** @format */

import { Control } from '../../types';
import { InputElement } from '../../types/input-element';

export const øParseValueByTarget = (control: Control<any>, target: InputElement) => {
    const ignored = ['button', 'image', 'file', 'reset', 'hidden', 'submit'];
    const { type } = target;

    if (ignored.includes(type)) {
        console.warn(
            `[Nørd:Forms]: Input of type '${type}' is not supported as input directive type and may not work as intended.`
        );
        return;
    }

    switch (type) {
        // Normal select works as expected, multi select not
        case 'select-multiple':
            const options = [...target.querySelectorAll('option')] as HTMLOptionElement[];
            const selected = options.filter((opt) => opt.selected).map((opt) => opt.value);
            control.setValue(selected);
            break;
        case 'radio':
            // radio is a special kind of input, that needs to change values on parentElement inputs
            const controls = Object.entries(control.parentGroup ?? {}).filter(
                ([_, _c]) => _c.type === control.type && _c.name === control.name && _c !== control
            );
            // Setting the value via the parent group means the value is updated only once
            control.parentGroup?.setValue({
                [`${control.controlName}`]: true,
                ...Object.fromEntries(controls.map(([name]) => [name, false])),
            });
        case 'checkbox':
            control.setValue((target as HTMLInputElement).checked);
            break;
        case 'number':
        case 'range':
            control.setValue(Number(target.value));
            break;
        // encompasses all cases not handled prior
        default:
            control.setValue(target.value);
            break;
    }
};
