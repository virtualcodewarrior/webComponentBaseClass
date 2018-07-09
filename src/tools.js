/**
 * Converts a string consisting of dashes to camel case, e.g. test-with-dashes becomes testWithDashes
 * @param {string} p_String The input string that will be converted
 * @returns {string} An output string in camel case
 */
export function dashesToCamelCase(p_String) { return p_String.replace(/-([a-z0-9A-Z])/g, (p_Char) => p_Char[1].toUpperCase()).replace(/-$/g, ''); }

/**
 * Converts a camel case string to an all lower case string containing dashes. e.g. testString becomes test-string and Test becomes test
 * @param {string} p_String The input string that will be converted
 * @returns {string} The resulting all lower case string
 */
export function camelCaseToDashes(p_String) { return p_String.replace(/[a-z]?[A-Z]/g, (p_Char) => ((p_Char.length > 1) ? `${p_Char[0]}-${p_Char[1].toLowerCase()}` : `-${p_Char[0].toLowerCase()}`)); }

/**
 * Get the child elements of the given HTMLElement and finds the attribute using the given key. It then puts all those objects in an object for quick access
 * This only will give the expected results if all values for the keys are unique
 * @param {HTMLElement|DocumentFragment|ShadowRoot} p_HTMLElement The HTMElement that contains the children for which we want to retrieve the keys
 * @param {string} p_Tag The attribute tag for which we are building this object (e.g. 'id')
 * @returns {object} An object where each member references the HTMLElement that had the attribute with the given tag, attributes with dashes are converted to camel case
 */
export function createQuickAccess(p_HTMLElement, p_Tag) {
	return Array.from(p_HTMLElement.querySelectorAll(`[${p_Tag}]`)).reduce((p_Previous, p_Element) => { p_Previous[dashesToCamelCase(p_Element.getAttribute(p_Tag))] = p_Element; return p_Previous; }, {});
}
