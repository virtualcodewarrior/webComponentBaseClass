# WebComponentBaseClass
Library to simplify web component creation and reduce repetitive code for web components.
I love web components, but some of it can be a bit cumbersome or repetitive to write especially if you want to use shadow dom.
This library was created to simplify some of its creation and add some simple helper functions and objects to work with them after creation.
This library doesn't add any fancy data binding features to keep it simple as I personally don't really like it to hide away the way data transfers between
the DOM and JavaScript. Some helper functions are inspired by polymer.

## Production
The following steps can be used to install for production
### Installation
```bash
npm install web-component-base-class
```

## Development
The following steps can be used if you want to develop on this library
### Installation
Clone the git repo
```bash
git clone https://github.com/virtualcodewarrior/webComponentBaseClass.git
```
Install dev dependencies
```bash
npm install
```
### Build
Building is only needed to minify this library.
The following command will minify the src files and put them in a dist folder:
```bash
npm run build
```
### Manual Testing
To manually test the examples you can start a local web server using:
```bash
npm start
```
This will start a web server on your local machine on port 2211. If you want to use another port you can modify package.json and set a different port. Open a browser to http://localhost:2211/examples/ to see the library in action. This uses the minified library output, so you would have to build it first.

### Automatic testing
To run the unit tests once, run
```bash
npm test
```

To run the unit tests in watch mode, run
```bash
npm run watch-test
```

### Generate documentation
```bash
npm run doc
```

## Usage
To use this library you will have to extend your web component class from the exported WebComponentBaseClass:

```javascript
import { WebComponentBaseClass } from '../../src/web-component-base-class.js';

class MyElement extends WebComponentBaseClass {
    #changeHandler;
    constructor() {
        super();
        // extra required initialization goes here ...

        // change observer implementation example for a property
        this.#changeHandler = (newValue, oldValue) => {
            this.$.output.textContent += `The component property 'propertyName' for web component ${this.is}, was changed from ${oldValue} to ${newValue}\n`;
        };
    }

    // here we add some properties to this web component
    static get properties() {
        return {
            propertyName: { // the name of the property
                type: String, // (required) the type of the property, one of Array, Boolean, Number, Object, String
                value: 'value', // (optional) default value for the property
                reflectToAttribute: true, // (optional) indicate if you want the component attribute to always reflect the current property value
                observer: (instance, newValue, oldValue) => instance.#changeHandler(newValue, oldValue), // (optional) the name or symbol of a function or a function object in the class to be called when the value of the property is changed
            },
            // add as many properties as you need
        };
    }

    // optional callback function that will be called after this instance of the web component
    // has been added to the DOM, a good place to add event handlers
    attached() {
        this.addAutoEventListener(this.$.exampleInput, 'change', () => {
            this.$.output.textContent += `The input has changed to ${this.$.exampleInput.value}\n`;
            this.$$$('.exampleElement span').forEach((element, index) => { element.textContent = `${this.$.exampleInput.value} - ${index}`; });
        });
        this.$.output.textContent += `web component ${this.is} was attached to the DOM\n`;

        this.$$('.exampleElement').style.border = '1px solid red';
        this.$$$('.exampleElement span').forEach((element, index) => { element.style.backgroundColor = (index % 2) ? 'green' : 'blue'; });
    }

    // callback function that will be called after this instance of the web component has been removed from the DOM
    // a good place to do any additional needed cleanup
    detached() {
        console.log(`web component ${this.is} was detached from the DOM`);
    }

    // the HTML content for this custom element
    static get template() {
        return `
            <style>
                /* put your styling here */
                .exampleElement {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    margin: 1em;
                }
        
                .exampleElement span {
                    box-sizing: border-box;
                    display: block;
                    position: relative;
                    width: 100%;
                    height: 20px;
                }
        
                #output {
                    box-sizing: border-box;
                    width: 100%;
                    height: 300px;
                    overflow: auto;
                    box-shadow: inset 0 0 6px;
                    padding: 1em;
                }
            </style>
            <!-- The content of the template goes here -->
            <div class="exampleElement">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <input id="exampleInput">
            <pre id="output"></pre>
        `;
    }
}
// register your class as a custom element
window.customElements.define('my-element', MyElement);
```

This library has an example provided which also can be used as a template for creating your own web components.
See the `examples` directory in the repo.

## Utility functions and objects
There is a number of extra utility functions available to you inside the class, to make it easier to write your code.

### $ object
The class has a utility object called `$` which can be accessed from within the class using `this.$`.
The object will contain all the elements that are declared with an 'id' attribute within the template definition of the web component.
For instance when you define the following template content:
```html
<template id="my-element">
    <input id="example-input">
    <pre id="output"></pre>
    <input id="exampleOutput">
    <button id="btn-1"></button>
    <button id="test-button"></button>
    <button id="Bla"></button>
    <div id="some-container">
        <span id="container-content"></span>
    </div>
</template>
```
Then the content of `this.$` will be
```javascript
this.$ = {
    exampleInput: inputElement,
    output: preElement,
    exampleOutput: inputElement,
    btn1: buttonElement,
    testButton: buttonElement,
    Bla: buttonElement,
    someContainer: divElement,
    containerContent: spanElement,
}
```
Note that id's that contain dashes '-' will be converted to camel case to make it easier to access them.
In the code you can use this to directly access those elements without having to re-query them. e.g.

```javascript
    ...
    attached() {
        this.$.containerContent.textContent = "my content"; // this will set the text content of #container-content to 'my content'
    }
    ...
```

If you remove elements with an id or add new elements with an id through code, you should call `this.refreshQuickAccess` to recreate the object.

### $$ function
The `$$(selector)` function is a shorthand function for `this.shadowRoot.querySelector(selector)`. The query is limited to the shadow DOM.
This can be used everywhere you want to do querySelector on the shadowDom only.
For instance calling `const input = this.$$('input');` on the web component template definition used in the previous example, will return
the input element with the id of 'example-input'. If the selector cannot find a match `undefined` will be returned.

### $$$ function
The `$$$(selector)` function is a shorthand for `Array.from(this.shadowRoot.querySelectorAll(selector))`. The query is limited to the shadow DOM.
This can be used everywhere you want to do querySelectorAll on the shadowDom only and want to get back an array instead of an 'array like' object that is normally returned from querySelectorAll. This means you can use forEach and all the other array functions directly on the result. If no objects matching the selector can be found, an empty array will be returned.
e.g.
```javascript
this.$$$('button').forEach((button) => { button.disabled = true; }); // disable all our buttons
```

### addAutoEventListener function
`addAutoEventListener(HTMLElement, EventName, CallbackFunction)`. This function allows you to attach an eventListener to the specified
HTMLElement. Any event listener attached using this function will automatically be cleaned up if the web component gets removed from the DOM
This makes it easier to add closure callback function without having to worry about how you clean them up later.
e.g.
```javascript
attached() {
    this.addAutoEventListener(this.$.testButton, 'click', () => { alert('button clicked'); });
}
```
`addAutoEventListener` will return a cleanup function that you can use to remove the event listener when you are done with it. The advantage of using the returned cleanup function vs the `removeAutoEventListener` function manually is
that you can clean up lambda callbacks that are declared inline

### removeAutoEventListener function
`removeAutoEventListener(HTMLElement, EventName, CallbackFunction)`. This function allows you to clean up an eventListener previously added using the addAutoEventListener function. Of course if you want to use this function you will have to keep track of the element, event name and callback yourself, so you can remove them properly.

### refreshQuickAccess function
call this function to rebuild the map of id to elements after you have manually modified the content of the shadow dom by removing or adding elements that have an id attribute.

## onAttached and onDetached
In some cases it might be useful to know when a web component has been added or removed from the DOM for a script using the web component as opposed to the scripts inside the web component.
If a script needs to do additional things after a web component was added or removed, it can define a function that will be called after a web component has been attached or detached from the DOM.

e.g.
```javascript
const myElement = document.createElement('my-element');
myElement.onAttached = () => {
    // initialize extra stuff here after the element has been added to the DOM
}

myElement.onDetached = () => {
    // cleanup here after the element has been removed from the DOM
}

document.body.appendChild(myElement);

```
If you assign the onAttached function after the component was already attached, the callback will be called immediately.

#breaking changes v1.0.x -> v1.1.x
There are some breaking changes starting at version 1.1.x compared to 1.0.x versions
- The base class is now called `WebComponentBaseClass` where it used to be `webComponentBaseClass` note the capital `W` for the class name.
- The file to import has been renamed to `web-component-base-class.js`
- You no longer have to create the `static get is() { return 'name-of-my-custom-element' }` function and the `is` member is now an instance member vs a static function in older versions, so replace all occurrences of `this.constructor.is` with `this.is`.
- This now makes use of private class members, so only upgrade if the browsers you target support that feature
