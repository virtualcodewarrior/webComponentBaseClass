import { createQuickAccess, dashesToCamelCase, camelCaseToDashes } from './tools.js';

const propertiesKey = Symbol('properties');

/**
 * Create the shadow DOM and attach it to the given web component instance
 * @param {HTMLElement} componentInstance The web component instance to which we are attaching the shadow DOM
 * @param {string} componentTemplate The id of the web component template
 */
function createShadowDOM(componentInstance, componentTemplate) {
	const tempDiv = document.createElement('div');
	tempDiv.innerHTML = componentTemplate.trim();
	let templateInstance = tempDiv.firstChild;
	if (!(templateInstance instanceof HTMLTemplateElement)) {
		templateInstance = document.createElement('template');
		templateInstance.innerHTML = tempDiv.innerHTML;
	}

	// create the shadow DOM root here
	const shadowRoot = componentInstance.attachShadow({ mode: 'open' });
	shadowRoot.appendChild(templateInstance.content.cloneNode(true));
}

/**
 * Create quick access members for this component. This function will add the possibility to access child elements that have an id, through
 * the $ member, it also allows to do a querySelector on the shadow dom through the $$ function and it will add querySelectorAll through the $$$ function
 * The $$$ function will return the child members as an array and not as an node list
 * @param {webComponentBaseClass} componentInstance The component for which we are creating the quick access members
 */
function ensureQuickAccess(componentInstance) {
	if (!componentInstance.$) { // make sure we didn't do this already
		componentInstance.$ = createQuickAccess(componentInstance.shadowRoot, 'id');
		componentInstance.$$ = (selector) => componentInstance.shadowRoot.querySelector(selector);
		componentInstance.$$$ = (selector) => Array.from(componentInstance.shadowRoot.querySelectorAll(selector));
	}
}

/**
 * Initialize the web component after it has been added to the DOM
 * @param {webComponentBaseClass} componentInstance The component instance we are initializing
 * @param {object} properties The object that contains any web component specific properties
 */
function handleConnected(componentInstance, properties) {
	ensureQuickAccess(componentInstance);
	if (properties) {
		const originalValues = {};

		Object.keys(properties).forEach((propertyKey) => {
			const property = properties[propertyKey];
			const attributeName = camelCaseToDashes(propertyKey);

			originalValues[propertyKey] = componentInstance[propertyKey];

			Object.defineProperty(componentInstance, propertyKey, {
				get() { return componentInstance[propertiesKey][propertyKey]; },
				set(value) {
					const oldValue = componentInstance[propertiesKey][propertyKey];
					let toAttribute = (convertValue) => convertValue.toString();
					switch (property.type) {
						case Array: componentInstance[propertiesKey][propertyKey] = (typeof value === 'string') ? JSON.parse(value) : Array.isArray(value) ? value : []; toAttribute = (convertValue) => JSON.stringify(convertValue); break;
						case Boolean: componentInstance[propertiesKey][propertyKey] = value && value !== 'false'; toAttribute = () => ''; break;
						case Number: componentInstance[propertiesKey][propertyKey] = ((value === undefined) ? 0 : Number(value)) || 0; break;
						case Object: componentInstance[propertiesKey][propertyKey] = (typeof value === 'string') ? JSON.parse(value) : (typeof value === 'object') ? value : {}; toAttribute = (convertValue) => JSON.stringify(convertValue); break;
						case String: componentInstance[propertiesKey][propertyKey] = ((value === undefined || value === null) ? '' : String(value)) || ''; break;
					}
					if (property.observer) {
						if (typeof property.observer === 'function') {
							if (oldValue !== componentInstance[propertiesKey][propertyKey]) {
								property.observer(componentInstance, componentInstance[propertiesKey][propertyKey], oldValue);
							}
						} else if (componentInstance[property.observer]) {
							if (oldValue !== componentInstance[propertiesKey][propertyKey]) {
								componentInstance[property.observer](componentInstance[propertiesKey][propertyKey], oldValue);
							}
						} else {
							console.warn(`The observer with the name: '${property.observer}' was not found inside the class for web component ${componentInstance.constructor.is}. Make sure that you added a public function with the name '${property.observer}' to the class.`);
						}
					}
					if (property.reflectToAttribute) {
						if (componentInstance[propertiesKey][propertyKey]) {
							componentInstance.setAttribute(attributeName, toAttribute(componentInstance[propertiesKey][propertyKey]));
						} else {
							componentInstance.removeAttribute(attributeName);
						}
					}
				},
			});
		});

		Object.keys(properties).forEach((propertyKey) => {
			const property = properties[propertyKey];
			const attributeName = camelCaseToDashes(propertyKey);
			let userInitialized;
			let originalValue = originalValues[propertyKey] || null;

			if (originalValue) {
				switch (property.type) {
					case Array:
						if (Array.isArray(originalValue)) {
							componentInstance[propertyKey] = originalValue;
						} else {
							originalValue = null;
						}
						break;
					case Boolean:
						if (typeof originalValue === 'boolean') {
							componentInstance[propertyKey] = originalValue;
						} else {
							originalValue = null;
						}
						break;
					case Number:
						if (typeof originalValue === 'number') {
							componentInstance[propertyKey] = originalValue;
						} else {
							originalValue = null;
						}
						break;
					case Object:
						if (typeof originalValue === 'object') {
							componentInstance[propertyKey] = originalValue;
						} else {
							originalValue = null;
						}
						break;
					case String:
						if (typeof originalValue === 'string') {
							componentInstance[propertyKey] = originalValue;
						} else {
							originalValue = null;
						}
						break;
				}
			}

			if (componentInstance.hasAttribute(attributeName)) {
				userInitialized = componentInstance.getAttribute(attributeName);
			}

			if (property.reflectToAttribute || componentInstance[propertyKey] === undefined) {
				// use the user specified value if it was specified
				if (userInitialized !== undefined) {
					switch (property.type) {
						case Array:
							componentInstance[propertyKey] = JSON.parse(userInitialized);
							break;
						case Boolean:
							componentInstance[propertyKey] = userInitialized !== 'false';
							break;
						case Number:
							componentInstance[propertyKey] = Number(userInitialized);
							break;
						case Object:
							componentInstance[propertyKey] = JSON.parse(userInitialized);
							break;
						case String:
							componentInstance[propertyKey] = String(userInitialized);
							break;
					}
				} else { // use the default value
					switch (property.type) {
						case Array:
							componentInstance[propertyKey] = property.value || [];
							break;
						case Boolean:
							componentInstance[propertyKey] = property.value || false;
							break;
						case Number:
							componentInstance[propertyKey] = property.value || 0;
							break;
						case Object:
							componentInstance[propertyKey] = property.value || {};
							break;
						case String:
							componentInstance[propertyKey] = property.value || '';
							break;
					}
				}
			}
		});
	}
}

const base = 'web-component-base-element';

export class webComponentBaseClass extends HTMLElement {
	/**
	 * Get the name for the web component. Must be implemented by the class that extends from webComponentBaseClass
	 * @returns {string} The name of the web component
	 */
	static get is() { return base; }
	/**
	 * Get the template. This will return empty string by default so the class that extends from this must provide its own template
	 * This should be HTML code as a string wrapped within a template (e.g. <template>My template content...</template>
	 * @returns {string} The template to be used with the web component as a string
	 */
	static get template() { return ''; }
	/**
	 * Get the properties for this web component. Derived classes can override this if they want to provide properties. By default there are no properties
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
		this[propertiesKey] = {};
		this.$ = null;
		this.$$ = () => null;
		this.$$$ = () => [];
		console.assert(this.constructor.is !== base, 'Error, make sure that the web component implements: static get is() { return "name-of-your-web-component"; }');
		createShadowDOM(this, this.constructor.template);
		this.eventHandlers = [];
	}

	/**
	 * Called by the system when the web component has been added to the DOM
	 */
	connectedCallback() {
		handleConnected(this, this.constructor.properties);
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
		this.eventHandlers.forEach((handler) => { handler.element.removeEventListener(handler.event, handler.handler); });
	}

	/**
	 * Called by the system if an attribute value is changed
	 * @param {string} attribute The name of the attribute that is changed
	 * @param {*} oldValue The old value for the attribute
	 * @param {*} newValue The new value for the attribute
	 */
	attributeChangedCallback(attribute, oldValue, newValue) {
		const propertyName = dashesToCamelCase(attribute);
		ensureQuickAccess(this);
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
	 * Attach an event handler to the given element. This function will automatically clean all event handlers when the web component gets removed from the DOM
	 * @param {HTMLElement} element The element to which we are attaching the event handler
	 * @param {string} eventName The name of the event (e.g. click, mouse down etc)
	 * @param {function} callback The handler function to be called for the event
	 */
	addAutoEventListener(element, eventName, callback) {
		if (!this.eventHandlers.find((handler) => handler.element === element && handler.event === eventName && handler.handler === callback)) {
			this.eventHandlers.push({ element, event: eventName, handler: callback });
			element.addEventListener(eventName, callback);
		}
	}

	/**
	 * Remove an event handler that was previously attached by a call to addAutoEventListener
	 * @param {HTMLElement} element The element from which the event will be removed
	 * @param {string} eventName The name of the event to remove
	 * @param {function} callback The callback that was previously added for the event
	 */
	removeAutoEventListener(element, eventName, callback) {
		const eventIndex = this.eventHandlers.findIndex((handler) => handler.element === element && handler.event === eventName && handler.handler === callback);
		if (eventIndex !== -1) {
			this.eventHandlers.splice(eventIndex, 1);
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
}
