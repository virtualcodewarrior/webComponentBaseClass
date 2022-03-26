import { WebComponentBaseClass } from '../../dist/web-component-base-class.js';
// import { WebComponentBaseClass } from '../../src/web-component-base-class.js';

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
