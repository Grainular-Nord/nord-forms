/** @format */

type InferControlType<T> = T extends Control<infer U> ? U : T extends ControlGroup<infer V> ? ControlValues<V> : never;
export type ControlValues<Controls extends GroupControls> = {
    [Key in keyof Controls]: InferControlType<Controls[Key]>;
};
