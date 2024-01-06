/**
 * Represents a list of controls grouped together under a common schema.
 * It allows you to manage and interact with a collection of controls as a single unit.
 *
 * @format
 * @template ControlSchema - The schema of controls within the list.
 */

export type ControlList<ControlSchema extends ControlGroup<any>> = {
    /**
     * @readonly
     * @type { string } -
     *
     * The unique identifier of the ControlList. This ID is typically set during creation
     * and can be used to uniquely identify the ControlList.
     */
    readonly id: string;

    /**
     * @readonly
     * @type { ReadonlyGrain<ControlValues<Controls>[]> } -
     *
     * A reactive grain representing the values of all controls within the ControlList.
     * Changes in the values of controls are reflected in this grain.
     */
    readonly value: ReadonlyGrain<ControlValues<Controls>[]>;

    /**
     * @readonly
     * @type { ControlValues<Controls>[] } -
     *
     * The current raw values of all controls within the ControlList.
     */
    readonly rawValue: ControlValues<Controls>[];

    /**
     * @type { ControlGroup<any> | undefined } -
     *
     * The parent ControlGroup of the ControlList, if used inside one.
     */
    parentGroup: ControlGroup<any> | undefined;

    /**
     * @type { string | undefined } -
     *
     * The control name associated with the ControlList, if used within a ControlGroup.
     */
    controlName: string | undefined;

    /**
     * @readonly
     * @type { (run: (item: ControlSchema, index: number) => NodeList) => Directive<Text> } -
     *
     * A method to define how the items within the ControlList should be rendered.
     * This allows you to specify the rendering logic for each item in the list.
     */
    readonly list: (run: (item: ControlSchema, index: number) => NodeList) => Directive<Text>;

    /**
     * @readonly
     * @type { () => void } -
     *
     * Resets all controls within the ControlList to their initial state, clearing errors and values.
     */
    readonly reset: () => void;

    /**
     * @readonly
     * @type { ReadonlyGrain<boolean> } -
     *
     * Indicates whether any of the controls within the ControlList have been touched (interacted with by the user).
     * Can be observed for changes using the `subscribe` method.
     */
    readonly touched: ReadonlyGrain<boolean>;

    /**
     * @readonly
     * @type { boolean } -
     *
     * Indicates whether any of the controls within the ControlList are currently touched (interacted with by the user).
     */
    readonly isTouched: boolean;

    /**
     * @readonly
     * @type { ReadonlyGrain<boolean> } -
     *
     * Indicates whether any of the controls within the ControlList are focused (have user focus).
     * Can be observed for changes using the `subscribe` method.
     */
    readonly focused: ReadonlyGrain<boolean>;

    /**
     * @readonly
     * @type { boolean } -
     *
     * Indicates whether any of the controls within the ControlList are currently focused.
     */
    readonly isFocused: boolean;

    /**
     * @readonly
     * @type { ReadonlyGrain<boolean> } -
     *
     * Indicates whether all controls within the ControlList are valid (pass all validation checks).
     * Can be observed for changes using the `subscribe` method.
     */
    readonly valid: ReadonlyGrain<boolean>;

    /**
     * @readonly
     * @type { boolean } -
     *
     * Indicates whether all controls within the ControlList are currently valid (pass all validation checks).
     */
    readonly isValid: boolean;

    /**
     * @readonly
     * @type { Validator<any[]>[] } -
     *
     * An array of validators associated with the ControlList as a whole.
     */
    readonly validators: Validator<any[]>[];

    /**
     * @readonly
     * @type { (...validator: Validator<any[]>[]) => void } -
     *
     * Adds one or more validators to the ControlList.
     */
    readonly addValidator: (...validator: Validator<any[]>[]) => void;

    /**
     * @readonly
     * @type { (validator: Validator<any[]>) => void } -
     *
     * Removes a validator from the ControlList.
     */
    readonly removeValidator: (validator: Validator<any[]>) => void;

    /**
     * @readonly
     * @type { ReadonlyGrain<ControlError> } -
     *
     * An object containing errors associated with the ControlList.
     * Can be observed for changes using the `subscribe` method.
     */
    readonly errors: ReadonlyGrain<ControlError>;

    /**
     * @readonly
     * @type { (...items: ControlSchema[]) => void } -
     *
     * Adds one or more control items to the ControlList.
     */
    readonly add: (...items: ControlSchema[]) => void;

    /**
     * @readonly
     * @type { (index: number, item: ControlSchema) => void } -
     *
     * Sets a control item at a specific index within the ControlList.
     */
    readonly set: (index: number, item: ControlSchema) => void;

    /**
     * @readonly
     * @type { (item: ControlSchema) => void } -
     *
     * Removes a control item from the ControlList.
     */
    readonly remove: (item: ControlSchema) => void;

    /**
     * @readonly
     * @type { (index: number) => void } -
     *
     * Removes a control item at a specific index within the ControlList.
     */
    readonly removeAt: (index: number) => void;

    /**
     * @readonly
     * @type { (index: number) => ControlSchema | undefined } -
     *
     * Retrieves a control item at a specific index within the ControlList.
     */
    readonly at: (index: number) => ControlSchema | undefined;

    /**
     * @readonly
     * @type { () => ControlSchema[] } -
     *
     * Retrieves an array of all control items within the ControlList.
     */
    readonly entries: () => ControlSchema[];
};
