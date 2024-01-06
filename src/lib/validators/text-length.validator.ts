/** @format */

import { Validator } from '../../types/validator';

export const textLength = ({ min, max }: { min?: number; max?: number }): Validator<string> => {
    return (value) => {
        if (value === null) {
            return null;
        }

        if (min && value.length < min) {
            return {
                textLength: true,
            };
        }

        if (max && value.length > max) {
            return {
                textLength: true,
            };
        }

        return null;
    };
};
