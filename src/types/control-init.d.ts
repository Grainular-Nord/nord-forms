/** @format */

export type ControlInit<Type> = {
    value: Type | null;
    validators?: Validator[];
    disabled?: boolean;
    handleOnFocus?: (ev: FocusEvent) => void;
    handleOnBlur?: (ev: FocusEvent) => void;
};
