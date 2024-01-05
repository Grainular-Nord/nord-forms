/** @format */

import { Validator } from '../../types/validator';

export const required: Validator<any> = (value: any) => {
    if (value === null || value === undefined) {
        return {
            required: true,
        };
    }

    return null;
};
