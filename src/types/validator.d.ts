/** @format */

import { ControlError } from './control-error';

export type Validator = (value: any) => null | ControlError;
