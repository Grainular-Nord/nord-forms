/** @format */

import { Control } from './control';
import { ControlGroup } from './control-group';

export type GroupControls = {
    [key: string]: Control<any> | ControlGroup<any>;
};
