/* eslint-disable */
module.exports = {
	env: {
		node: true,
		browser: true, // we are targeting browser environments
		es6: true, // we use es6
		jasmine: true, // we use jasmine for testing
	},
	plugins: [
		'jasmine',
	],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 13,
	},
	// 'extends': 'eslint:recommended', // don't use any default settings, we will specify all settings explicitely
	rules: {
		'no-cond-assign': ['error'],			        //	disallow assignment operators in conditional expressions
		'no-console': 'off', // ['error'],				//	disallow the use of console
		'no-constant-condition': ['error'],		        //	disallow constant expressions in conditions
		'no-control-regex': ['error'],			        //	disallow control characters in regular expressions
		'no-debugger': ['error'],				        //	disallow the use of debugger
		'no-dupe-args': ['error'],				        //	disallow duplicate arguments in function definitions
		'no-dupe-keys': ['error'],				        //	disallow duplicate keys in object literals
		'no-duplicate-case': ['error'],			        //	disallow duplicate case labels
		'no-empty-character-class': ['error'],	        //	disallow empty character classes in regular expressions
		'no-empty': ['error'],					        //	disallow empty block statements
		'no-ex-assign': ['error'],				        //	disallow reassigning exceptions in catch clauses
		'no-extra-boolean-cast': ['error'],		        //	disallow unnecessary boolean casts
		'no-extra-parens': ['error', 'functions'],	    //	autofixable disallow unnecessary parentheses
		'no-extra-semi': ['error'],				        //	autofixable disallow unnecessary semicolons
		'no-func-assign': ['error'],			        //	disallow reassigning function declarations
		'no-inner-declarations': ['error'],		        //	disallow function or var declarations in nested blocks
		'no-invalid-regexp': ['error'],			        //	disallow invalid regular expression strings in RegExp constructors
		'no-irregular-whitespace': ['error'],	        //	disallow irregular whitespace outside of strings and comments
		'no-obj-calls': ['error'],				        //	disallow calling global object properties as functions
		'no-prototype-builtins': 'off',			        //	disallow calling some Object.prototype methods directly on objects
		'no-regex-spaces': ['error'],			        //	autofixable disallow multiple spaces in regular expressions
		'no-sparse-arrays': ['error'],			        //	disallow sparse arrays
		'no-template-curly-in-string': ['error'],	    //	disallow template literal placeholder syntax in regular strings
		'no-unexpected-multiline': ['error'],	        //	disallow confusing multiline expressions
		'no-unreachable': ['error'],			        //	disallow unreachable code after return, throw, continue, and break statements
		'no-unsafe-finally': ['error'],			        //	disallow control flow statements in finally blocks
		'no-unsafe-negation': ['error'],		        //	autofixable disallow negating the left operand of relational operators
		'use-isnan': ['error'],					        //	require calls to isNaN() when checking for NaN
		'valid-jsdoc': ['error', { prefer: { arg: 'param', argument: 'param', constructor: 'class', return: 'returns' }, requireReturn: false, requireReturnType: true, requireParamDescription: true, requireReturnDescription: true }],	//	enforce valid JSDoc comments
		'valid-typeof': ['error'],				        //	enforce comparing typeof expressions against valid strings

		'accessor-pairs': ['error', { getWithoutSet: false }],	//	enforce getter and setter pairs in objects
		'array-callback-return': ['error'],		        //	enforce return statements in callbacks of array methods
		'block-scoped-var': ['error'],			        //	enforce the use of variables within the scope they are defined
		'class-methods-use-this': ['error'],	        //	enforce that class methods utilize this
		complexity: 'off',	            				//	enforce a maximum cyclomatic complexity allowed in a program
		'consistent-return': 'off',				        //	require return statements to either always or never specify values
		curly: ['error', 'all'],				        //	enforce consistent brace style for all control statements
		'default-case': 'off',					        //	require default cases in switch statements
		'dot-location': ['error', 'property'],	        //	enforce consistent newlines before and after dots (this does not force newlines it just forces the dot '.' to be with the object or the property when newlines are used.
		'dot-notation': 'off',					        //	autofixable enforce dot notation whenever possible
		eqeqeq: 'off',						            //	require the use of === and !==
		'guard-for-in': ['error'],				        //	require for-in loops to include an if statement
		'no-alert': 'off',						        //	disallow the use of alert, confirm, and prompt
		'no-caller': ['error'],					        //	disallow the use of arguments.caller or arguments.callee
		'no-case-declarations': ['error'],		        //	disallow lexical declarations in case clauses
		'no-div-regex': 'off',					        //	disallow division operators explicitly at the beginning of regular expressions
		'no-else-return': ['error'],			        //	disallow else blocks after return statements in if statements
		'no-empty-function': ['error'],			        //	disallow empty functions
		'no-empty-pattern': ['error'],			        //	disallow empty destructuring patterns
		'no-eq-null': ['error'],				        //	disallow null comparisons without type-checking operators
		'no-eval': ['error'],					        //	disallow the use of eval()
		'no-extend-native': ['error'],			        //	disallow extending native types
		'no-extra-bind': ['error'],				        //	disallow unnecessary calls to .bind()
		'no-extra-label': ['error'],			        //	disallow unnecessary labels
		'no-fallthrough': ['error', { commentPattern: 'falls?\\s?through' }],	//	disallow fallthrough of case statements
		'no-floating-decimal': ['error'],		        //	autofixable disallow leading or trailing decimal points in numeric literals
		'no-global-assign': ['error'],			        //	disallow assignments to native objects or read-only global variables
		'no-implicit-coercion': ['error', { boolean: false, number: true, string: false }],	//	autofixable disallow shorthand type conversions
		'no-implicit-globals': ['error'],		        //	disallow var and named function declarations in the global scope
		'no-implied-eval': ['error'],			        //	disallow the use of eval()-like methods
		'no-invalid-this': ['error'],			        //	disallow this keywords outside of classes or class-like objects
		'no-iterator': ['error'],				        //	disallow the use of the __iterator__ property
		'no-labels': ['error'],					        //	disallow labeled statements
		'no-lone-blocks': ['error'],			        //	disallow unnecessary nested blocks
		'no-loop-func': ['error'],				        //	disallow function declarations and expressions inside loop statements
		'no-magic-numbers': 'off',						//	disallow magic numbers
		'no-multi-spaces': ['error'],			        //	autofixable disallow multiple spaces
		'no-multi-str': ['error'],				        //	disallow multiline strings
		'no-new-func': ['error'],				        //	disallow new operators with the Function object
		'no-new-wrappers': ['error'],			        //	disallow new operators with the String, Number, and Boolean objects
		'no-new': ['error'],					        //	disallow new operators outside of assignments or comparisons
		'no-octal-escape': ['error'],			        //	disallow octal escape sequences in string literals
		'no-octal': ['error'],					        //	disallow octal literals
		'no-param-reassign': 'off',				        //	disallow reassigning function parameters
		'no-proto': ['error'],					        //	disallow the use of the __proto__ property
		'no-redeclare': ['error'],				        //	disallow var redeclaration
		'no-return-assign': ['error'],			        //	disallow assignment operators in return statements
		'no-script-url': ['error'],				        //	disallow javascript: urls
		'no-self-assign': ['error'],			        //	disallow assignments where both sides are exactly the same
		'no-self-compare': ['error'],			        //	disallow comparisons where both sides are exactly the same
		'no-sequences': ['error'],				        //	disallow comma operators
		'no-throw-literal': ['error'],			        //	disallow throwing literals as exceptions
		'no-unmodified-loop-condition': ['error'],	    //	disallow unmodified loop conditions
		'no-unused-expressions': ['error'],		        //	disallow unused expressions
		'no-unused-labels': ['error'],			        //	disallow unused labels
		'no-useless-call': ['error'],			        //	disallow unnecessary calls to .call() and .apply()
		'no-useless-concat': ['error'],			        //	disallow unnecessary concatenation of literals or template literals
		'no-useless-escape': ['error'],			        //	disallow unnecessary escape characters
		'no-void': ['error'],					        //	disallow void operators
		'no-warning-comments': 'off',			        //	disallow specified warning terms in comments
		'no-with': ['error'],					        //	disallow with statements
		radix: ['error'],						        //	enforce the consistent use of the radix argument when using parseInt()
		'vars-on-top': 'off',					        //	require var declarations be placed at the top of their containing scope
		'wrap-iife': ['error', 'inside'],		        //	require parentheses around immediate function invocations
		yoda: ['error', 'never'],				        //	require or disallow “Yoda” conditions

		strict: ['error'],						        //	autofixable require or disallow strict mode directives

		'init-declarations': 'off',				        //	require or disallow initialization in var declarations
		'no-catch-shadow': ['error'],			        //	disallow catch clause parameters from shadowing variables in the outer scope
		'no-delete-var': ['error'],				        //	disallow deleting variables
		'no-label-var': ['error'],				        //	disallow labels that share a name with a variable
		'no-restricted-globals': 'off',			        //	disallow specified global variables
		'no-shadow-restricted-names': ['error'],        //	disallow identifiers from shadowing restricted names
		'no-shadow': ['error'],					        //	disallow var declarations from shadowing variables in the outer scope
		'no-undef-init': 'off',					        //	disallow initializing variables to undefined
		'no-undef': ['error'],					        //	disallow the use of undeclared variables unless mentioned in /*global */ comments
		'no-undefined': 'off',				            //	disallow the use of undefined as an identifier
		'no-unused-vars': ['error'],			        //	disallow unused variables
		'no-use-before-define': ['error'],		        //	disallow the use of variables before they are defined

		'callback-return': 'off',				        //	require return statements after callbacks
		'global-require': 'off',				        //	require require() calls to be placed at top-level module scope
		'handle-callback-err': 'off',			        //	require error handling in callbacks
		'no-mixed-requires': 'off',				        //	disallow require calls to be mixed with regular var declarations
		'no-new-require': 'off',				        //	disallow new operators with calls to require
		'no-path-concat': 'off',				        //	disallow string concatenation with __dirname and __filename
		'no-process-env': 'off',				        //	disallow the use of process.env
		'no-process-exit': 'off',				        //	disallow the use of process.exit()
		'no-restricted-modules': 'off',			        //	disallow specified modules when loaded by require
		'no-restricted-properties': 'off',		        //	disallow certain properties on certain objects
		'no-sync': 'off',						        //	disallow synchronous methods

		'array-bracket-spacing': ['error', 'never'],	//	autofixable enforce consistent spacing inside array brackets
		'block-spacing': ['error', 'always'],	        //	autofixable enforce consistent spacing inside single-line blocks
		'brace-style': ['error', '1tbs', { allowSingleLine: true }],	//	enforce consistent brace style for blocks
		camelcase: 'off',  					            //	enforce camelcase naming convention
		'comma-dangle': ['error', 'always-multiline'],	//	autofixable require or disallow trailing commas
		'comma-spacing': ['error', { before: false, after: true }],	//	autofixable enforce consistent spacing before and after commas
		'comma-style': ['error', 'last'],		        //	autofixable enforce consistent comma style
		'computed-property-spacing': ['error', 'never'],	//	autofixable enforce consistent spacing inside computed property brackets
		'consistent-this': ['error', '_this'],	        //	enforce consistent naming when capturing the current execution context
		'eol-last': ['error'],					        //	autofixable enforce at least one newline at the end of files
		'func-call-spacing': ['error', 'never'],        //	autofixable require or disallow spacing between function identifiers and their invocations
		'func-names': 'off',					        //	require or disallow named function expressions
		'func-style': 'off',					        //	enforce the consistent use of either function declarations or expressions
		'id-blacklist': 'off',					        //	disallow specified identifiers
		'id-length': ['error', { min: 2, exceptions: ['x', 'y', '_', '$'] }],	//	enforce minimum and maximum identifier lengths
		'id-match': ['error', '(^[A-Za-z_0-9]+$)|(^[A-Z]([a-z]+[0-9]*([A-Z][a-z0-9]*)*)$)|(^_?[a-zE]+[0-9]*([A-Z][a-z0-9]*)*$)|NaN'],		    //	require identifiers to match a specified regular expression
		indent: ['error', 'tab', { VariableDeclarator: 0, SwitchCase: 1 }], //	autofixable enforce consistent indentation
		'jsx-quotes': 'off',					        //	autofixable enforce the consistent use of either double or single quotes in JSX attributes
		'key-spacing': ['error', { beforeColon: false, afterColon: true }],	//	autofixable enforce consistent spacing between keys and values in object literal properties
		'keyword-spacing': ['error', { before: true, after: true, overrides: { default: { after: false } } }],	//	autofixable enforce consistent spacing before and after keywords
		'line-comment-position': 'off',			        //	enforce position of line comments
		'linebreak-style': ['error', 'unix'],	        //	autofixable enforce consistent linebreak style
		'lines-around-comment': 'off',			        //	autofixable require empty lines around comments
		'lines-around-directive': 'off',		        //	require or disallow newlines around directives
		'max-depth': 'off',						        //	enforce a maximum depth that blocks can be nested
		'max-len': 'off',						        //	enforce a maximum line length
		'max-lines': 'off',						        //	enforce a maximum number of lines per file
		'max-nested-callbacks': 'off',			        //	enforce a maximum depth that callbacks can be nested
		'max-params': ['error', { max: 10 }],	        //	enforce a maximum number of parameters in function definitions
		'max-statements-per-line': 'off',		        //	enforce a maximum number of statements allowed per line
		'max-statements': 'off',				        //	enforce a maximum number of statements allowed in function blocks
		'multiline-ternary': 'off',				        //	enforce newlines between operands of ternary expressions
		'new-cap': ['error'],					        //	require constructor function names to begin with a capital letter
		'new-parens': ['error'],				        //	autofixable require parentheses when invoking a constructor with no arguments
		'newline-after-var': 'off',				        //	require or disallow an empty line after var declarations
		'newline-before-return': 'off',	                //	autofixable require an empty line before return statements
		'newline-per-chained-call': 'off',		        //	require a newline after each call in a method chain
		'no-array-constructor': ['error'],		        //	disallow Array constructors
		'no-bitwise': 'off',					        //	disallow bitwise operators
		'no-continue': ['error'],				        //	disallow continue statements
		'no-inline-comments': 'off',			        //	disallow inline comments after code
		'no-lonely-if': 'off',				            //	disallow if statements as the only statement in else blocks
		'no-mixed-operators': ['error'],		        //	disallow mixed binary operators
		'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],	//	disallow mixed spaces and tabs for indentation
		'no-multiple-empty-lines': ['error', { max: 2 }],	//	autofixable disallow multiple empty lines
		'no-negated-condition': 'off',		            //	disallow negated conditions
		'no-nested-ternary': 'off',			            //	disallow nested ternary expressions
		'no-new-object': ['error'],				        //	disallow Object constructors
		'no-plusplus': 'off',					        //	disallow the unary operators ++ and --
		'no-restricted-syntax': 'off',			        //	disallow specified syntax
		'no-tabs': 'off',						        //	disallow tabs in file
		'no-ternary': 'off',					        //	disallow ternary operators
		'no-trailing-spaces': ['error', { skipBlankLines: true }],	//	autofixable disallow trailing whitespace at the end of lines
		'no-underscore-dangle': 'off',			        //	disallow dangling underscores in identifiers
		'no-unneeded-ternary': ['error'],		        //	disallow ternary operators when simpler alternatives exist
		'no-whitespace-before-property': ['error'],	    //	autofixable disallow whitespace before properties
		'object-curly-newline': 'off',	                //	autofixable enforce consistent line breaks inside braces
		'object-curly-spacing': ['error', 'always'],	//	autofixable enforce consistent spacing inside braces
		'object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }],	//	enforce placing object properties on separate lines
		'one-var-declaration-per-line': ['error', 'initializations'],	//	require or disallow newlines around var declarations
		'one-var': 'off',						        //	enforce variables to be declared either together or separately in functions
		'operator-assignment': 'off',			        //	require or disallow assignment operator shorthand where possible
		'operator-linebreak': 'off',			        //	enforce consistent linebreak style for operators
		'padded-blocks': ['error', 'never'],	        //	autofixable require or disallow padding within blocks
		'quote-props': ['error', 'as-needed'],	        //	autofixable require quotes around object literal property names
		quotes: ['error', 'single', { avoidEscape: true }],	//	autofixable enforce the consistent use of either backticks, double, or single quotes
		'require-jsdoc': 'off', // ['error', { require: { FunctionDeclaration: true, MethodDefinition: true, ClassDeclaration: true } }],	//	require JSDoc comments
		'semi-spacing': ['error', { before: false, after: true }],	//	autofixable enforce consistent spacing before and after semicolons
		semi: ['error', 'always'],				        //	autofixable require or disallow semicolons instead of ASI
		'sort-keys': 'off',						        //	requires object keys to be sorted
		'sort-vars': 'off',						        //	require variables within the same declaration block to be sorted
		'space-before-blocks': ['error', 'always'],	    //	autofixable enforce consistent spacing before blocks
		'space-before-function-paren': ['error', 'never'],	//	autofixable enforce consistent spacing before function definition opening parenthesis
		'space-in-parens': ['error', 'never'],	        //	autofixable enforce consistent spacing inside parentheses
		'space-infix-ops': ['error', { int32Hint: true }],	//	autofixable require spacing around operators
		'space-unary-ops': ['error', { words: true, nonwords: false }],	//	autofixable enforce consistent spacing before or after unary operators
		'spaced-comment': ['error', 'always'],	        //	autofixable enforce consistent spacing after the // or /* in a comment
		'unicode-bom': 'off',					        //	autofixable require or disallow Unicode byte order mark (BOM)
		'wrap-regex': 'off',				            //	autofixable require parenthesis around regex literals

		'arrow-body-style': ['error', 'as-needed'],	    //	require braces around arrow function bodies
		'arrow-parens': ['error', 'always'],	        //	autofixable require parentheses around arrow function arguments
		'arrow-spacing': ['error', { before: true, after: true }],	//	autofixable enforce consistent spacing before and after the arrow in arrow functions
		'constructor-super': ['error'],			        //	require super() calls in constructors
		'generator-star-spacing': ['error', { before: false, after: true }],	//	autofixable enforce consistent spacing around * operators in generator functions
		'no-class-assign': ['error'],			        //	disallow reassigning class members
		'no-confusing-arrow': ['error', { allowParens: true }],	//	disallow arrow functions where they could be confused with comparisons
		'no-const-assign': ['error'],			        //	disallow reassigning const variables
		'no-dupe-class-members': ['error'],		        //	disallow duplicate class members
		'no-duplicate-imports': ['error', { includeExports: true }],	//	disallow duplicate module imports
		'no-new-symbol': ['error'],				        //	disallow new operators with the Symbol object
		'no-restricted-imports': 'off',			        //	disallow specified modules when loaded by import
		'no-this-before-super': ['error'],		        //	disallow this/super before calling super() in constructors
		'no-useless-computed-key': ['error'],	        //	disallow unnecessary computed property keys in object literals
		'no-useless-constructor': 'off',		        //	disallow unnecessary constructors
		'no-useless-rename': ['error'],			        //	autofixable disallow renaming import, export, and destructured assignments to the same name
		'no-var': ['error'],					        //	autofixable require let or const instead of var
		'object-shorthand': ['error', 'always'],		//	autofixable require or disallow method and property shorthand syntax for object literals
		'prefer-arrow-callback': ['error'],		        //	autofixable require arrow functions as callbacks
		'prefer-const': ['error'],				        //	autofixable require const declarations for variables that are never reassigned after declared
		'prefer-numeric-literals': ['error'],		    //	disallow parseInt() in favor of binary, octal, and hexadecimal literals
		'prefer-rest-params': ['error'],		        //	require rest parameters instead of arguments
		'prefer-spread': ['error'],				        //	require spread operators instead of .apply()
		'prefer-template': ['error'],			        //	autofixable require template literals instead of string concatenation
		'require-yield': ['error'],				        //	require generator functions to contain yield
		'rest-spread-spacing': ['error', 'never'],	    //	autofixable enforce spacing between rest and spread operators and their expressions
		'sort-imports': 'off',					        //	enforce sorted import declarations within modules
		'symbol-description': 'off',			        //	require symbol descriptions
		'template-curly-spacing': ['error', 'never'],	//	autofixable require or disallow spacing around embedded expressions of template strings
		'yield-star-spacing': ['error', { before: false, after: true }],	// autofixable require or disallow spacing around the * in yield* expressions
		// jasmine specific rules
		'jasmine/no-focused-tests': ['error'],          // dont check in fits, fdescribes
		'jasmine/expect-matcher': ['error'],            // expect() should always have a matcher. no expect("something")
		'jasmine/expect-single-argument': ['error'],    // expect should have a single argument
		'jasmine/missing-expect': ['error'],            // test does not test anything
		'jasmine/no-describe-variables': ['error'],     // no vars in describe scope. avoids memory leaks
		'jasmine/no-assign-spyon': ['error'],           // dont assign spyon to variable
		'jasmine/no-expect-in-setup-teardown': ['error'],                   // should not check things in teardowns
		'jasmine/no-global-setup': ['error'],           // no setup/teardown outside a describe
		'jasmine/no-spec-dupes': ['error'],             // no duplicate tests
		'jasmine/no-suite-callback-args': ['error'],    // suite function should not have arguments
		'jasmine/no-unsafe-spy': ['error'],             // no global spys
		'jasmine/prefer-jasmine-matcher': ['error'],    // use jasmine matchers
	},
};
