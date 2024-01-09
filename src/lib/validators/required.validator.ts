/** @format */

import { Validator } from '../../types/validator';

export const required: Validator<any> = (value: any) => {
    if (value === null || value === undefined || value === '') {
        return {
            required: true,
        };
    }

    return null;
};
