import { webComponentBaseClass } from '../src/webComponentBaseClass.js';

describe('creates proper web components', () => {
	const container = document.createElement('div');
	const elementContainer = document.createElement('div');
	container.appendChild(elementContainer);
	let element = null;
	let attributeElements = [];
	const externalObserver = jasmine.createSpy('externalObserver'); /*eslint-disable-line*/
	beforeAll(() => {
		const customElementName = 'test-element';
		window.customElements.define(customElementName, class extends webComponentBaseClass {
			static get is() { return customElementName; }
			static get template() {
				return `<template>
					<div class="test" id="example-input"></div>
					<pre class="test" id="output"></pre>
					</template>`;
			}
			constructor() { super(); }
			static get properties() {
				return {
					string: {
						type: String,
					},
					number: {
						type: Number,
					},
					boolean: {
						type: Boolean,
					},
					object: {
						type: Object,
					},
					array: {
						type: Array,
					},
					stringDefault: {
						type: String,
						value: 'default',
					},
					numberDefault: {
						type: Number,
						value: 10,
					},
					booleanDefault: {
						type: Boolean,
						value: true,
					},
					objectDefault: {
						type: Object,
						value: { content: 5 },
					},
					arrayDefault: {
						type: Array,
						value: [0, 1, 2, 3],
					},
					stringReflect: {
						type: String,
						reflectToAttribute: true,
					},
					numberReflect: {
						type: Number,
						reflectToAttribute: true,
					},
					booleanReflect: {
						type: Boolean,
						reflectToAttribute: true,
					},
					objectReflect: {
						type: Object,
						reflectToAttribute: true,
					},
					arrayReflect: {
						type: Array,
						reflectToAttribute: true,
					},
					stringReflectDefault: {
						type: String,
						reflectToAttribute: true,
						value: 'reflect default',
					},
					numberReflectDefault: {
						type: Number,
						reflectToAttribute: true,
						value: 11,
					},
					booleanReflectDefault: {
						type: Boolean,
						reflectToAttribute: true,
						value: true,
					},
					objectReflectDefault: {
						type: Object,
						reflectToAttribute: true,
						value: { content: 6 },
					},
					arrayReflectDefault: {
						type: Array,
						reflectToAttribute: true,
						value: [7, 8, 9, 0],
					},
					stringObserved: {
						type: String,
						observer: '_stringObserver',
					},
					numberObserved: {
						type: Number,
						observer: '_numberObserver',
					},
					booleanObserved: {
						type: Boolean,
						observer: '_anyObserver',
					},
					objectObserved: {
						type: Object,
						observer: '_anyObserver',
					},
					arrayObserved: {
						type: Array,
						observer: externalObserver,
					},
				};
			}
			_stringObserver() {} /* eslint-disable-line*/
			_numberObserver() {} /* eslint-disable-line*/
			_anyObserver() {} /* eslint-disable-line*/
		});

		document.body.appendChild(container);
	});

	afterAll(() => {
		document.body.removeChild(container);
		Array.from(document.querySelectorAll('link[rel="import"]')).forEach((p_Element) => p_Element.parentNode.removeChild(p_Element));
	});

	beforeEach((done) => {
		const div = document.createElement('div');
		div.innerHTML = '<test-element id="attribs1" string="init1" number=1 boolean object=\'{ "htmlContent": 1 }\' array=\'["a", "b", "c"]\'></test-element>';
		div.innerHTML += '<test-element id="attribs2" string-default="init2" number-default=2 boolean-default object-default=\'{ "htmlContent": 2 }\' array-default=\'["d", "e"]\'></test-element>';
		div.innerHTML += '<test-element id="attribs3" string-reflect-default="init3" number-reflect-default=3 boolean-reflect-default object-reflect-default=\'{ "htmlContent": 3 }\' array-reflect-default=\'["f", "g", "h", "i"]\'></test-element>';
		div.innerHTML += '<test-element id="attribs4"></test-element>';
		const testElement4 = div.querySelector('#attribs4');
		testElement4.string = 'test4';
		testElement4.number = 123;
		testElement4.boolean = true;
		testElement4.object = { myobject: 'testing' };
		testElement4.array = [1, 2, 3, 5, 8, 13, 21];
		elementContainer.appendChild(div);
		element = document.createElement('test-element');
		elementContainer.appendChild(element);
		element.onAttached = () => {
			attributeElements = Array.from(document.querySelectorAll('test-element[id^="attribs"]'));
			externalObserver.calls.reset();
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

	it('quick access members should be available', () => {
		expect(element.$.exampleInput).not.toBe(undefined);
		expect(element.$.exampleInput.tagName).toBe('DIV');
		expect(element.$.exampleInput.getAttribute('id')).toBe('example-input');
		expect(element.$.output).not.toBe(undefined);
		expect(element.$.output.tagName).toBe('PRE');
		expect(element.$.output.getAttribute('id')).toBe('output');
	});

	it('querySelector replacement should work', () => {
		expect(element.$$('span')).toBe(null);
		expect(element.$$('div')).not.toBe(null);
		expect(element.$$('div').getAttribute('id')).toBe('example-input');
		expect(element.$$('#example-input')).not.toBe(null);
		expect(element.$$('#example-input').getAttribute('id')).toBe('example-input');
		expect(element.$$('.test')).not.toBe(null);
		expect(element.$$('.test').getAttribute('id')).toBe('example-input');
	});

	it('querySelectorAll replacement should work', () => {
		expect(element.$$$('span')).toEqual([]);
		expect(element.$$$('div')).toEqual([element.$$('div')]);
		expect(element.$$$('#example-input')).toEqual([element.$$('div')]);
		expect(element.$$$('.test')).toEqual([element.$$('div'), element.$$('pre')]);
	});

	it('handles attributes correctly', () => {
		// no reflect no default
		expect(element.string).toEqual('');
		expect(element.hasAttribute('string')).toBe(false);
		element.string = 'testSet';
		expect(element.string).toEqual('testSet');
		expect(element.hasAttribute('string')).toBe(false);

		expect(element.number).toEqual(0);
		expect(element.hasAttribute('number')).toBe(false);
		element.number = 5;
		expect(element.number).toEqual(5);
		expect(element.hasAttribute('number')).toBe(false);

		expect(element.boolean).toEqual(false);
		expect(element.hasAttribute('boolean')).toBe(false);
		element.boolean = true;
		expect(element.boolean).toEqual(true);
		expect(element.hasAttribute('boolean')).toBe(false);

		expect(element.object).toEqual({});
		expect(element.hasAttribute('object')).toBe(false);
		element.object = { tt: 'test', tt2: 5 };
		expect(element.object).toEqual({ tt: 'test', tt2: 5 });
		expect(element.hasAttribute('object')).toBe(false);

		expect(element.array).toEqual([]);
		expect(element.hasAttribute('array')).toBe(false);
		element.array = [1, 'a', 2, 'b'];
		expect(element.array).toEqual([1, 'a', 2, 'b']);
		expect(element.hasAttribute('array')).toBe(false);

		// no reflect with default
		expect(element.stringDefault).toEqual('default');
		expect(element.hasAttribute('string-default')).toBe(false);
		expect(element.hasAttribute('stringDefault')).toBe(false);
		element.stringDefault = 'testSet';
		expect(element.stringDefault).toEqual('testSet');
		expect(element.hasAttribute('string-default')).toBe(false);
		expect(element.hasAttribute('stringDefault')).toBe(false);

		expect(element.numberDefault).toEqual(10);
		expect(element.hasAttribute('number-default')).toBe(false);
		expect(element.hasAttribute('numberDefault')).toBe(false);
		element.numberDefault = 5;
		expect(element.numberDefault).toEqual(5);
		expect(element.hasAttribute('number-default')).toBe(false);
		expect(element.hasAttribute('numberDefault')).toBe(false);

		expect(element.booleanDefault).toEqual(true);
		expect(element.hasAttribute('boolean-default')).toBe(false);
		expect(element.hasAttribute('booleanDefault')).toBe(false);
		element.booleanDefault = false;
		expect(element.booleanDefault).toEqual(false);
		expect(element.hasAttribute('boolean-default')).toBe(false);
		expect(element.hasAttribute('booleanDefault')).toBe(false);

		expect(element.objectDefault).toEqual({ content: 5 });
		expect(element.hasAttribute('object-default')).toBe(false);
		expect(element.hasAttribute('objectDefault')).toBe(false);
		element.objectDefault = { tt: 'test', tt2: 5 };
		expect(element.objectDefault).toEqual({ tt: 'test', tt2: 5 });
		expect(element.hasAttribute('object-default')).toBe(false);
		expect(element.hasAttribute('objectDefault')).toBe(false);

		expect(element.arrayDefault).toEqual([0, 1, 2, 3]);
		expect(element.hasAttribute('array-default')).toBe(false);
		expect(element.hasAttribute('arrayDefault')).toBe(false);
		element.arrayDefault = [1, 'a', 2, 'b'];
		expect(element.arrayDefault).toEqual([1, 'a', 2, 'b']);
		expect(element.hasAttribute('array-default')).toBe(false);
		expect(element.hasAttribute('arrayDefault')).toBe(false);

		// reflect no default
		expect(element.stringReflect).toEqual('');
		expect(element.hasAttribute('string-reflect')).toBe(false);
		element.stringReflect = 'testSet';
		expect(element.stringReflect).toEqual('testSet');
		expect(element.hasAttribute('string-reflect')).toBe(true);
		expect(element.getAttribute('string-reflect')).toEqual('testSet');

		expect(element.numberReflect).toEqual(0);
		expect(element.hasAttribute('number-reflect')).toBe(false);
		element.numberReflect = 5;
		expect(element.numberReflect).toEqual(5);
		expect(element.hasAttribute('number-reflect')).toBe(true);
		expect(element.getAttribute('number-reflect')).toEqual('5');

		expect(element.booleanReflect).toEqual(false);
		expect(element.hasAttribute('boolean-reflect')).toBe(false);
		element.booleanReflect = true;
		expect(element.booleanReflect).toEqual(true);
		expect(element.hasAttribute('boolean-reflect')).toBe(true);
		expect(element.getAttribute('boolean-reflect')).toEqual('');

		expect(element.objectReflect).toEqual({});
		expect(element.hasAttribute('object-reflect')).toBe(true);
		element.objectReflect = { tt: 'test', tt2: 5 };
		expect(element.objectReflect).toEqual({ tt: 'test', tt2: 5 });
		expect(element.hasAttribute('object-reflect')).toBe(true);
		expect(element.getAttribute('object-reflect')).toEqual('{"tt":"test","tt2":5}');

		expect(element.arrayReflect).toEqual([]);
		expect(element.hasAttribute('array-reflect')).toBe(true);
		element.arrayReflect = [1, 'a', 2, 'b'];
		expect(element.arrayReflect).toEqual([1, 'a', 2, 'b']);
		expect(element.hasAttribute('array-reflect')).toBe(true);
		expect(element.getAttribute('array-reflect')).toEqual('[1,"a",2,"b"]');

		// reflect with default
		expect(element.stringReflectDefault).toEqual('reflect default');
		expect(element.hasAttribute('string-reflect-default')).toBe(true);
		expect(element.getAttribute('string-reflect-default')).toEqual('reflect default');
		element.stringReflectDefault = 'testSet';
		expect(element.stringReflectDefault).toEqual('testSet');
		expect(element.hasAttribute('string-reflect-default')).toBe(true);
		expect(element.getAttribute('string-reflect-default')).toEqual('testSet');

		expect(element.numberReflectDefault).toEqual(11);
		expect(element.getAttribute('number-reflect-default')).toEqual('11');
		expect(element.hasAttribute('number-reflect-default')).toBe(true);
		element.numberReflectDefault = 5;
		expect(element.numberReflectDefault).toEqual(5);
		expect(element.hasAttribute('number-reflect-default')).toBe(true);
		expect(element.getAttribute('number-reflect-default')).toEqual('5');

		expect(element.booleanReflectDefault).toEqual(true);
		expect(element.hasAttribute('boolean-reflect-default')).toBe(true);
		expect(element.getAttribute('boolean-reflect-default')).toBe('');
		element.booleanReflectDefault = false;
		expect(element.booleanReflectDefault).toEqual(false);
		expect(element.hasAttribute('boolean-reflect-default')).toBe(false);

		expect(element.objectReflectDefault).toEqual({ content: 6 });
		expect(element.hasAttribute('object-reflect-default')).toBe(true);
		expect(element.getAttribute('object-reflect-default')).toEqual('{"content":6}');
		element.objectReflectDefault = { tt: 'test', tt2: 5 };
		expect(element.objectReflectDefault).toEqual({ tt: 'test', tt2: 5 });
		expect(element.hasAttribute('object-reflect-default')).toBe(true);
		expect(element.getAttribute('object-reflect-default')).toEqual('{"tt":"test","tt2":5}');

		expect(element.arrayReflectDefault).toEqual([7, 8, 9, 0]);
		expect(element.hasAttribute('array-reflect-default')).toBe(true);
		expect(element.getAttribute('array-reflect-default')).toEqual('[7,8,9,0]');
		element.arrayReflectDefault = [1, 'a', 2, 'b'];
		expect(element.arrayReflectDefault).toEqual([1, 'a', 2, 'b']);
		expect(element.hasAttribute('array-reflect-default')).toBe(true);
		expect(element.getAttribute('array-reflect-default')).toEqual('[1,"a",2,"b"]');
	});

	it('calls the proper observer', () => {
		spyOn(element, '_stringObserver');
		spyOn(element, '_numberObserver');
		spyOn(element, '_anyObserver');

		expect(element._stringObserver).not.toHaveBeenCalled();
		expect(element._numberObserver).not.toHaveBeenCalled();
		expect(element._anyObserver).not.toHaveBeenCalled();
		expect(externalObserver).not.toHaveBeenCalled();

		element.stringObserved = 'test';
		expect(element._stringObserver).toHaveBeenCalledWith('test', '');
		element.setAttribute('string-observed', 'other test');
		expect(element.stringObserved).toBe('other test');
		expect(element._stringObserver).toHaveBeenCalledWith('other test', 'test');

		expect(element._numberObserver).not.toHaveBeenCalled();
		expect(element._anyObserver).not.toHaveBeenCalled();
		expect(externalObserver).not.toHaveBeenCalled();

		element.numberObserved = 123;
		expect(element._numberObserver).toHaveBeenCalledWith(123, 0);
		element.setAttribute('number-observed', '321');
		expect(element.numberObserved).toBe(321);
		expect(element._numberObserver).toHaveBeenCalledWith(321, 123);

		expect(element._anyObserver).not.toHaveBeenCalled();
		expect(externalObserver).not.toHaveBeenCalled();

		element.booleanObserved = true;
		expect(element._anyObserver).toHaveBeenCalledWith(true, false);
		element._anyObserver.calls.reset();
		expect(element._anyObserver).not.toHaveBeenCalled();
		element.setAttribute('boolean-observed', '');
		expect(element.booleanObserved).toBe(true);
		expect(element._anyObserver).not.toHaveBeenCalled();
		element.setAttribute('boolean-observed', 'false');
		expect(element.booleanObserved).toBe(false);
		expect(element._anyObserver).toHaveBeenCalledWith(false, true);
		element.setAttribute('boolean-observed', 'bla');
		expect(element.booleanObserved).toBe(true);
		expect(element._anyObserver).toHaveBeenCalledWith(true, false);

		element._anyObserver.calls.reset();
		expect(element._anyObserver).not.toHaveBeenCalled();
		expect(externalObserver).not.toHaveBeenCalled();

		const testObject = { test: 1 };
		element.objectObserved = testObject;
		expect(element._anyObserver).toHaveBeenCalled();

		element._anyObserver.calls.reset();
		expect(element._anyObserver).not.toHaveBeenCalled();

		element.objectObserved = testObject;
		expect(element._anyObserver).not.toHaveBeenCalled();

		element.objectObserved = { test: 4 };
		expect(element._anyObserver).toHaveBeenCalled();

		element._anyObserver.calls.reset();
		expect(element._anyObserver).not.toHaveBeenCalled();

		element.setAttribute('object-observed', '{"tt":"test"}');
		expect(element.objectObserved).toEqual({ tt: 'test' });
		expect(element._numberObserver).toHaveBeenCalled();

		expect(externalObserver).not.toHaveBeenCalled();

		const testArray = ['test', 1];
		element.arrayObserved = testArray;
		expect(externalObserver).toHaveBeenCalled();

		externalObserver.calls.reset();
		expect(externalObserver).not.toHaveBeenCalled();

		element.arrayObserved = testArray;
		expect(externalObserver).not.toHaveBeenCalled();

		element.arrayObserved = ['t', 5];
		expect(externalObserver).toHaveBeenCalled();

		externalObserver.calls.reset();
		expect(externalObserver).not.toHaveBeenCalled();

		element.setAttribute('array-observed', '[5, "test"]');
		expect(element.arrayObserved).toEqual([5, 'test']);
		expect(externalObserver).toHaveBeenCalled();
	});

	it('initializes properly from html code', () => {
		expect(attributeElements[0].string).toEqual('init1');
		expect(attributeElements[0].number).toEqual(1);
		expect(attributeElements[0].boolean).toEqual(true);
		expect(attributeElements[0].object).toEqual({ htmlContent: 1 });
		expect(attributeElements[0].array).toEqual(['a', 'b', 'c']);
		expect(attributeElements[0].stringDefault).toEqual('default');
		expect(attributeElements[0].numberDefault).toEqual(10);
		expect(attributeElements[0].booleanDefault).toEqual(true);
		expect(attributeElements[0].objectDefault).toEqual({ content: 5 });
		expect(attributeElements[0].arrayDefault).toEqual([0, 1, 2, 3]);
		expect(attributeElements[0].stringReflect).toEqual('');
		expect(attributeElements[0].numberReflect).toEqual(0);
		expect(attributeElements[0].booleanReflect).toEqual(false);
		expect(attributeElements[0].objectReflect).toEqual({});
		expect(attributeElements[0].arrayReflect).toEqual([]);
		expect(attributeElements[0].stringReflectDefault).toEqual('reflect default');
		expect(attributeElements[0].numberReflectDefault).toEqual(11);
		expect(attributeElements[0].booleanReflectDefault).toEqual(true);
		expect(attributeElements[0].objectReflectDefault).toEqual({ content: 6 });
		expect(attributeElements[0].arrayReflectDefault).toEqual([7, 8, 9, 0]);
		expect(attributeElements[0].stringObserved).toEqual('');
		expect(attributeElements[0].numberObserved).toEqual(0);
		expect(attributeElements[0].booleanObserved).toEqual(false);
		expect(attributeElements[0].objectObserved).toEqual({});
		expect(attributeElements[0].arrayObserved).toEqual([]);

		expect(attributeElements[1].string).toEqual('');
		expect(attributeElements[1].number).toEqual(0);
		expect(attributeElements[1].boolean).toEqual(false);
		expect(attributeElements[1].object).toEqual({});
		expect(attributeElements[1].array).toEqual([]);
		expect(attributeElements[1].stringDefault).toEqual('init2');
		expect(attributeElements[1].numberDefault).toEqual(2);
		expect(attributeElements[1].booleanDefault).toEqual(true);
		expect(attributeElements[1].objectDefault).toEqual({ htmlContent: 2 });
		expect(attributeElements[1].arrayDefault).toEqual(['d', 'e']);
		expect(attributeElements[1].stringReflect).toEqual('');
		expect(attributeElements[1].numberReflect).toEqual(0);
		expect(attributeElements[1].booleanReflect).toEqual(false);
		expect(attributeElements[1].objectReflect).toEqual({});
		expect(attributeElements[1].arrayReflect).toEqual([]);
		expect(attributeElements[1].stringReflectDefault).toEqual('reflect default');
		expect(attributeElements[1].numberReflectDefault).toEqual(11);
		expect(attributeElements[1].booleanReflectDefault).toEqual(true);
		expect(attributeElements[1].objectReflectDefault).toEqual({ content: 6 });
		expect(attributeElements[1].arrayReflectDefault).toEqual([7, 8, 9, 0]);
		expect(attributeElements[1].stringObserved).toEqual('');
		expect(attributeElements[1].numberObserved).toEqual(0);
		expect(attributeElements[1].booleanObserved).toEqual(false);
		expect(attributeElements[1].objectObserved).toEqual({});
		expect(attributeElements[1].arrayObserved).toEqual([]);

		expect(attributeElements[2].string).toEqual('');
		expect(attributeElements[2].number).toEqual(0);
		expect(attributeElements[2].boolean).toEqual(false);
		expect(attributeElements[2].object).toEqual({});
		expect(attributeElements[2].array).toEqual([]);
		expect(attributeElements[2].stringDefault).toEqual('default');
		expect(attributeElements[2].numberDefault).toEqual(10);
		expect(attributeElements[2].booleanDefault).toEqual(true);
		expect(attributeElements[2].objectDefault).toEqual({ content: 5 });
		expect(attributeElements[2].arrayDefault).toEqual([0, 1, 2, 3]);
		expect(attributeElements[2].stringReflect).toEqual('');
		expect(attributeElements[2].numberReflect).toEqual(0);
		expect(attributeElements[2].booleanReflect).toEqual(false);
		expect(attributeElements[2].objectReflect).toEqual({});
		expect(attributeElements[2].arrayReflect).toEqual([]);
		expect(attributeElements[2].stringReflectDefault).toEqual('init3');
		expect(attributeElements[2].numberReflectDefault).toEqual(3);
		expect(attributeElements[2].booleanReflectDefault).toEqual(true);
		expect(attributeElements[2].objectReflectDefault).toEqual({ htmlContent: 3 });
		expect(attributeElements[2].arrayReflectDefault).toEqual(['f', 'g', 'h', 'i']);
		expect(attributeElements[2].stringObserved).toEqual('');
		expect(attributeElements[2].numberObserved).toEqual(0);
		expect(attributeElements[2].booleanObserved).toEqual(false);
		expect(attributeElements[2].objectObserved).toEqual({});
		expect(attributeElements[2].arrayObserved).toEqual([]);

		expect(attributeElements[3].string).toEqual('test4');
		expect(attributeElements[3].number).toEqual(123);
		expect(attributeElements[3].boolean).toEqual(true);
		expect(attributeElements[3].object).toEqual({ myobject: 'testing' });
		expect(attributeElements[3].array).toEqual([1, 2, 3, 5, 8, 13, 21]);
		expect(attributeElements[3].stringDefault).toEqual('default');
		expect(attributeElements[3].numberDefault).toEqual(10);
		expect(attributeElements[3].booleanDefault).toEqual(true);
		expect(attributeElements[3].objectDefault).toEqual({ content: 5 });
		expect(attributeElements[3].arrayDefault).toEqual([0, 1, 2, 3]);
		expect(attributeElements[3].stringReflect).toEqual('');
		expect(attributeElements[3].numberReflect).toEqual(0);
		expect(attributeElements[3].booleanReflect).toEqual(false);
		expect(attributeElements[3].objectReflect).toEqual({});
		expect(attributeElements[3].arrayReflect).toEqual([]);
		expect(attributeElements[3].stringReflectDefault).toEqual('reflect default');
		expect(attributeElements[3].numberReflectDefault).toEqual(11);
		expect(attributeElements[3].booleanReflectDefault).toEqual(true);
		expect(attributeElements[3].objectReflectDefault).toEqual({ content: 6 });
		expect(attributeElements[3].arrayReflectDefault).toEqual([7, 8, 9, 0]);
		expect(attributeElements[3].stringObserved).toEqual('');
		expect(attributeElements[3].numberObserved).toEqual(0);
		expect(attributeElements[3].booleanObserved).toEqual(false);
		expect(attributeElements[3].objectObserved).toEqual({});
		expect(attributeElements[3].arrayObserved).toEqual([]);
	});

	it('should be able to add manually added entries to quick access', () => {
		expect(element.$).toEqual({
			exampleInput: jasmine.any(Object),
			output: jasmine.any(Object),
		});

		const newElem = document.createElement('div');
		newElem.setAttribute('id', 'new-item');
		element.$.output.appendChild(newElem);

		expect(element.$).toEqual({
			exampleInput: jasmine.any(Object),
			output: jasmine.any(Object),
		});

		element.refreshQuickAccess();

		expect(element.$).toEqual({
			exampleInput: jasmine.any(Object),
			output: jasmine.any(Object),
			newItem: jasmine.any(Object),
		});
	});
});
