import { webComponentBaseClass } from '../src/webComponentBaseClass.js';

describe('creates proper web components', () => {
	const container = document.createElement('div');
	const elementContainer = document.createElement('div');
	container.appendChild(elementContainer);
	const head = document.querySelector('head');
	let element = null;
	beforeAll((done) => {
		const link = document.createElement('link');
		link.rel = 'import';
		link.href = './base/test/resources/testTemplate.html';
		link.onload = () => {
			const customElementName = 'test-element';
			window.customElements.define(customElementName, class extends webComponentBaseClass {
				static get is() { return customElementName; }
				constructor() { super(); }
				static get properties() { return {}; }
			});
			done();
		};

		document.body.appendChild(container);
		head.appendChild(link);
	});

	afterAll(() => {
		document.body.removeChild(container);
		Array.from(document.querySelectorAll('link[rel="import"]')).forEach((p_Element) => p_Element.parentNode.removeChild(p_Element));
	});

	beforeEach((done) => {
		element = document.createElement('test-element');
		elementContainer.appendChild(element);
		element.onAttached = () => {
			done();
		};
	});

	afterEach(() => {
		elementContainer.innerHTML = '';
	});


	it('create a web component template', () => {
		expect(element).not.toBe(undefined);
	});

	it('element should be a valid web component instance', () => {
		expect(element.$).not.toBe(undefined);
		expect(element.$$).not.toBe(undefined);
		expect(element.$$$).not.toBe(undefined);
	});
});
