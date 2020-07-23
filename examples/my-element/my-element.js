import { webComponentBaseClass } from '../../dist/webComponentBaseClass.js';
// import { webComponentBaseClass } from '../../src/webComponentBaseClass.js';

const changeHandlerKey = Symbol('changeHandler');
const componentName = 'my-element';
window.customElements.define(componentName, class extends webComponentBaseClass {
	static get is() { return componentName; }
	constructor() {
		super();
		// extra required initialization goes here ...

		// change observer implementation example for a property
		this[changeHandlerKey] = (p_NewValue, p_OldValue) => {
			this.$.output.textContent += `The component property 'propertyName' for web component ${this.constructor.is}, was changed from ${p_OldValue} to ${p_NewValue}\n`;
		};
	}

	// here we add some properties to this web component
	static get properties() {
		return {
			propertyName: { // the name of the property
				type: String, // (required) the type of the property, one of Array, Boolean, Number, Object, String
				value: 'value', // (optional) default value for the property
				reflectToAttribute: true, // (optional) indicate if you want the component attribute to always reflect the current property value
				observer: changeHandlerKey, // (optional) the name or symbol of a function or a function object in the class to be called when the value of the property is changed
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

	static get template() {
		return `
			<style>
				/* put you styling here */
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
});
