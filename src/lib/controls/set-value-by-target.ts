/** @format */

export const øSetValueByTarget = (value: any, target: HTMLInputElement) => {
    const ignored = ['button', 'image', 'file', 'reset', 'hidden', 'submit'];
    const { type } = target;

    if (ignored.includes(type)) {
        console.warn(
            `[Nørd:Forms]: Input of type '${type}' is not supported as input directive type and may not work as intended.`
        );
        return;
    }

    switch (type) {
        case 'radio':
        case 'checkbox':
            target.checked = value;
            break;
        // encompasses all not previously handled cases
        default:
            target.value = value;
            break;
    }
};
