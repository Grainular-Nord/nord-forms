/** @format */

/**
 * @type {ControlInit}
 * @template {Type} - the Type of the Control
 *
 * Properties used to configure a control during creation.
 */

export type ControlInit<Type> = {
    /**
     * @type { Type | null }
     *
     * The initial value of the control. Set to null if the control should be empty. Values that are set here will be set inside the connected control.
     */
    value: Type | null;
    /**
     * @optional
     * @type { boolean }
     *
     * flag indicating if the control should be disabled
     */
    disabled?: boolean;
    /**
     * @optional
     * @type { (ev: FocusEvent) => void }
     * @param { FocusEvent } ev
     *
     * Function to be executed when the control receives focus
     */
    handleOnFocus?: (ev: FocusEvent) => void;
    /**
     * @optional
     * @type { (ev: FocusEvent) => void }
     * @param { FocusEvent } ev
     *
     * Function to be executed when the control loses focus
     */
    handleOnBlur?: (ev: FocusEvent) => void;
};
