/** @format */

import { Control } from './control';
import { ControlGroup } from './control-group';
import { ControlList } from './control-list';

export type GroupControls = {
    [key: string]: Control<any> | ControlGroup<any> | ControlList<any>;
};
