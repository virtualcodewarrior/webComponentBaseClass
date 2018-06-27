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
			// add as many properties as you need
		};
	}

	// optional callback function that will be called after this instance of the web component
	// has been added to the DOM
	attached() {
		this.addAutoEventListener(this.$.exampleInput, 'change', () => {
			this.$.output.textContent += `The input has changed to ${this.$.exampleInput.value}\n`;
		});
		this.$.output.textContent += `web component ${this.constructor.is} was attached to the DOM\n`;

		this.$$('.exampleElement').style.backgroundColor = 'red';
		this.$$$('.exampleElement span').forEach((p_Element, p_Index) => { p_Element.style.backgroundColor = (p_Index % 2) ? 'green' : 'blue'; });
	}

	// optional callback function that will be called after this instance of the web component has been removed from the DOM
	detached() {
		console.log(`web component ${this.constructor.is} was removed from the DOM`);
	}

	// change observer implementation example for a property
	_myChangeHandler(p_NewValue, p_OldValue) {
		this.$.output.textContent += `The component property 'propertyName' for web component ${this.constructor.is}, was changed from ${p_OldValue} to ${p_NewValue}\n`;
	}
});
