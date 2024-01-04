/** @format */

import { Validator } from '../../types/validator';

export const required: Validator = (value: any) => {
    if (value === null || value === undefined) {
        return {
            required: true,
        };
    }

    return null;
};
