import { createQuickAccess, dashesToCamelCase, camelCaseToDashes } from './tools.js';

const propertiesKey = Symbol('properties');

/**
 * Create the shadow DOM and attach it to the given web component instance
 * @param {HTMLElement} p_ComponentInstance The web component instance to which we are attaching the shadow DOM
 * @param {string} p_ComponentTemplate The id of the web component template
 */
function createShadowDOM(p_ComponentInstance, p_ComponentTemplate) {
	// retrieve the correct template from our map of previously stored templates
	const tempDiv = document.createElement('div');
	tempDiv.innerHTML = p_ComponentTemplate.trim();
	const templateInstance = tempDiv.firstChild;

	// create the shadow DOM root here
	const shadowRoot = p_ComponentInstance.attachShadow({ mode: 'open' });
	shadowRoot.appendChild(templateInstance.content.cloneNode(true));
}

/**
 * Create quick access members for this component. This function will add the possibility to access child elements that have an id, through
 * the $ member, it also allows to do a querySelector on the shadow dom through the $$ function and it will add querySelectorAll through the $$$ function
 * The $$$ function will return the child members as an array and not as an node list
 * @param {webComponentBaseClass} p_ComponentInstance The component for which we are creating the quick access members
 */
function ensureQuickAccess(p_ComponentInstance) {
	if (!p_ComponentInstance.$) { // make sure we didn't do this already
		p_ComponentInstance.$ = createQuickAccess(p_ComponentInstance.shadowRoot, 'id');
		p_ComponentInstance.$$ = (p_Selector) => p_ComponentInstance.shadowRoot.querySelector(p_Selector);
		p_ComponentInstance.$$$ = (p_Selector) => Array.from(p_ComponentInstance.shadowRoot.querySelectorAll(p_Selector));
	}
}

/**
 * Initialize the web component after it has been added to the DOM
 * @param {webComponentBaseClass} p_ComponentInstance The component instance we are initializing
 * @param {object} p_Properties The object that contains any web component specific properties
 */
function handleConnected(p_ComponentInstance, p_Properties) {
	ensureQuickAccess(p_ComponentInstance);
	if (p_Properties) {
		const originalValues = {};

		Object.keys(p_Properties).forEach((p_PropertyKey) => {
			const property = p_Properties[p_PropertyKey];
			const attributeName = camelCaseToDashes(p_PropertyKey);

			originalValues[p_PropertyKey] = p_ComponentInstance[p_PropertyKey];

			Object.defineProperty(p_ComponentInstance, p_PropertyKey, {
				get() { return p_ComponentInstance[propertiesKey][p_PropertyKey]; },
				set(p_Value) {
					const oldValue = p_ComponentInstance[propertiesKey][p_PropertyKey];
					let toAttribute = (p_ConvertValue) => p_ConvertValue.toString();
					switch (property.type) {
						case Array: p_ComponentInstance[propertiesKey][p_PropertyKey] = (typeof p_Value === 'string') ? JSON.parse(p_Value) : Array.isArray(p_Value) ? p_Value : []; toAttribute = (p_ConvertValue) => JSON.stringify(p_ConvertValue); break;
						case Boolean: p_ComponentInstance[propertiesKey][p_PropertyKey] = p_Value && p_Value !== 'false'; toAttribute = () => ''; break;
						case Number: p_ComponentInstance[propertiesKey][p_PropertyKey] = ((p_Value === undefined) ? 0 : Number(p_Value)) || 0; break;
						case Object: p_ComponentInstance[propertiesKey][p_PropertyKey] = (typeof p_Value === 'string') ? JSON.parse(p_Value) : (typeof p_Value === 'object') ? p_Value : {}; toAttribute = (p_ConvertValue) => JSON.stringify(p_ConvertValue); break;
						case String: p_ComponentInstance[propertiesKey][p_PropertyKey] = ((p_Value === undefined || p_Value === null) ? '' : String(p_Value)) || ''; break;
					}
					if (property.observer) {
						if (typeof property.observer === 'function') {
							if (oldValue !== p_ComponentInstance[propertiesKey][p_PropertyKey]) {
								property.observer(p_ComponentInstance, p_ComponentInstance[propertiesKey][p_PropertyKey], oldValue);
							}
						} else if (p_ComponentInstance[property.observer]) {
							if (oldValue !== p_ComponentInstance[propertiesKey][p_PropertyKey]) {
								p_ComponentInstance[property.observer](p_ComponentInstance[propertiesKey][p_PropertyKey], oldValue);
							}
						} else {
							console.warn(`The observer with the name: '${property.observer}' was not found inside the class for web component ${p_ComponentInstance.constructor.is}. Make sure that you added a public function with the name '${property.observer}' to the class.`);
						}
					}
					if (property.reflectToAttribute) {
						if (p_ComponentInstance[propertiesKey][p_PropertyKey]) {
							p_ComponentInstance.setAttribute(attributeName, toAttribute(p_ComponentInstance[propertiesKey][p_PropertyKey]));
						} else {
							p_ComponentInstance.removeAttribute(attributeName);
						}
					}
				},
			});
		});

		Object.keys(p_Properties).forEach((p_PropertyKey) => {
			const property = p_Properties[p_PropertyKey];
			const attributeName = camelCaseToDashes(p_PropertyKey);
			let userInitialized;
			let originalValue = originalValues[p_PropertyKey] || null;

			if (originalValue) {
				switch (property.type) {
					case Array:
						if (Array.isArray(originalValue)) {
							p_ComponentInstance[p_PropertyKey] = originalValue;
						} else {
							originalValue = null;
						}
						break;
					case Boolean:
						if (typeof originalValue === 'boolean') {
							p_ComponentInstance[p_PropertyKey] = originalValue;
						} else {
							originalValue = null;
						}
						break;
					case Number:
						if (typeof originalValue === 'number') {
							p_ComponentInstance[p_PropertyKey] = originalValue;
						} else {
							originalValue = null;
						}
						break;
					case Object:
						if (typeof originalValue === 'object') {
							p_ComponentInstance[p_PropertyKey] = originalValue;
						} else {
							originalValue = null;
						}
						break;
					case String:
						if (typeof originalValue === 'string') {
							p_ComponentInstance[p_PropertyKey] = originalValue;
						} else {
							originalValue = null;
						}
						break;
				}
			}

			/* if (originalValue === null)  { */
			if (p_ComponentInstance.hasAttribute(attributeName)) {
				userInitialized = p_ComponentInstance.getAttribute(attributeName);
			}

			if (property.reflectToAttribute || p_ComponentInstance[p_PropertyKey] === undefined) {
				// use the user specified value if it was specified
				if (userInitialized !== undefined) {
					switch (property.type) {
						case Array:
							p_ComponentInstance[p_PropertyKey] = JSON.parse(userInitialized);
							break;
						case Boolean:
							p_ComponentInstance[p_PropertyKey] = userInitialized !== 'false';
							break;
						case Number:
							p_ComponentInstance[p_PropertyKey] = Number(userInitialized);
							break;
						case Object:
							p_ComponentInstance[p_PropertyKey] = JSON.parse(userInitialized);
							break;
						case String:
							p_ComponentInstance[p_PropertyKey] = String(userInitialized);
							break;
					}
				} else { // use the default value
					switch (property.type) {
						case Array:
							p_ComponentInstance[p_PropertyKey] = property.value || [];
							break;
						case Boolean:
							p_ComponentInstance[p_PropertyKey] = property.value || false;
							break;
						case Number:
							p_ComponentInstance[p_PropertyKey] = property.value || 0;
							break;
						case Object:
							p_ComponentInstance[p_PropertyKey] = property.value || {};
							break;
						case String:
							p_ComponentInstance[p_PropertyKey] = property.value || '';
							break;
					}
				}
			}
			// }
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
	static get observedAttributes() { return (this.properties) ? Object.keys(this.properties).map((p_Name) => camelCaseToDashes(p_Name)) : []; }

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
			set(p_Callback) { p_Callback(this); },
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
		this.eventHandlers.forEach((p_Handler) => { p_Handler.element.removeEventListener(p_Handler.event, p_Handler.handler); });
	}

	/**
	 * Called by the system if an attribute value is changed
	 * @param {string} p_Attribute The name of the attribute that is changed
	 * @param {*} p_OldValue The old value for the attribute
	 * @param {*} p_NewValue The new value for the attribute
	 */
	attributeChangedCallback(p_Attribute, p_OldValue, p_NewValue) {
		const propertyName = dashesToCamelCase(p_Attribute);
		ensureQuickAccess(this);
		// boolean are handled differently because the absence of the value also means false and the presence of the value also means true
		if (this.constructor.properties[propertyName] && this.constructor.properties[propertyName].type === Boolean) {
			p_OldValue = !!(p_OldValue === '' || (p_OldValue && p_OldValue !== 'false'));
			p_NewValue = !!(p_NewValue === '' || (p_NewValue && p_NewValue !== 'false'));
		}
		// we set our variable and the setter will handle the rest
		if (p_OldValue !== p_NewValue) {
			this[propertyName] = p_NewValue;
		}
	}

	/**
	 * Attach an event handler to the given element. This function will automatically clean all event handlers when the web component gets removed from the DOM
	 * @param {HTMLElement} p_Element The element to which we are attaching the event handler
	 * @param {string} p_EventName The name of the event (e.g. click, mouse down etc)
	 * @param {function} p_Callback The handler function to be called for the event
	 */
	addAutoEventListener(p_Element, p_EventName, p_Callback) {
		if (!this.eventHandlers.find((p_Handler) => p_Handler.element === p_Element && p_Handler.event === p_EventName && p_Handler.handler === p_Callback)) {
			this.eventHandlers.push({ element: p_Element, event: p_EventName, handler: p_Callback });
			p_Element.addEventListener(p_EventName, p_Callback);
		}
	}

	/**
	 * Remove an event handler that was previously attached by a call to addAutoEventListener
	 * @param {HTMLElement} p_Element The element from which the event will be removed
	 * @param {string} p_EventName The name of the event to remove
	 * @param {function} p_Callback The callback that was previously added for the event
	 */
	removeAutoEventListener(p_Element, p_EventName, p_Callback) {
		const eventIndex = this.eventHandlers.findIndex((p_Handler) => p_Handler.element === p_Element && p_Handler.event === p_EventName && p_Handler.handler === p_Callback);
		if (eventIndex !== -1) {
			this.eventHandlers.splice(eventIndex, 1);
			p_Element.removeEventListener(p_EventName, p_Callback);
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
