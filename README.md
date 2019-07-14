# webComponentBaseClass
Library to simplify web component creation and reduce repetitive code for web components.
I love web components, but some of it can be a bit cumbersome or repetitive to write especially if you want to use shadow dom.
This library was created to simplify some of its creation and add some simple helper functions and objects to work with them after creation.
This library doesn't add any fancy data binding features to keep it simple and I personally don't really like it to hide away the way data transfers between
the DOM and JavaScript. Some of the helper functions are inspired by polymer.

## Production
The following steps can be used to install for production
### Installation
```
npm install web-component-base-class
```

## Development
The following steps can be used if you want to develop on this library
### Installation
Clone the git repo
```
git clone https://github.com/virtualcodewarrior/webComponentBaseClass.git
```
Install dev dependencies
```
npm install
```
### Build
Building is only needed to minify this library.
The following command will minify the src files and put them in a dist folder:
```
npm run build
```
### Manual Testing
To manually test the examples you can start a local web server using:
```
npm start
```
This will start a web server on your local machine on port 2211. If you want to use another port you can modify package.json and set a different port. Open a browser to http://localhost:2211/examples/ to see the library in action. This uses the minified library output, so you would have to build it first.

### Automatic testing
To run the unit tests once, run
```
npm test
```

To run the unit tests in watch mode, run
```
npm run watch-test
```

## Usage
To use this library you will have to extend your web component class from the exported webComponentBaseClass:

```
import { webComponentBaseClass } from '../../src/webComponentBaseClass.js';

const changeHandlerKey = Symbol('changeHandler');

const componentName = 'my-element';
window.customElements.define(componentName, class extends webComponentBaseClass {
	static get is() { return componentName; }
	constructor() {
		super();
		// extra required initialization goes here ...
    
    	// change observer implementation example for a property
		this[changeHandlerKey] = (p_NewValue, p_OldValue) => {
        }
	}

	// here we add some properties to this web component
	static get properties() {
		return {
			propertyName: { // the name of the property
				type: String, // (required) the type of the property, one of Array, Boolean, Number, Object, String
				value: 'value', // (optional) default value for the property
				reflectToAttribute: true, // (optional) indicate if you want the component attribute to always reflect the current property value
				observer: changeHandlerKey, // (optional) the name or a symbol for a function in the class to be called when the value of the property is changed
			},
			// add as many properties as you need ...
		};
	}

	// optional callback function that will be called after this instance of the web component
	// has been added to the DOM
	attached() {
		// extra initialization that only can be done after an instance of the class has been attached to the DOM
	}

	// optional callback function that will be called after this instance of the web component has been removed from the DOM
	detached() {
		// extra cleanup that only can be done after an instance of the class has been removed from the DOM
	}

	// string representation of the template to use with this web component
	// note that the whole content should be wrapped within a template element
	static get template() {
		return `
			<template>
				<style>
					/* put you styling here */
				</style>
				<!-- The content of the template goes here -->
			</template>`;
	}
});
```

This library has examples provided which also can be used for creating your own web components.
See the examples directory in the repo.

## Utility functions and objects
There is a number of extra utility functions available to you inside of the class, to make it easier to write your code.

### $ object
The class has an utility object called $ which can be accessed from within the class using this.$.
The object will contain all the elements that are declared with an 'id' attribute within the template definition of the web component.
For instance when you define the following template content:
```
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
Then the content of this.$ will be
```
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

```
	...
	attached() {
		this.$.containerContent.textContent = "my content"; // this will set the text content of #container-content to 'my content'
	}
	...
```

If you remove elements with an id or add new elements with an id through code, you should call *refreshQuickAccess* to recreate the object.

### $$ function
The $$(selector) function is a shorthand function for this.shadowRoot.querySelector(selector). The query is limited to the shadow DOM.
This can be used everywhere you want to do querySelector on the shadowDom only.
For instance calling ```const input = this.$$('input');``` on the web component template definition used in the previous example, will return
the input element with the id of 'example-input'. If the selector cannot find a match undefined will be returned.

### $$$ function
The $$$(selector) function is a shorthand for Array.from(this.shadowRoot.querySelectorAll(selector)). The query is limited to the shadow DOM.
This can be used everywhere you want to do querySelectorAll on the shadowDom only and want to get back an array instead of an 'array like' object that is normally returned from querySelectorAll. This means you can use forEach and all the other array functions directly on the result. If no objects matching the selector can be found, an empty array will be returned.
e.g.
```
this.$$$('button').forEach((p_Button) => { p_Button.disabled = true; }); // disable all our buttons
```

### addAutoEventListener function
addAutoEventListener(HTMLElement, EventName, CallbackFunction). This function allows you to attach an eventListener to the specified
HTMLElement. Any event listener attached using this function will automatically be cleaned up if the web component gets removed from the DOM
This makes it easier to add closure callback function without having to worry about how you clean them up later.
e.g.
```
attached() {
	this.addAutoEventListener(this.$.testButton, 'click', () => { alert('button clicked'); });
}
```

### removeAutoEventListener function
removeAutoEventListener(HTMLElement, EventName, CallbackFunction). This function allows you to clean up an eventListener previously added using the addAutoEventListener function. Of course if you want to use this function you will have to keep track of the element, event name and callback yourself so you can remove them properly.

### refreshQuickAccess function
call this function to rebuild the map of id to elements after you have manually modified the content of the shadow dom by removing or adding elements that have an id attribute.

## onAttached and onDetached
In some cases it might be useful to know when a web component has been added or removed from the DOM for a script using the web component as opposed to the scripts inside of the web component.
If a script needs to do additional things after a web component was added or removed, it can define a function that will be called after a web component has been attached or detached from the DOM.

e.g.
```
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
