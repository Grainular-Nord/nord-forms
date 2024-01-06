<!-- @format -->

# @grainular/nord-forms

[![Npm package version](https://badgen.net/npm/v/@grainular/nord-forms)](https://www.npmjs.com/package/@grainular/nord-forms)
[![Npm package total downloads](https://badgen.net/npm/dt/@grainular/nord-forms)](https://npmjs.com/package/@grainular/nord-forms)
[![Npm package license](https://badgen.net/npm/license/@grainular/nord-forms)](https://npmjs.com/package/@grainular/nord-forms)

`@grainular/nord-forms` is a library that simplifies and enhances form handling in [Nørd](https://nordjs.dev) applications. It provides a set of utilities and components to streamline form creation, validation, and submission, making it easier to build interactive and user-friendly forms.

## Installation

You can install `@grainular/nord-forms` using npm or yarn:

```bash
# Using yarn
yarn add @grainular/nord-forms

# Using npm
npm install @grainular/nord-forms
```

## Features

-   `Declarative Form Building`: Forms are built using predefined, abstract building blocks, `Control`, `ControlGroup`, `ControlList`, that all represent a certain set of data structure.
-   `Reactive`: Using `Nørds` grainular reactivity system, controls are full reactive.
-   `Template driven`: Every control hooks directly into the template using predefined control directives.
-   `Typesafe`: All controls are strongly typed.

## Usage

### Creating a form

To create a form using `@grainular/nord-forms`, you can import the necessary components and utilities. Here's an example of how to create a simple form:

```ts
import { createComponent, render } from '@grainular/nord';
import { createControl, createControlGroup } from '@grainular/nord-forms';

const App = createComponent((html) => {
    const form = createControlGroup({
        name: createControl<string>({ value: null }),
    });

    const onSubmit = () => {
        console.log({ value: form.rawValue });
    };

    return html`<form ${form.handle({ onSubmit })}>
        <label>
            Name:
            <input ${form.name.control} type="text" placeholder="Name..." />
        </label>
        <button>Submit</button>
    </form>`;
});

render(App, { target: document.querySelector('#app') });
```

In this example, we import `createControl` and `createControlGroup` from `@grainular/nord-forms` to create a form with a single "name" field. The form handles the submission and logs the form data when the "Submit" button is clicked.

## Building Blocks

`@grainular/nord-forms` provides the following building blocks for creating forms:

### `Control`

The Control represents an individual form control. It allows you to define the control's initial value and manage its state.

### `ControlGroup`

The ControlGroup is used to group multiple Control instances together. It simplifies form management by providing a unified interface for handling multiple form controls.

### `ControlList`

The ControlList enables the creation of dynamic lists of form controls. It's useful for scenarios where you need to manage a variable number of form elements.

## Contributing

Contributions to Nørd are always welcome! Whether it's bug reports, feature requests, or code contributions, please read our [contribution guidelines](./contributing.md) for more information on getting involved.

## License

Nørd-forms is open-sourced software licensed under the MIT License.
