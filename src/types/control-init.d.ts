/** @format */

export type ControlInit<Type> = {
    value: Type | null;
    validators?: Validator[];
    disabled?: boolean;
    formatter?: (value: string | null) => Type | null;
    handleOnFocus?: (ev: FocusEvent) => void;
    handleOnBlur?: (ev: FocusEvent) => void;
};
