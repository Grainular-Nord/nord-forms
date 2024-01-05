/** @format */

import { Validator } from '../../types/validator';

export const maxLength =
    (amount: number): Validator<any[]> =>
    (controls: any[]) => {
        if (!controls) {
            return null;
        }

        if (Array.isArray(controls) && controls.length > amount) {
            return { maxLength: true };
        }

        return null;
    };
