/** @format */

import { Validator } from '../../types/validator';

export const minLength =
    (amount: number): Validator<any[]> =>
    (controls: any[]) => {
        if (!controls) {
            return null;
        }

        if (Array.isArray(controls) && controls.length < amount) {
            return { minLength: true };
        }

        return null;
    };
