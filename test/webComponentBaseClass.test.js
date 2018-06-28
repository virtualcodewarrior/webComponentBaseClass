import { webComponentBaseClass } from '../src/webComponentBaseClass.js';


describe('creates proper web components', () => {
	let link = null;
	let element = null;
	beforeAll((done) => {
		link = document.createElement('link');
		link.rel = 'import';
		link.href = './base/test/resources/testTemplate.html';
		link.onload = () => {
			const customElementName = 'test-element';
			window.customElements.define(customElementName, class extends webComponentBaseClass {
				static get is() { return customElementName; }
				constructor() { super(); }
				static get properties() { return {}; }
			});
			element = document.createElement('test-element');
			element.onAttached = () => {
				done();
			};
			document.body.appendChild(element);
		};
		document.body.appendChild(link);
	});

	afterAll(() => {
		link.parentNode.removeChild(link);
		element.parentNode.removeChild(element);
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
