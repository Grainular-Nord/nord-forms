/** @format */

import { Validator } from '../../types/validator';

export const isEmail: Validator<string> = (value) => {
    if (value === null) {
        return null;
    }

    // Regular expression for validating an email address
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(value)) {
        return {
            email: true,
        };
    }

    return null;
};
