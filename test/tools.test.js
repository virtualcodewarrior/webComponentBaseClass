import { createQuickAccess, dashesToCamelCase, camelCaseToDashes } from '../src/tools.js';

describe('dashesToCamelCase', () => {
	it('converts properly to camel case', () => {
		expect(dashesToCamelCase('test')).toBe('test');
		expect(dashesToCamelCase('-test')).toBe('Test');
		expect(dashesToCamelCase('test-test')).toBe('testTest');
		expect(dashesToCamelCase('test-Test')).toBe('testTest');
		expect(dashesToCamelCase('-test-Test')).toBe('TestTest');
		expect(dashesToCamelCase('this-is-a-test-with-multiple-dashes')).toBe('thisIsATestWithMultipleDashes');
		expect(dashesToCamelCase('dash-on-the-end-')).toBe('dashOnTheEnd');
	});
});

describe('camelCaseToDashes', () => {
	it('converts properly to lowercased dashes', () => {
		expect(camelCaseToDashes('test')).toBe('test');
		expect(camelCaseToDashes('Test')).toBe('-test');
		expect(camelCaseToDashes('testTest')).toBe('test-test');
		expect(camelCaseToDashes('TestTest')).toBe('-test-test');
		expect(camelCaseToDashes('thisIsATestThatShouldHaveMultipleDashes')).toBe('this-is-a-test-that-should-have-multiple-dashes');
		expect(camelCaseToDashes('ThisIsATestThatShouldHaveMultipleDashes')).toBe('-this-is-a-test-that-should-have-multiple-dashes');
	});
});

describe('createQuickAccess', () => {
	it('creates members for a nested id', () => {
		const element = document.createElement('div');
		element.innerHTML = '<div><span><div id="test"></div></span></div>';
		expect(createQuickAccess(element, 'id')).toEqual({ test: element.querySelector('#test') });
	});

	it('creates members for multiple ids', () => {
		const element = document.createElement('div');
		element.innerHTML = '<div id="first"><span id="second"><div id="third"></div></span></div>';
		expect(createQuickAccess(element, 'id')).toEqual({
			 first: element.querySelector('#first'),
			 second: element.querySelector('#second'),
			 third: element.querySelector('#third'),
		});
	});

	it('members should be camel case for dashed ids', () => {
		const element = document.createElement('div');
		element.innerHTML = '<div id="first-with-dash"><span id="second-with-dash"><div id="third-with-dash"></div></span></div>';
		expect(createQuickAccess(element, 'id')).toEqual({
			firstWithDash: element.querySelector('#first-with-dash'),
			secondWithDash: element.querySelector('#second-with-dash'),
			thirdWithDash: element.querySelector('#third-with-dash'),
		});
	});

	it('should also work when using name as the tag', () => {
		const element = document.createElement('div');
		element.innerHTML = '<div name="first-with-dash"><span name="second-with-dash"><div name="third-with-dash"></div></span></div>';
		expect(createQuickAccess(element, 'name')).toEqual({
			firstWithDash: element.querySelector('[name="first-with-dash"]'),
			secondWithDash: element.querySelector('[name="second-with-dash"]'),
			thirdWithDash: element.querySelector('[name="third-with-dash"]'),
		});
	});

	it('only one tag type should be retrieved', () => {
		const element = document.createElement('div');
		element.innerHTML = '<div name="first-with-dash"><span id="second-with-dash"><div name="third-with-dash"></div></span></div>';
		expect(createQuickAccess(element, 'name')).toEqual({
			firstWithDash: element.querySelector('[name="first-with-dash"]'),
			thirdWithDash: element.querySelector('[name="third-with-dash"]'),
		});
	});
});
