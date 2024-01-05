/** @format */

import { ControlError } from './control-error';

export type Validator<Type extends any> = (value: Type) => null | ControlError;
