/** @format */

export type ControlInit<Type> = {
    value: Type | null;
    disabled?: boolean;
    handleOnFocus?: (ev: FocusEvent) => void;
    handleOnBlur?: (ev: FocusEvent) => void;
};
