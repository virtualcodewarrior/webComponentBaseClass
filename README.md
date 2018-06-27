# createWebComponent
Library to simplify web component creation and reduce repetitive code for web components

## Usage
To use this library you will have to extend your web component class from the exported webComponentBaseClass:

```
import { webComponentBaseClass } from '../../src/webComponentBaseClass.js';

const componentName = 'my-element';
window.customElements.define(componentName, class extends webComponentBaseClass {
	static get is() { return componentName; }
	constructor() {
		super();
		// extra required initialization goes here ...
	}

	// here we add some properties to this web component
	static get properties() {
		return {
			propertyName: { // the name of the property
				type: String, // (required) the type of the property, one of Array, Boolean, Number, Object, String
				value: 'value', // (optional) default value for the property
				reflectToAttribute: true, // (optional) indicate if you want the component attribute to always reflect the current property value
				observer: '_myChangeHandler', // (optional) the name of a function in the class to be called when the value of the property is changed
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

	// change observer implementation example for a property
	_myChangeHandler(p_NewValue, p_OldValue) {
	}
});
```

The template definition for the web component should be constructed like this:
```
<!DOCTYPE html>
<template id="my-element">
	<!-- The id must match the componentName as specified in the javascript file -->
	<style>
		/* put you styling here */
	</style>
	<!-- The content of the template goes here -->
</template>
<script>
	(function storeTemplate() {
		const template = document.currentScript.ownerDocument.querySelector('template');
		window.webComponentTemplates = window.webComponentTemplates || new Map();
		window.webComponentTemplates.set(template.getAttribute('id'), template);
	})();
</script>
<script type="module" src="./my-element.js"></script>
```

This library has examples provided which also can be used for creating your own web components.
See the examples directory in the repo.

## Utility functions and objects
There is an number of extra utility functions available to you inside of the class, to make it easier to write your code.

### $ object
The class has an utility object called & which can be accessed from within the class using this.$;
The object will contain all the elements that are declared with an 'id' attribute within the template definition of the web component.
For instance when you define the following template content :
```
<template id="my-element">
	<input id="example-input">
	<pre id="output"></pre>
	<input id="exampleOutput">
	<button id="btn-1">
	<button id="test-button">
	<button id="Bla">
	<div id="some-container">
		<span id="container-content">
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
In the code you can use this to directly access those elements without having to requery them. e.g.

```
	...
	attached() {
		this.$.containerContent.textContent = "my content"; // this will set the text content of #container-content to 'my content'
	}
	...
```

If you remove elements with an id or add new elements with an id through code, you should call refreshQuickAccess to recreate the object

### $$ function
The $$(selector) function is a shorthand function for this.shadowRoot.querySelector(selector). The query is limited to the shadow DOM.
This can be used everywhere you want to do querySelector on the shadowDom only
For instance calling ```const input = this.$$('input');``` on the web component template definition used in the previous example, will return
the input element with the id of 'example-input'. If the selector cannot find a match undefined will be returned.

### $$$ function
The $$$(selector) function is a sharthand for Array.from(this.shadowRoot.querySelectorAll(selector)). The query is limited to the shadow DOM.
This can be used everywhere you want to do querySelectorAll on the shadowDom only and want to get back an array instead of an 'array like' object that is normally returned from querySelectorAll. This means you can use forEach and all the other array functions directly on the result.
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