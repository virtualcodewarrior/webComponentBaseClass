/**
 * Get the child elements of the given HTMLElement and finds the attribute using the given key. It then puts all those objects in an object for quick access
 * This only will give the expected results if all values for the keys are unique
 * @param {HTMLElement} p_HTMLElement The HTMElement that contains the children for which we want to retrieve the keys
 * @param {string} p_Tag The attribute tag for which we are building this object (e.g. 'id')
 * @returns {object} An object where each member references the HTMLElement that had the attribute with the given tag
 */
export function createQuickAccess(p_HTMLElement, p_Tag) {
	return Array.from(p_HTMLElement.querySelectorAll(`[${p_Tag}]`)).reduce((p_Previous, p_Element) => { p_Previous[p_Element.getAttribute(p_Tag)] = p_Element; return p_Previous; }, {});
}
