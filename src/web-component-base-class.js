import { createQuickAccess, dashesToCamelCase, camelCaseToDashes } from './tools.js';

const base = 'web-component-base-element';
export class WebComponentBaseClass extends HTMLElement {
	#eventHandlers;
	#props;
	/**
	 * @property {() => void} [attached] - implement this inside your derived class to handle additional initialization after your class has been attached to the DOM
	 * @property {(component: WebComponentBaseClass) => void} [onAttached] - assign a function to this outside your derived class to handle additional initialization after your class has been attached to the DOM
	 * @property {() => void} [detached] - implement this inside your derived class to handle additional destruction after your class has been detached from the DOM
	 * @property {(component: WebComponentBaseClass) => void} [onDetached] - assign a function to this outside your derived class to handle additional destruction after your class has been detached from the DOM
	 * @property {undefined | HTMLElement} $ - directly access any elements with an id from your shadow dom, the id names will be in camelCase
	 * @property {(selector?: string) => HTMLElement | undefined} $$ - runs querySelector on your shadow DOM
	 * @property {(selector?: string) => HTMLElement[]} $$$ - runs querySelectorAll on your shadow DOM
	 */

	/**
	 * Get the name for the web component. Must be implemented by the class that extends from WebComponentBaseClass
	 * @returns {string} The name of the web component
	 */
	get is() { return this.tagName.toLowerCase() ?? base; }

	/**
	 * Get the template. This will return empty string by default so the class that extends from this must provide its own template
	 * This should be HTML code as a string (e.g. <div>My template content...</div>
	 * @returns {string} The template to be used with the web component as a string
	 */
	static get template() { return ''; }

	/**
	 * Get the properties for this web component. Derived classes can override this if they want to provide properties. By default, there are no properties
	 * @returns {object} The properties object
	 */
	static get properties() { return {}; }

	/**
	 * Get an array containing all attributes that have an observer attached
	 * @returns {array} Array containing all attributes that have an observer
	 */
	static get observedAttributes() { return (this.properties) ? Object.keys(this.properties).map((name) => camelCaseToDashes(name)) : []; }

	/**
	 * Constructor for this base class
	 */
	constructor() {
		super();
		this.#props = {};
		this.$ = undefined;
		this.$$ = () => undefined;
		this.$$$ = () => [];
		console.assert(this.is !== base, 'Error, don\'t forget to register your custom element using window.customElements.define(\'name-of-element\', MyElement)');
		this.#createShadowDOM(this.constructor.template);
		this.#eventHandlers = [];
	}

	/**
	 * Attach an event handler to the given element. This function will automatically clean all event handlers when the web component gets removed from the DOM
	 * @param {HTMLElement} element The element to which we are attaching the event handler
	 * @param {string} eventName The name of the event (e.g. click, mouse down etc)
	 * @param {function} callback The handler function to be called for the event
	 * @returns {function | undefined} A function that can be used to remove this event handler or undefined if this event handler already existed
	 */
	addAutoEventListener(element, eventName, callback) {
		let cleanupFunction;
		if (!this.#eventHandlers.find((handler) => handler.element === element && handler.event === eventName && handler.handler === callback)) {
			this.#eventHandlers.push({ element, event: eventName, handler: callback });
			element.addEventListener(eventName, callback);
			cleanupFunction = () => this.removeAutoEventListener(element, eventName, callback);
		}
		return cleanupFunction;
	}

	/**
	 * Remove an event handler that was previously attached by a call to addAutoEventListener
	 * @param {HTMLElement} element The element from which the event will be removed
	 * @param {string} eventName The name of the event to remove
	 * @param {function} callback The callback that was previously added for the event
	 */
	removeAutoEventListener(element, eventName, callback) {
		const eventIndex = this.#eventHandlers.findIndex((handler) => handler.element === element && handler.event === eventName && handler.handler === callback);
		if (eventIndex !== -1) {
			this.#eventHandlers.splice(eventIndex, 1);
			element.removeEventListener(eventName, callback);
		}
	}

	/**
	 * recreate the quick access object using the current content of the shadow dom
	 * use this when you manually add items to or remove items from the DOM
	 */
	refreshQuickAccess() {
		this.$ = createQuickAccess(this.shadowRoot, 'id');
	}

	/**
	 * @private
	 * Called by the system when the web component has been added to the DOM
	 */
	connectedCallback() {
		this.#handleConnected(this.constructor.properties);
		// this function should be implemented INSIDE the derived cass, if you want to do additional initialization after the component gets attached to the DOM
		if (this.attached) {
			this.attached();
		}
		// this function should be implemented OUTSIDE the derived cass, if you want to do additional initialization after the component gets attached to the DOM
		if (this.onAttached) {
			this.onAttached(this);
		}

		// setter to set the onAttached function, this setter only exist after the component has been attached and replaces the onAttached member
		// this will make sure that onAttached gets called immediately if the component was already attached
		Object.defineProperty(this, 'onAttached', {
			get() { return undefined; },
			set(callback) { callback(this); },
		});
	}

	/**
	 * @private
	 * Called by the system when the web component has been removed from the DOM
	 */
	disconnectedCallback() {
		// this function should be implemented INSIDE the derived class when needed to handle the component being removed from the DOM
		if (this.detached) {
			this.detached();
		}
		// this function can be implemented OUTSIDE of the derived class, if you want to be notified if the component has been removed from the DOM
		if (this.onDetached) {
			this.onDetached(this);
		}
		// remove any auto event handler that was added
		this.#eventHandlers.forEach((handler) => handler.element.removeEventListener(handler.event, handler.handler));
	}

	/**
	 * @private
	 * Called by the system if an attribute value is changed
	 * @param {string} attribute The name of the attribute that is changed
	 * @param {*} oldValue The old value for the attribute
	 * @param {*} newValue The new value for the attribute
	 */
	attributeChangedCallback(attribute, oldValue, newValue) {
		const propertyName = dashesToCamelCase(attribute);
		this.#ensureQuickAccess(this);
		// boolean are handled differently because the absence of the value also means false and the presence of the value also means true
		if (this.constructor.properties[propertyName] && this.constructor.properties[propertyName].type === Boolean) {
			oldValue = !!(oldValue === '' || (oldValue && oldValue !== 'false'));
			newValue = !!(newValue === '' || (newValue && newValue !== 'false'));
		}
		// we set our variable and the setter will handle the rest
		if (oldValue !== newValue) {
			this[propertyName] = newValue;
		}
	}

	/**
	 * Create quick access members for this component. This function will add the possibility to access child elements that have an id, through
	 * the $ member, it also allows to do a querySelector on the shadow dom through the $$ function and it will add querySelectorAll through the $$$ function
	 * The $$$ function will return the child members as an array and not as an node list
	 */
	#ensureQuickAccess() {
		if (!this.$) { // make sure we didn't do this already
			this.$ = createQuickAccess(this.shadowRoot, 'id');
			this.$$ = (selector) => this.shadowRoot.querySelector(selector);
			this.$$$ = (selector) => Array.from(this.shadowRoot.querySelectorAll(selector));
		}
	}

	/**
	 * Initialize the web component after it has been added to the DOM
	 * @param {object} properties The object that contains any web component specific properties
	 */
	#handleConnected(properties) {
		this.#ensureQuickAccess();
		if (properties) {
			const originalValues = {};

			Object.keys(properties).forEach((propertyKey) => {
				const property = properties[propertyKey];
				const attributeName = camelCaseToDashes(propertyKey);

				originalValues[propertyKey] = this[propertyKey];

				Object.defineProperty(this, propertyKey, {
					get() { return this.#props[propertyKey]; },
					set(value) {
						const oldValue = this.#props[propertyKey];
						let toAttribute = (convertValue) => convertValue.toString();
						switch (property.type) {
							case Array:
								this.#props[propertyKey] = (typeof value === 'string') ? JSON.parse(value) : Array.isArray(value) ? value : [];
								toAttribute = (convertValue) => JSON.stringify(convertValue);
								break;
							case Boolean:
								this.#props[propertyKey] = value && value !== 'false';
								toAttribute = () => '';
								break;
							case Number:
								this.#props[propertyKey] = ((value === undefined) ? 0 : Number(value)) || 0;
								break;
							case Object:
								this.#props[propertyKey] = (typeof value === 'string') ? JSON.parse(value) : (typeof value === 'object') ? value : {};
								toAttribute = (convertValue) => JSON.stringify(convertValue);
								break;
							case String:
								this.#props[propertyKey] = ((value === undefined || value === null) ? '' : String(value)) || '';
								break;
						}
						if (property.observer) {
							if (typeof property.observer === 'function') {
								if (oldValue !== this.#props[propertyKey]) {
									property.observer(this, this.#props[propertyKey], oldValue);
								}
							} else if (this[property.observer]) {
								if (oldValue !== this.#props[propertyKey]) {
									this[property.observer](this.#props[propertyKey], oldValue);
								}
							} else {
								console.warn(`The observer with the name: '${property.observer}' was not found inside the class for web component ${this.is}. Make sure that you added a public function with the name '${property.observer}' to the class.`);
							}
						}
						if (property.reflectToAttribute) {
							if (this.#props[propertyKey]) {
								this.setAttribute(attributeName, toAttribute(this.#props[propertyKey]));
							} else {
								this.removeAttribute(attributeName);
							}
						}
					},
				});
			});

			Object.keys(properties).forEach((propertyKey) => {
				const property = properties[propertyKey];
				const attributeName = camelCaseToDashes(propertyKey);
				let userInitialized;
				const originalValue = originalValues[propertyKey];

				if (originalValue) {
					switch (property.type) {
						case Array:
							if (Array.isArray(originalValue)) {
								this[propertyKey] = originalValue;
							}
							break;
						case Boolean:
							if (typeof originalValue === 'boolean') {
								this[propertyKey] = originalValue;
							}
							break;
						case Number:
							if (typeof originalValue === 'number') {
								this[propertyKey] = originalValue;
							}
							break;
						case Object:
							if (typeof originalValue === 'object') {
								this[propertyKey] = originalValue;
							}
							break;
						case String:
							if (typeof originalValue === 'string') {
								this[propertyKey] = originalValue;
							}
							break;
					}
				}

				if (this.hasAttribute(attributeName)) {
					userInitialized = this.getAttribute(attributeName);
				}

				if (property.reflectToAttribute || this[propertyKey] === undefined) {
					// use the user specified value if it was specified
					if (userInitialized !== undefined) {
						switch (property.type) {
							case Array:
								this[propertyKey] = JSON.parse(userInitialized);
								break;
							case Boolean:
								this[propertyKey] = userInitialized !== 'false';
								break;
							case Number:
								this[propertyKey] = Number(userInitialized);
								break;
							case Object:
								this[propertyKey] = JSON.parse(userInitialized);
								break;
							case String:
								this[propertyKey] = String(userInitialized);
								break;
						}
					} else { // use the default value
						switch (property.type) {
							case Array:
								this[propertyKey] = property.value || [];
								break;
							case Boolean:
								this[propertyKey] = property.value || false;
								break;
							case Number:
								this[propertyKey] = property.value || 0;
								break;
							case Object:
								this[propertyKey] = property.value || {};
								break;
							case String:
								this[propertyKey] = property.value || '';
								break;
						}
					}
				}
			});
		}
	}

	/**
	 * Create the shadow DOM and attach it to the given web component instance
	 * @param {string} componentTemplate The id of the web component template
	 */
	#createShadowDOM(componentTemplate) {
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = componentTemplate.trim();
		let templateInstance = tempDiv.firstChild;
		if (!(templateInstance instanceof HTMLTemplateElement)) {
			templateInstance = document.createElement('template');
			templateInstance.innerHTML = tempDiv.innerHTML;
		}

		// create the shadow DOM root here
		const shadowRoot = this.attachShadow({ mode: 'open' });
		shadowRoot.appendChild(templateInstance.content.cloneNode(true));
	}
}
