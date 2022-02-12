/**
 * Converts a string consisting of dashes to camel case, e.g. test-with-dashes becomes testWithDashes
 * @param {string} inputString The input string that will be converted
 * @returns {string} An output string in camel case
 */
export function dashesToCamelCase(inputString) { return inputString.replace(/-([a-z0-9A-Z])/g, (char) => char[1].toUpperCase()).replace(/-$/g, ''); }

/**
 * Converts a camel case string to an all lower case string containing dashes. e.g. testString becomes test-string and Test becomes test
 * @param {string} inputString The input string that will be converted
 * @returns {string} The resulting all lower case string
 */
export function camelCaseToDashes(inputString) { return inputString.replace(/[a-z]?[A-Z]/g, (char) => ((char.length > 1) ? `${char[0]}-${char[1].toLowerCase()}` : `-${char[0].toLowerCase()}`)); }

/**
 * Get the child elements of the given HTMLElement and finds the attribute using the given key. It then puts all those objects in an object for quick access
 * This only will give the expected results if all values for the keys are unique
 * @param {HTMLElement|DocumentFragment|Document|ShadowRoot} inputHTMLElement The HTMElement that contains the children for which we want to retrieve the keys
 * @param {string} tag The attribute tag for which we are building this object (e.g. 'id')
 * @returns {object} An object where each member references the HTMLElement that had the attribute with the given tag, attributes with dashes are converted to camel case
 */
export function createQuickAccess(inputHTMLElement, tag) {
	return Array.from(inputHTMLElement.querySelectorAll(`[${tag}]`)).reduce((previous, element) => { previous[dashesToCamelCase(element.getAttribute(tag))] = element; return previous; }, {});
}
