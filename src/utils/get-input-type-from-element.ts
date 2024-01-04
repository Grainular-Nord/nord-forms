/** @format */

export const getInputTypeFromElement = (element: HTMLInputElement): 'string' | 'boolean' | 'number' => {
    if (!element.hasAttribute('type')) {
        console.warn("[Nørd:Forms]: Input does not have a 'type' attribute, value will not be inferred.");
        return 'string';
    }

    const type = element.getAttribute('type') ?? 'text';
    switch (type) {
        case 'number':
            return 'number';
        case 'checkbox':
        case 'radio':
            return 'boolean';
        case 'text':
        default:
            return 'string';
    }
};
